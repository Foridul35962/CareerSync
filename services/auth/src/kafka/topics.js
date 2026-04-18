import { getProducer } from "./producer.js";

export const publishMail = async (data) => {
    try {
        const producer = getProducer();

        await producer.send({
            topic: "send-mail",
            messages: [
                {
                    value: JSON.stringify(data),
                },
            ],
        });

    } catch (error) {
        console.error("❌ Kafka publish error:", error.message);
    }
};