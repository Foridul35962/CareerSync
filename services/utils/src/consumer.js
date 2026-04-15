import { Kafka } from 'kafkajs'
import { generatePasswordResetMail, generateVerificationMail, sendBrevoMail } from './config/mail.js'
import dotenv from 'dotenv'
dotenv.config()

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const startSendMailConsumer = async () => {

    // GLOBAL STARTUP DELAY (IMPORTANT)
    console.log("⏳ Waiting for Kafka to stabilize...")
    await sleep(10000) // 10 sec delay

    const kafka = new Kafka({
        clientId: "mail-service",
        brokers: ["kafka:9092"]
    })

    const consumer = kafka.consumer({ groupId: "mail-service-group" })

    // retry connect
    while (true) {
        try {
            await consumer.connect()
            console.log("✅ Kafka consumer connected")
            break
        } catch (err) {
            console.log("⏳ Kafka not ready, retrying in 5s...", err.message)
            await sleep(5000)
        }
    }

    try {
        const topicName = "send-mail"

        await sleep(3000)

        await consumer.subscribe({
            topic: topicName,
            fromBeginning: false
        })

        console.log('📩 Mail service consumer started, listening for send-mail topic')

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    if (!message.value) return

                    const msg = JSON.parse(message.value.toString())

                    let subject, html

                    if (msg.type === 'registration') {
                        ({ subject, html } = generateVerificationMail(msg.otp))
                    } else if (msg.type === 'forgetPass') {
                        ({ subject, html } = generatePasswordResetMail(msg.otp))
                    } else {
                        return
                    }

                    if (subject && html) {
                        await sendBrevoMail(msg.email, subject, html)
                    }

                } catch (error) {
                    console.error("❌ Kafka consumer message error:", error)
                }
            }
        })

    } catch (error) {
        console.error('❌ Kafka consumer setup failed:', error)
    }
}