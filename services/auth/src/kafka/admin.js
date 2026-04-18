import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "auth-service",
    brokers: ["kafka:9092"],
});

export const initKafkaTopics = async () => {
    const admin = kafka.admin();

    try {
        await admin.connect();

        const topics = await admin.listTopics();

        if (!topics.includes("send-mail")) {
            console.log("📦 Creating topic: send-mail");

            await admin.createTopics({
                topics: [
                    {
                        topic: "send-mail",
                        numPartitions: 1,
                        replicationFactor: 1,
                    },
                ],
            });

            console.log("✅ Topic created");
        } else {
            console.log("ℹ️ Topic already exists");
        }

    } catch (error) {
        console.error("❌ Kafka admin error:", error.message);
    } finally {
        await admin.disconnect();
        console.log("🔌 Admin disconnected");
    }
};