[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Process Server Documentation

## Introduction
The **Process Server** is the **"Telemetry Processing Factory"**.
It involves high-volume, real-time data ingestion from millions of smart collars.
Unlike other services (which are mostly standard Web APIs), this service is designed for **Stream Processing**.

**Architecture**:
It is a **Monorepo** containing 3 distinct sub-services:
1.  **GPS Service** (Django API): Manages Location History & Geofences.
2.  **Gyro Service** (Python Worker): Consumes `gyro_events` from Kafka to detect Activity (Running, Sleeping).
3.  **PPG Service** (Python Worker): Consumes `ppg` from Kafka to calculate Heart Rate & SpO2.

---

## 1. Sub-Services

### A. GPS Service (The Map)
*   **Type**: Django REST API.
*   **Responsibility**: Stores where the pet is.
*   **Database**: Uses **PostGIS** (PostgreSQL Extension) to store geospatial data (Points, Polygons).
*   **Key Models**: `Location`, `Geofence` (Virtual Fences), `Route`.

### B. Gyro Service (The Activity Tracker)
*   **Type**: Background Worker (Kafka Consumer).
*   **Input**: Raw Accelerometer/Gyroscope data (X, Y, Z axis).
*   **Logic**:
    *   Reads a "Window" of data (e.g., 5 seconds).
    *   Calculates movement intensity.
    *   Determines context (Pet Species/Breed via `shared` lib).
*   **Output**: Sends "Activity Level" to **Vet Service**.

### C. PPG Service (The Health Monitor)
*   **Type**: Background Worker (Kafka Consumer).
*   **Input**: Raw Light Sensor data (Red/IR light).
*   **Logic**:
    *   Signal Processing (Filtering noise).
    *   Computes Heart Rate (HR) and Oxygen Saturation (SpO2).
    *   Computes Heart Rate Variability (HRV).
*   **Output**: Sends Health Vitals to **Vet Service**.

---

## 2. Shared Library (`shared/`)
Since the workers need to know *which* pet owns *which* collar, they use a shared module:
*   **`resolve_device_context(mac_address)`**:
    *   Caches Device -> Pet mappings.
    *   Returns: `pet_id`, `species`, `breed`, `weight`.

---

## 3. Data Flow
1.  **Collar**: Sends MQTT/HTTP packet -> **Kafka**.
2.  **Workers (Gyro/PPG)**: Wake up, consume message.
3.  **Workers**: Process math (NumPy).
4.  **Workers**: POST computed results to **Vet Service** (for Alerts/Storage).
