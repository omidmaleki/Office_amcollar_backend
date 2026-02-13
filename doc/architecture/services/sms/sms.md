[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# SMS Service Documentation

## Introduction
The **SMS Service** is the "Postman" or "Notification Center".
Its only job is to deliver messages from our system to the user's phone.
It abstracts away the complexity of dealing with 3rd-party SMS providers (like SMS.ir, Kavenegar, Twilio).

**Analogy**:
*   **Auth Service**: Writes the letter ("Here is your verification code: 1234").
*   **SMS Service**: The Courier who actually drives to the house and drops it off.

---

## 1. Supported Providers
Currently, the service supports:
*   **SMS.ir**: A popular Iranian SMS gateway.

It uses a specific **Template ID** to send fast verification codes (OTP), bypassing advertising blockers.

---

## 2. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/sms/send/` | Sends an SMS. Expects `{ "phone": "...", "code": "..." }`. |

---

## 3. Data Flow
**Scenario: User Login**

1.  **User**: Enters phone number in App.
2.  **Auth Service**: Generates code `1234`.
3.  **Auth Service**: Calls `SMS Service` via HTTP (`POST /sms/send/`).
4.  **SMS Service**:
    *   Formats the request for **SMS.ir**.
    *   Adds API Key.
    *   Sends request to `https://api.sms.ir/v1/send/verify`.
5.  **SMS.ir**: Delivers message to User's phone.

---

## 4. Technical Details
*   **Stateless**: The service doesn't store any data (no Database). It just passes messages through.
*   **Synchronous**: Currently, it waits for the Provider to respond before returning "Success" to the caller.
