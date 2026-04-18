import sql from "../config/postgresql.js";
import redis from "../db/redis.js";
import ApiErrors from "../helpers/ApiErrors.js";
import AsyncHandler from "../helpers/AsyncHandler.js";
import { check, validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import ApiResponse from "../helpers/ApiResponse.js";
import jwt from 'jsonwebtoken'
import { publishMail } from "../kafka/topics.js";

export const registration = [
    check('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
    check('email')
        .trim()
        .isEmail()
        .withMessage('Enter a valid email'),
    check('phone_number')
        .trim()
        .isMobilePhone("bn-BD")
        .withMessage('Enter a valid phone number'),
    check('password')
        .trim()
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters')
        .matches(/[a-zA-Z]/)
        .withMessage('password must contain a letter')
        .matches(/[0-9]/)
        .withMessage('password must contain a number'),

    AsyncHandler(async (req, res) => {
        const { name, email, password, phone_number, role } = req.body
        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'wrong value', error.array())
        }

        const limitKey = `authLimit:${email}`
        const count = await redis.incr(limitKey)

        if (count === 1) {
            await redis.expire(limitKey, 1800)
        }

        if (count > 10) {
            throw new ApiErrors(429, 'too many request')
        }

        const existingUser = await sql.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        )

        if (existingUser.rows.length > 0) {
            throw new ApiErrors(400, 'user is already registered')
        }

        if (role !== 'jobseeker' && role !== 'recruiter') {
            throw new ApiErrors(400, 'invalid role')
        }

        const hashPassword = await bcrypt.hash(password, 12)

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        //send mail
        const message = {
            otp,
            email,
            type: "registration"
        }
        publishMail(message)

        const coolDownKey = `coolDownMail:${email}`
        await redis.set(coolDownKey, "1", "EX", 60)

        const redisKey = `userRegistration:${email}`
        await redis.set(redisKey, JSON.stringify({
            name: name,
            email: email,
            role: role,
            phone_number: phone_number,
            password: hashPassword,
            otp: otp,
            verify: false
        }), "EX", 300)

        return res
            .status(202)
            .json(
                new ApiResponse(202, {}, 'user registration successfully')
            )
    })
]

