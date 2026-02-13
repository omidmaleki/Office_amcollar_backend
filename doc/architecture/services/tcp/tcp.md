[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# TCP Service Documentation

## Introduction
The **TCP Service** is the **"Protocol Adapter"** or **"Ingest Gateway"**.
Many low-cost IoT devices (like Smart Collars) do not speak HTTP or MQTT. They just open a raw TCP socket and dump bytes.
This service listens for those raw connections and converts them into structured **Kafka Events**.

**Why not use Django?**
Django is designed for HTTP (Request/Response). It is not efficient for holding thousands of open TCP connections that send data continuously.
This service uses **Raw Python Sockets** (and threading) for maximum performance and low overhead.

---

## 1. Port Mapping
The service listens on multiple ports, allowing it to route different data types to different Kafka topics.

| Port | Data Type | Target Kafka Topic |
| :--- | :--- | :--- |
| **9001** | Accelerometer/Gyro | `gyro_events` |
| **9002** | PPG (Heart Rate) | `ppg` |
| **9003** | GPS Location | `gps` |

---

## 2. Architecture
1.  **Listener Threads**:
    *   One thread per port.
    *   Accepts new connections (`socket.accept()`).
    *   Spawns a **Client Handler** thread for each device.

2.  **Client Handlers**:
    *   Reads raw bytes from the socket.
    *   Decodes string payload.
    *   Adds Metadata (`IP`, `Port`, `Timestamp`).
    *   Puts message into an internal **Queue**.

3.  **Kafka Workers**:
    *   One worker thread per topic.
    *   Reads from Queue.
    *   **Batches** messages (e.g., 50 at a time) for efficiency.
    *   Publishes to **Kafka**.

---

## 3. Data Transformation
**Input (Raw TCP)**:
```text
X:123,Y:456,Z:789
```

**Output (Kafka JSON)**:
```json
{
  "device_ip": "192.168.1.50",
  "port": 9001,
  "payload": "X:123,Y:456,Z:789",
  "timestamp": 1700000000
}
```

---

## 4. Technical Details
*   **Language**: Pure Python (No Frameworks).
*   **Dependencies**: `kafka-python`.
*   **Concurrency**: Thread-based (one thread per connection).
    *   *Note: This works well for hundreds of devices. For millions, we'd switch to `asyncio`.*
