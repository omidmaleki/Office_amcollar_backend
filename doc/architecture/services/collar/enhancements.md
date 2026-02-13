[← Back to Collar Documentation](./collar.md) | [Back to Overview](../../overview.md)

# Collar Enhancement Suggestions

Current status: **Basic Inventory**. Stores configuration.
Goal status: **IoT Hub**. secure and real-time.

---

## 1. Security (Critical)
**The Problem**:
We store WiFi Passwords in **Plain Text** in the `WifiCollarStatus` table.
If a hacker steals our DB, they know the home WiFi password of every customer.
**This is a major security risk.**

**Solution: Encryption**
*   Encrypt the password before saving (AES-256).
*   Only decrypt it when the *Device* (authenticated via certificate) requests it.
*   Better yet: Don't store it on the server. Send it directly from Phone to Collar via Bluetooth during setup.

---

## 2. Communication Protocol
**The Problem**:
The Device polls the server (`GET /collars/status/`) to check for updates.
This drains the battery. "Are we there yet? No. Are we there yet? No."

**Solution: MQTT (IoT Protocol)**
*   Use a broker (Mosquitto/EMQX).
*   The Device **Subscribes** to `devices/AA:BB.../config`.
*   The Server **Publishes** a message ONLY when settings change.
*   **Benefit**: Huge battery checks. Instant updates.

---

## 3. Device Shadow (Digital Twin)
**The Problem**:
The device is offline. The user changes the LED color to "Blue".
The User sees "Blue" in the App, but the Device is actually "Red". State mismatch.

**Solution: Device Shadow**
Store two states:
1.  **Desired State**: What the user wants (`LED: Blue`).
2.  **Reported State**: What the device last said (`LED: Red`).
The UI should show "Updating..." until Reported matches Desired.
