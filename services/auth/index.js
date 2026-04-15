import dotenv from 'dotenv'
import app from './src/app.js'
import { connectDB } from './src/db/connectDB.js'
dotenv.config()

const PORT = process.env.PORT

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`auth service is running on http://localhost:${PORT}`)
    })
}).catch((error) => {
    console.error("DB connection failed:", error);
    throw error;
})