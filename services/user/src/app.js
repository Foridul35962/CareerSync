import express from 'express'
import cookieParser from 'cookie-parser'
import errorHandler from './helpers/ErrorHandler.js'
import userRouter from './routes/user.route.js'

const app = express()

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send("CarrerSync server user service is running ...")
})

app.use(errorHandler)

export default app