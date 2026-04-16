import dotenv from 'dotenv'
import app from './src/app.js'
import { connectDB } from './src/db/connectDB.js'
import { startServer } from './src/db/redis.js'
dotenv.config()

const PORT = process.env.PORT

connectDB().then(() => {
    startServer().then(() => {
        app.listen(PORT, () => {
            console.log(`auth service is running on http://localhost:${PORT}`)
        })
    })
}).catch((error) => {
    console.error("DB connection failed:", error);
    throw error;
})