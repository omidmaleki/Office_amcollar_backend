[← Back to Kafka Documentation](./kafka.md) | [Back to Overview](../../overview.md)

# Kafka Enhancement Suggestions

This document outlines improvements to make our event streaming platform production-ready, secure, and robust.

---

## 1. Security Improvements

### A. Authentication & Encryption (SASL/SSL)
**Why?**
Currently, anyone inside our Docker network (or if a port is accidentally exposed) can connect to Kafka and read ALL events (user locations, emails, activity). They could also inject fake events.
*   **SASL**: Requires a username/password to connect.
*   **SSL**: Encrypts data moving through wires.

**How?**
1.  Generate SSL Certificates for Brokers and Clients.
2.  Update `server.properties` in Kafka to enable `SASL_SSL`.
3.  Distribute specialized credentials to each microservice (no sharing!).

### B. Access Control Lists (ACLs)
**Why?**
The **SMS Service** should be allowed to *read* `user_events`, but it should never be able to *write* into `collar_data_gps`.
Least Privilege prevents a buggy service from corrupting the wrong topic.

**How?**
Use the `kafka-acls.sh` tool to define rules:
*   User `sms-service` ALLOW READ on Topic `user_events`.
*   User `tcp-service` ALLOW WRITE on Topic `collar_data_%`.

---

## 2. Reliability (Data Safety)

### A. Replication Factor via Multiple Brokers
**Why?**
Right now, we probably run 1 Kafka Broker.
*   **Scenario**: The broker crashes or the disk fails.
*   **Result**: The entire system stops. No data processing. Data loss.

**How?**
Run a **Cluster** of 3 Brokers.
Set `replication.factor = 3`.
This means every message is copied to 3 different servers. If one dies, the other two keep working seamlessly.

### B. Partitioning Strategy
**Why?**
*   **Parallelism**: If a topic has 1 partition, only 1 consumer can read from it at a time. If we have 10 million events/second, we are too slow.
*   **Ordering**: Kafka only guarantees order inside a Partition.

**How?**
Increase partitions (e.g., 3 or 6) for high-volume topics like `collar_data_gps`.
**Crucial**: Use the Device ID as the "Partition Key". This ensures all GPS points for *Rover the Dog* land in the same partition and stay in order (Point A -> Point B), even with multiple consumers.

---

## 3. Observability (Seeing What's Happening)

### A. Deploy a UI (AKHQ or Kowl)
**Why?**
Using the CLI (`kafka-console-consumer`) is hard and slow. We need a dashboard to see:
*   "How many messages are in the `signup` topic?"
*   "Why hasn't the Email Service sent emails for the last hour?"

**How?**
Add a container like **AKHQ** to `docker-compose.yml`. It gives you a web interface (`localhost:8080`) to browse topics and messages easily.

### B. Monitor Consumer Lag
**Why?**
"Consumer Lag" is the number of messages waiting to be processed.
*   Lag = 0: Real-time.
*   Lag = 1,000,000: We are heavily delayed.

**How?**
Use Prometheus/Grafana to map `kafka_consumer_group_lag`. Set an alert: "If Lag > 5000, wake up the developer."
