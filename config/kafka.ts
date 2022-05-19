import {Kafka} from "kafkajs";


const kafka = new Kafka({
    clientId:`restaurant-${process.env.PORT!}`,
    brokers:['localhost:9092'],
});
export const producer = kafka.producer();