[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Collar Service Documentation

## Introduction
The **Collar Service** is the "Device Registry" or "Inventory Manager".
It bridges the physical world (Hardware) and the digital world (App).
It knows which physical device (MAC Address) belongs to which digital user (Owner ID).

**Analogy**:
*   **Pet Service**: The Medical File.
*   **Collar Service**: The Serial Number database at the factory or store.

---

## 1. Core Model: The Collar
The `Collar` model represents the physical smart device.

| Field | Description | Example |
| :--- | :--- | :--- |
| `name` | Friendly name given by the user. | `Coco's Tracker` |
| `mac_address` | **Unique Hardware ID**. The fingerprint of the device. | `AA:BB:CC:11:22:33` |
| `owner_id` | **List** of IDs to handle shared ownership (Family). | `[10, 11]` |
| `color_product` | Physical color of the device (for the App UI). | `Red` |
| `size` | Physical size. | `Medium` |

### WiFi Credentials (`WifiCollarStatus`)
This model stores the WiFi SSID and Password that the User wants the Collar to connect to.
*   **Flow**: User enters WiFi info in App -> Saved here -> Collar fetches it via Bluetooth/Http -> Collar connects to WiFi.

---

## 2. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/collars/` | List all devices. |
| `GET` | `/collars/by-mac/{mac}/` | **Critical**. Used by the Collar Device during setup to say "Who owns me?". |
| `POST` | `/collars/` | Register a new device (usually by scanning QR code). |

---

## 3. The Setup Flow (Onboarding)
**Scenario: User buys a new Collar**
1.  **User**: Opens App, scans QR Code on the box (contains MAC Address).
2.  **App**: Sends `POST /collars/` with `{ mac: "AA:BB...", owner_id: 10 }`.
3.  **Collar Service**: Saves the binding.
4.  **User**: Enters WiFi Password in App.
5.  **App**: Sends `POST /collars/status/` with `{ ssid: "Home_WiFi", password: "secret_password" }`.
6.  **Device**: Wakes up, asks API "What is my WiFi?", gets the credentials, and connects.

---

## 4. Technical Details
*   **Database**: Stores hardware specs and configuration.
*   **Protocol**: Currently HTTP.
