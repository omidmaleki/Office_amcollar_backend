[← Back to SMS Documentation](./sms.md) | [Back to Overview](../../overview.md)

# SMS Enhancement Suggestions

Current status: **Simple Proxy**.
Goal status: **Reliable Notification Hub**.

---

## 1. Asynchronous Sending (Fire & Forget)
**The Problem**:
Currently, when **Auth Service** sends an SMS, it *waits* for SMS.ir to respond.
If SMS.ir is slow (e.g., takes 5 seconds), the User's Login screen freezes for 5 seconds.
This is a bad User Experience.

**Solution: Message Queue (RabbitMQ / Kafka)**
*   **Auth Service** publishes a message: `events.sms.send_otp { phone: "...", code: "..." }`.
*   **SMS Service** consumes it and calls the API in the background.
*   **Benefit**: The User Interface responds instantly.

---

## 2. Provider Failover (Redundancy)
**The Problem**:
SMS providers in Iran (and globally) sometimes go down.
If SMS.ir is down, nobody can log in. **Total System Failure**.

**Solution: Multi-Provider Strategy**
*   Configure 2 providers: **Primary** (SMS.ir) and **Backup** (Kavenegar).
*   Logic:
    ```python
    try:
        send_via_sms_ir()
    except Exception:
        log_warning("SMS.ir failed, switching to backup")
        send_via_kavenegar()
    ```
*   **Benefit**: 99.99% Availability.

---

## 3. Rate Limiting (Cost Control)
**The Problem**:
A malicious user sends 1,000 requests per minute.
We pay for 1,000 SMS messages.

**Solution: Redis Rate Limiter**
*   Before sending, check Redis: `GET rate_limit:09123456789`.
*   If value > 5 (in last hour), **Reject** the request.
