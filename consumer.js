const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "consumer-service",
  brokers: ["localhost:9092","localhost:9093","localhost:9094"],
  connectionTimeout: 3000,
  requestTimeout: 30000,
});

const topic = process.argv[2];
const groupId = process.argv[3];

if (!topic || !groupId) {
  console.error("Usage: node consumer.js <topic> <groupId>");
  process.exit(1);
}

const consumer = kafka.consumer({
  groupId,
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  rebalanceTimeout: 60000,
});

const runConsumer = async () => {
  try {
    await consumer.connect();
    console.log(`✅ Consumer connected (group: ${groupId}, topic: ${topic})`);

    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      partitionsConsumedConcurrently: 3,
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `📥 [${groupId}] ${topic} | Partition ${partition} | ${message.value.toString()}`
        );
      },
    });
  } catch (err) {
    console.error("❌ Consumer error:", err);
  }
};

process.on("SIGINT", async () => {
  console.log(`Shutting down consumer (${groupId}, ${topic})...`);
  await consumer.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log(`Shutting down consumer (${groupId}, ${topic})...`);
  await consumer.disconnect();
  process.exit(0);
});

runConsumer();
