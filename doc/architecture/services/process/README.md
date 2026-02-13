[← Back to Overview](../../overview.md)

# Process Service (Telemetry) Documentation

## Overview
The Process Service is a high-throughput component designed to ingest and process telemetry data streams from smart collars. It handles GPS coordinates, gyroscope data, and other sensor readings.

## Key Responsibilities
- **Data Ingestion**: Consumes raw data from Kafka topics (published by TCP Service or API).
- **Processing**:
    - **Normalization**: Converts raw bytes/strings into structured data.
    - **Threshold Checking**: Compares vitals against limits defined in `Vet Service`.
    - **Geofencing**: Checks if GPS coordinates are within safe zones (defined in `Collar Service`).
- **Storage**: Persists processed data (logs, location history).
- **Alerting**: Publishes alert events to Kafka if anomalies are detected.

## Architecture
- **Input**: Kafka Topics (`collar_data_gps`, `collar_data_gyro`).
- **Output**: Kafka Topics (`alerts`, `notifications`), Database (History).

## Dependencies
- **Kafka**: Primary data source and sink.
- **Redis**: Caching recent state for quick comparisons.
- **Vet Service**: Source of health thresholds.
- **Collar Service**: Source of geofence settings.