export const verifyRegi = AsyncHandler(async (req, res) => {
    const { otp, email } = req.body
    if (!email || !otp) {
        throw new ApiErrors(400, 'all value are required')
    }

    const limitKey = `authLimit:${email}`
    const count = await redis.incr(limitKey)

    if (count === 1) {
        await redis.expire(limitKey, 1800)
    }

    if (count > 10) {
        throw new ApiErrors(429, 'too many request')
    }

    const redisKey = `userRegistration:${email}`
    const redisData = await redis.get(redisKey)
    if (!redisData) {
        throw new ApiErrors(404, 'otp is expired')
    }

    const data = JSON.parse(redisData)
    if (data.otp !== otp) {
        throw new ApiErrors(400, 'otp is not matched')
    }

    const result = await sql.query(
        `INSERT INTO users(name, email, password, phone_number, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [data.name, data.email, data.password, data.phone_number, data.role]
    )
    const user = result.rows[0]

    if (!user) {
        throw new ApiErrors(500, 'user created failed')
    }

    await redis.del(redisKey)
    await redis.del(limitKey)

    return res
        .status(201)
        .json(
            new ApiResponse(201, {}, 'user verify successfully')
        )
})

export const login = [
    check('email')
        .trim()
        .isEmail()
        .withMessage('Enter a valid mail'),
    check('password')
        .trim()
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('wrong password')
        .matches(/[a-zA-Z]/)
        .withMessage('wrong password')
        .matches(/[0-9]/)
        .withMessage('wrong password'),

    AsyncHandler(async (req, res) => {
        const { email, password } = req.body

        const error = validationResult(req)
        if (!error.isEmpty()) {
            throw new ApiErrors(400, 'invalid value', error.array())
        }

        const limitKey = `authLimit:${email}`

        const count = await redis.incr(limitKey)
        if (count === 1) {
            await redis.expire(limitKey, 1800)
        }

        if (count > 10) {
            throw new ApiErrors(429, 'too many request')
        }

        let user

        const redisKey = `user:${email}`

        const redisUser = await redis.get(redisKey)

        if (!redisUser) {
            const result = await sql.query(`
            SELECT *
            FROM users
            WHERE email = $1
            `, [email]
            )

            user = result.rows[0];
        } else {
            user = JSON.parse(redisUser)
        }

        if (!user) {
            throw new ApiErrors(404, 'user is not registered')
        }

        if (!redisUser) {
            await redis.set(
                redisKey,
                JSON.stringify(user),
                "EX",
                600
            )
        }

        const isCorrectPass = await bcrypt.compare(password, user.password)
        if (!isCorrectPass) {
            throw new ApiErrors(400, 'password is not matched')
        }

        const token = await jwt.sign({ userId: user._id },
            process.env.TOKEN_SECRET,
            { expiresIn: process.env.TOKEN_EXPIRY }
        )

        const tokenOption = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 10 * 24 * 60 * 60 * 1000
        }

        user.password = undefined
        user.profile_pic_public_id = undefined
        user.resume_public_id = undefined

        await redis.del(limitKey)

        return res
            .status(200)
            .cookie('token', token, tokenOption)
            .json(
                new ApiResponse(200, user, 'user logged in successfully')
            )
    })
]

export const logout = AsyncHandler(async (req, res) => {
    const tokenOption = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 10 * 24 * 60 * 60 * 1000
    }

    return res
        .status(200)
        .clearCookie('token', tokenOption)
        .json(
            new ApiResponse(200, {}, 'user logged out successfully')
        )
})

export const forgetPass = AsyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) {
        throw new ApiErrors(400, 'email is required')
    }

    const limitKey = `authLimit:${email}`

    const count = await redis.incr(limitKey)
    if (count === 1) {
        await redis.expire(limitKey, 1800)
    }

    if (count > 10) {
        throw new ApiErrors(429, 'too many request')
    }

    let user

    const redisKey = `user:${email}`

    const redisUser = await redis.get(redisKey)

    if (!redisUser) {
        const result = await sql.query(`
            SELECT *
            FROM users
            WHERE email = $1
            `, [email]
        )

        user = result.rows[0];
    } else {
        user = JSON.parse(redisUser)
    }

    if (!user) {
        throw new ApiErrors(404, 'user is not registered')
    }

    if (!redisUser) {
        await redis.set(
            redisKey,
            JSON.stringify(user),
            "EX",
            600
        )
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    //send mail
    const message = {
        otp,
        email,
        type: "forgetPass"
    }
    publishMail(message)

    const coolDownKey = `coolDownMail:${email}`

    const ttl = await redis.ttl(coolDownKey)
    if (ttl > 0) {
        throw new ApiErrors(429, `please wait ${ttl}s`)
    }

    await redis.set(coolDownKey, "1", "EX", 60)

    const redisKeySequire = `forgetPass:${email}`
    await redis.set(redisKeySequire, JSON.stringify({
        otp: otp,
        verify: false
    }), "EX", 300)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, 'otp is sended')
        )
})

export const verifyPass = AsyncHandler(async (req, res) => {
    const { email, otp } = req.body
    if (!email || !otp) {
        throw new ApiErrors(400, 'all field are required')
    }

    const limitKey = `authLimit:${email}`

    const count = await redis.incr(limitKey)
    if (count === 1) {
        await redis.expire(limitKey, 1800)
    }

    if (count > 10) {
        throw new ApiErrors(429, 'too many request')
    }

    const redisKeySequire = `forgetPass:${email}`
    const result = await redis.get(redisKeySequire)
    if (!result) {
        throw new ApiErrors(400, "otp is expired")
    }

    const value = JSON.parse(result)

    if (otp !== value.otp) {
        throw new ApiErrors(400, 'otp is not matched')
    }

    await redis.set(redisKeySequire,
        JSON.stringify({
            otp: value.otp,
            verify: true
        }),
        "EX", 300
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, 'pass verify successful')
        )
})

export const resetPass = [
    check('email')
        .trim()
        .isEmail()
        .withMessage('Enter a valid email'),
    check('password')
        .trim()
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters')
        .matches(/[a-zA-Z]/)
        .withMessage('password must contain a letter')
        .matches(/[0-9]/)
        .withMessage('password must contain a number'),

    AsyncHandler(async (req, res) => {
        const { email, password } = req.body
        const error = validationResult(req)

        if (!error.isEmpty()) {
            throw new ApiErrors(400, "invalid value", error.array())
        }

        const limitKey = `authLimit:${email}`

        const count = await redis.incr(limitKey)
        if (count === 1) {
            await redis.expire(limitKey, 1800)
        }

        if (count > 10) {
            throw new ApiErrors(429, 'too many request')
        }

        const redisKeySequire = `forgetPass:${email}`
        const result = await redis.get(redisKeySequire)
        if (!result) {
            throw new ApiErrors(400, "time expired")
        }

        const value = JSON.parse(result)
        if (!value.verify) {
            throw new ApiErrors(400, 'email is not verified')
        }

        const hashPassword = await bcrypt.hash(password, 12)

        const user = await sql.query(`
            UPDATE users
            SET password = $1
            WHERE email = $2
            RETURNING *
            `, [hashPassword, email]
        )

        if (user.rows.length === 0) {
            throw new ApiErrors(500, 'password reset failed')
        }

        await redis.del(redisKeySequire)
        await redis.del(limitKey)

        return res
            .status(200)
            .json(
                new ApiResponse(200, {}, 'password reset successfully')
            )
    })
]

export const resendOtp = AsyncHandler(async (req, res) => {
    const { email, mailType } = req.body
    if (!mailType) {
        throw new ApiErrors(400, 'mailType is required')
    }

    if (mailType !== 'registration' && mailType !== 'forgetPass') {
        throw new ApiErrors(400, 'invalid mailType')
    }

    if (!email) {
        throw new ApiErrors(400, 'email is required')
    }

    const limitKey = `authLimit:${email}`

    const count = await redis.incr(limitKey)
    if (count === 1) {
        await redis.expire(limitKey, 1800)
    }

    if (count > 10) {
        throw new ApiErrors(429, 'too many request')
    }

    const coolDownKey = `coolDownMail:${email}`
    const ttl = await redis.ttl(coolDownKey)

    if (ttl > 0) {
        throw new ApiErrors(429, `please wait ${ttl}s before resending OTP`)
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    if (mailType === 'registration') {
        const redisKey = `userRegistration:${email}`
        const redisValue = await redis.get(redisKey)
        if (!redisValue) {
            throw new ApiErrors(400, 'value is expired, try again')
        }

        const redisValues = JSON.parse(redisValue)

        await redis.set(redisKey, JSON.stringify({
            name: redisValues.name,
            email: redisValues.email,
            role: redisValues.role,
            phone_number: redisValues.phone_number,
            password: redisValues.hashPassword,
            otp: otp,
            verify: false
        }), "EX", 300)
    }
    else if (mailType === 'forgetPass') {
        const resetRedisKey = `forgetPass:${email}`

        await redis.set(resetRedisKey,
            JSON.stringify({
                otp: otp,
                verify: false
            }),
            "EX",
            300
        )
    }

    //send mail
    const message = {
        otp,
        email,
        type: mailType
    }
    publishMail(message)

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, 'otp resended')
        )
})

export const getUser = AsyncHandler(async (req, res) => {
    const { token } = req.cookies
    if (!token) {
        throw new ApiErrors(401, "unauthorized access")
    }

    let decoded
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    } catch (error) {
        throw new ApiErrors(401, "unauthorized access")
    }

    if (!decoded) {
        throw new ApiErrors(401, "unauthorized access")
    }

    const userId = decoded.userId
    const result = await sql.query(`
        SELECT *
        FROM users
        WHERE _id=$1
        `, [userId]
    )

    if (!result.rows[0]) {
        throw new ApiErrors(404, "user is not found")
    }
    const user = result.rows[0]

    delete user.password
    delete user.profile_pic_public_id
    delete user.resume_public_id

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "user fetch done")
        )
})