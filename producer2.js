const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "producer-2",
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
  console.log("✅ Producer2 connected");

  setInterval(async () => {
    try {
      const message = { value: `Producer2 -> topic2 @ ${new Date().toISOString()}` };
      await producer.send({
        topic: "topic2",
        acks: -1,
        messages: [message],
      });
      console.log("📤 Producer2 sent:", message.value);
    } catch (err) {
      console.error("❌ Producer2 error:", err);
    }
  }, 3000);
};

process.on("SIGINT", async () => {
  console.log("Shutting down Producer2...");
  await producer.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down Producer2...");
  await producer.disconnect();
  process.exit(0);
});

runProducer();
