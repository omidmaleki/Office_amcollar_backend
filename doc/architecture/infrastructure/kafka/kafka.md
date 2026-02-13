[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Kafka & Zookeeper Infrastructure Documentation

## Introduction for New Team Members
**Apache Kafka** is a streaming platform. Think of it as a high-speed, persistent **News Feed** for our microservices.
**Zookeeper** is the manager that keeps track of the Kafka servers (brokers).

**Analogy:**
*   **Kafka**: The "Twitter/X" of our system. Services "tweet" events (Messages) to specific hashtags (Topics).
*   **Zookeeper**: The "Database of Twitter" that knows which servers are alive and where the tweets are stored.
*   **Services**: They can be **Producers** (tweeting) or **Consumers** (reading tweets).

---

## 1. How We Use It

### Architecture
We use Kafka to let services talk to each other **without waiting**.
*   **Direct (Bad)**: User Service calls Email Service. "Hey, send welcome email. I'll wait." (Slow, high coupling).
*   **Kafka (Good)**: User Service publishes "UserRegistered" event to Kafka. Email Service eventually sees it and sends the email. (Fast, low coupling).

### Key Topics in AmCollar
A **Topic** is like a category or a channel.

| Topic Name | Producer | Consumer | Description |
| :--- | :--- | :--- | :--- |
| `collar_data_gps` | TCP Service | Process Server | Raw GPS coordinates from pet collars. |
| `collar_data_gyro` | TCP Service | Process Server | Gyroscope data (movement). |
| `user_events` | Auth Service | SMS/Email Service | "User logged in", "User signed up". |
| `alerts` | Process Server | Notification Service | "Pet left safe zone!" |

---

## 2. Configuration & Connection

### Docker Setup
We run two services in `docker-compose-prd.yml` (and local):
1.  **zookeeper**: The coordinator. Must start *before* Kafka.
2.  **kafka**: The broker.

### Hostnames & Ports
*   **Kafka Internal Host**: `kafka`
*   **Kafka Port**: `9092`
*   **Zookeeper Port**: `2181`

### Connection String (Bootstrap Servers)
In your `.env` files, you will see `KAFKA_BOOTSTRAP_SERVERS`.
*   **Internal (Docker)**: `kafka:9092`
*   **External (Localhost)**: `localhost:9092` (If exposed in docker-compose).

---

## 3. How to Debug (Viewing Events)

Since Kafka is a stream, you can't just "query" it like SQL. You have to "listen" to it.

### Using the Command Line
1.  **Enter the Kafka Container**:
    ```bash
    docker exec -it amcollar-kafka sh  # (Container name might vary, check `docker ps`)
    ```

2.  **List All Topics**:
    ```bash
    kafka-topics.sh --list --bootstrap-server localhost:9092
    ```

3.  **Read Messages (Consume)**:
    This prints messages from the `user_events` topic to your screen as they happen.
    ```bash
    kafka-console-consumer.sh --topic user_events --from-beginning --bootstrap-server localhost:9092
    ```

4.  **Send a Message (Produce)**:
    Useful for testing if the SMS service reacts to a fake event.
    ```bash
    kafka-console-producer.sh --topic user_events --bootstrap-server localhost:9092
    > {"event": "user_signup", "user_id": 123}
    ```

---

## 4. Key Takeaways
1.  **Asynchronous**: Producers don't know *when* or *if* the consumer processed the message. They just fire and forget.
2.  **Retention**: Kafka deletes old messages automatically (e.g., after 7 days). It is NOT a permanent database.
3.  **Ordering**: Messages are guaranteed to be ordered *only within a partition*.
