[← Back to Process Documentation](./process.md) | [Back to Overview](../../overview.md)

# Process Server Enhancement Suggestions

Current status: **Hybrid** (Kafka Ingest -> HTTP Output).
Goal status: **Pure Event-Driven Architecture**.

---

## 1. Eliminate HTTP Calls to Vet Service
**The Problem**:
Currently, `Gyro` and `PPG` workers calculate data and then `POST` it to `Vet Service`.
*   If **Vet Service** is down, **Data Processing stops** (or we lose data).
*   This creates **Tight Coupling** between the "Factory" and the "Hospital".

**Solution: Output Topics**
*   Instead of calling an API, Workers should publish to new Kafka Topics:
    *   `gyro_events` -> **Gyro Worker** -> `pet.activity.updates`
    *   `ppg` -> **PPG Worker** -> `pet.vitals.updates`
*   **Vet Service** (or a dedicated Saver Service) consumes these topics to save to DB.
*   **Benefit**: If Database is down, Kafka holds the messages. No data loss.

---

## 2. Shared Context Microservice
**The Problem**:
The `shared` folder is copied into every Docker container.
If we update the `DeviceContext` logic, we must **rebuild and redeploy** all 3 services.

**Solution: Context Service (or Redis Cache)**
*   Workers should fetch context from a centralized high-speed cache (Redis).
*   **Collar Service** updates Redis whenever a Pet is assigned to a Collar.
*   **Workers** read from Redis. No code sharing needed.

---

## 3. Use Stream Processing Framework
**The Problem**:
Writing raw `KafkaConsumer` loops in Python is error-prone (handling offsets, crashes, backpressure).

**Solution: Faust or Spark Streaming**
*   Use **Faust** (Python Stream Processing).
    ```python
    @app.agent(topic_ppg)
    async def process_ppg(stream):
        async for event in stream:
            # ... process ...
            await topic_vitals.send(result)
    ```
*   It handles concurrency, retries, and windowing automatically.
