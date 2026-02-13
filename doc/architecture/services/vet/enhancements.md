[← Back to Vet Documentation](./vet.md) | [Back to Overview](../../overview.md)

# Vet Enhancement Suggestions

Current status: **Hybrid Service** (Doctor Management + IoT Data).
Goal status: **Specialized Services**.

---

## 1. Split the Service (Separation of Concerns)
**The Problem**:
We have "Business Logic" (Doctor Profiles, Forms) mixed with "Big Data" (Millions of sensor readings).
*   Doctor Service needs **Reliability** and **ACID transactions**.
*   Telemetry Service needs **High Write Throughput** and **Speed**.
Putting them in one DB/Service scales poorly.

**Solution: Microservice Split**
1.  **Vet Service**: Keeps `Vet`, `VetForm`. Focuses on the "Business".
2.  **Telemetry Service**: Keeps `PPGReading`, `Activity`, `Threshold`. Focuses on "Data".

---

## 2. Time-Series Database (InfluxDB / TimescaleDB)
**The Problem**:
We are storing sensor data in **PostgreSQL**.
Table `PPGReading` will grow to **billions of rows** very fast.
Postgres will become slow for queries like "Show me average Heart Rate for last month".

**Solution: Dedicated TSDB**
*   Move `PPGReading` and `Activity` to **TimescaleDB** (Postgres extension) or **InfluxDB**.
*   **Benefits**:
    *   Automatic partitioning (chunking by time).
    *   Instant aggregations (Avg, Min, Max).
    *   Data retention policies (Auto-delete raw data after 1 year, keep daily averages).

---

## 3. Real-time Alerting Engine (Stream Processing)
**The Problem**:
If we check thresholds in the Python Request/Response cycle or a slow Celery job, the Alert might be late. "Your dog stopped breathing... 10 minutes ago."

**Solution: Stream Processing (Kafka Streams / Flink)**
*   Ingest data directly to Kafka.
*   A Stream Processor keeps the `Thresholds` in memory.
*   Checks limits in **milliseconds**.
*   Fires an "Alert Event" instantly.
