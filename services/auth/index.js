import dotenv from 'dotenv'
import app from './src/app.js'
import { connectDB } from './src/db/connectDB.js'
import { startServer } from './src/db/redis.js'
import { initKafkaTopics } from './src/kafka/admin.js'
import { connectProducer } from './src/kafka/producer.js'

dotenv.config()

const PORT = process.env.PORT

const startApp = async () => {
    try {
        // Kafka first
        await initKafkaTopics()
        await connectProducer()

        // DB + Redis
        await connectDB()
        await startServer()

        // Then start server
        app.listen(PORT, () => {
            console.log(`auth service is running on http://localhost:${PORT}`)
        })

    } catch (error) {
        console.error("❌ App startup failed:", error)
        process.exit(1)
    }
}

startApp()