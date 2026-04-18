import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "auth-service",
    brokers: ["kafka:9092"],
});

let producer = null;

export const connectProducer = async () => {
    if (!producer) {
        producer = kafka.producer();

        await producer.connect();

        console.log("✅ Producer connected");
    }
};

export const getProducer = () => {
    if (!producer) {
        throw new Error("❌ Producer not connected. Call connectProducer first.");
    }
    return producer;
};