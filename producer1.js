const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "producer-1",
  brokers: ["localhost:9092","localhost:9093","localhost:9094"],
  retry: { retries: 10 }
});

const producer = kafka.producer({
  allowAutoTopicCreation: false,
  idempotent: true,
  maxInFlightRequests: 5,
});

const runProducer = async () => {
  await producer.connect();
  console.log("✅ Producer1 connected");

  setInterval(async () => {
    try {
      const message = { value: `Producer1 -> topic1 @ ${new Date().toISOString()}` };
      await producer.send({
        topic: "topic1",
        acks: -1,
        messages: [message],
      });
      console.log("📤 Producer1 sent:", message.value);
    } catch (err) {
      console.error("❌ Producer1 error:", err);
    }
  }, 2000);
};

process.on("SIGINT", async () => {
  console.log("Shutting down Producer1...");
  await producer.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down Producer1...");
  await producer.disconnect();
  process.exit(0);
});

runProducer();
