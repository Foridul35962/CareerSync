import express from 'express'
import * as authController from '../controllers/auth.controller.js'

const authRouter = express.Router()

authRouter.post('/registration', authController.registration)
authRouter.post('/verify-regi', authController.verifyRegi)
authRouter.post('/login', authController.login)
authRouter.get('/logout', authController.logout)
authRouter.post('/forget-pass', authController.forgetPass)
authRouter.post('/verify-forget-pass', authController.verifyPass)
authRouter.patch('/reset-pass', authController.resetPass)
authRouter.post('/resend-otp', authController.resendOtp)
authRouter.get('/get-user', authController.getUser)

export default authRouter