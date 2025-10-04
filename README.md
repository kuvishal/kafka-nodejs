# Kafka Node.js Setup (Production Ready Example)

This project demonstrates a **production-ready Kafka setup** with **2 Node.js producers**, **3 consumers per topic**, and a **3-broker Kafka cluster** (with ZooKeeper).  
It also includes **Kafka UI**, **Prometheus**, and **Grafana** for monitoring.

---

## 📂 Project Structure

```
kafka-nodejs-setup/
│── producer1.js              # Producer for topic1
│── producer2.js              # Producer for topic2
│── consumer.js               # Generic consumer (pass topic & group as args)
│── docker-compose.yml        # Kafka cluster (3 brokers + Zookeeper + Kafka UI)
│── docker-compose.monitoring.yml # Prometheus, Grafana, Kafka Exporter
│── monitoring/
│    ├── prometheus.yml
│    └── grafana/
│         └── provisioning/
│              ├── datasources/datasources.yml
│              └── dashboards/dashboard.yml
```

---

## 🚀 Getting Started

### 1️⃣ Start Kafka Cluster
```sh
docker-compose up -d
```

This will start:
- 1 ZooKeeper
- 3 Kafka brokers (`kafka1:9092`, `kafka2:9093`, `kafka3:9094`)
- Kafka UI at [http://localhost:8080](http://localhost:8080)

### 2️⃣ Create Topics
```sh
docker exec -it kafka1 kafka-topics --create --topic topic1 --bootstrap-server kafka1:9092 --partitions 3 --replication-factor 2

docker exec -it kafka1 kafka-topics --create --topic topic2 --bootstrap-server kafka1:9092 --partitions 3 --replication-factor 2
```

Verify topics:
```sh
docker exec -it kafka1 kafka-topics --list --bootstrap-server kafka1:9092
```

### 3️⃣ Install Dependencies
```sh
npm init -y
npm install kafkajs
```

### 4️⃣ Run Producers
```sh
node producer1.js
node producer2.js
```

### 5️⃣ Run Consumers
You can start **3 consumers per topic** by using different group IDs:

```sh
# Consumers for topic1
node consumer.js topic1 group1
node consumer.js topic1 group2
node consumer.js topic1 group3

# Consumers for topic2
node consumer.js topic2 group1
node consumer.js topic2 group2
node consumer.js topic2 group3
```

Each consumer group will receive its own copy of messages.

---

## 📊 Monitoring Setup

### 6️⃣ Start Monitoring Stack
```sh
docker-compose -f docker-compose.monitoring.yml up -d
```

This starts:
- **Prometheus** → [http://localhost:9090](http://localhost:9090)
- **Grafana** → [http://localhost:3000](http://localhost:3000) (default user: `admin`, password: `admin`)
- **Kafka Exporter** (metrics endpoint at `:9308/metrics`)

### 7️⃣ Import Dashboards
- Grafana auto-loads dashboards from `monitoring/grafana/provisioning/dashboards/`
- Datasource (Prometheus) is pre-configured.

---

## 🛑 Stopping Services
```sh
docker-compose down
docker-compose -f docker-compose.monitoring.yml down
```

---

## ✅ Production Notes
- **Graceful shutdowns** with `SIGINT`/`SIGTERM`
- **Idempotent producers** enabled (`acks=-1`, retries configured)
- **Auto topic creation disabled** (must create topics explicitly)
- **Monitoring ready** with Prometheus + Grafana
- **Kafka UI** for debugging

---

Enjoy your production-ready Kafka + Node.js setup 🚀
