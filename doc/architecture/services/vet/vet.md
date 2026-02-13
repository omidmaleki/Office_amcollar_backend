[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Vet Service Documentation

## Introduction
The **Vet Service** plays two critical, distinct roles:
1.  **Doctor's Office**: Manages Veterinarians, Clinics, and Medical Forms.
2.  **Health Monitor (IoT)**: Analyzes real-time data from the Collar (Heart Rate, Activity) and checks for danger (Alerts).

**Analogy**:
*   **Role 1**: The Directory of Doctors and your Appointment notes.
*   **Role 2**: The "ICU Monitor" that beeps if the patient's heart rate gets too high.

---

## 1. Core Models

### A. The Veterinarian (`Vet`)
Represents the doctor using the platform.
*   **Fields**: `name`, `license_number`, `clinic_address`, `rank`.
*   **Function**: Allows Vets to register, be verified, and see their "Patients" (assigned Pets).

### B. Medical Forms (`VetForm` & `VetInfoMedical`)
The digital clipboard for the doctor.
*   **VetForm**: A visit record. "Pet #101 visited Dr. Smith on Monday."
*   **VetInfoMedical**: Detailed notes, **Radiography** uploads, and **Surgery** records.

### C. Health Thresholds (`Threshold`)
The "Safety Limits" for each pet.
*   **Concept**: Every animal is different. A resting heart rate of 60 might be normal for a big dog but low for a cat.
*   **Fields**: `heart_rate_min/max`, `temperature_min/max`, `oxygen_saturation`.
*   **Logic**: If incoming data < min OR > max -> **TRIGGER ALERT**.

---

## 2. Telemetry & IoT Data
The `thresholds` app stores massive amounts of time-series data from the Smart Collar.

| Model | Description | Frequency |
| :--- | :--- | :--- |
| `PPGReading` | Raw Heart Rate, SpO2, HRV. | High (Every minute/second) |
| `Activity` | "Running", "Sleeping", "Barking". | Medium (Every few minutes) |
| `ActivityHourly` | Aggregated stats for graphs. | Low (Once per hour) |

**Data Flow**:
1.  **Collar**: Sends sensors data via MQTT/HTTP.
2.  **Process Service** (or direct ingestion): Queues the data.
3.  **Vet Service**:
    *   Saves the data to `PPGReading`.
    *   Checks against `Threshold` model.
    *   If danger: **Send Alert** (SMS/Push).

---

## 3. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/vets/` | Find a doctor. |
| `POST` | `/vets/forms/` | Vet submits a visit report. |
| `GET` | `/telemetry/pet/{id}/` | Get graphs for the App (Heart Rate history). |

---

## 4. Technical Details
*   **Database**: Stores both relational data (Vets) and time-series data (Readings).
*   **Storage**: Stores Radiography images and Surgery PDFs.
