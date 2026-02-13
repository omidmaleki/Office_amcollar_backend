[← Back to Sale Documentation](./sale.md) | [Back to Overview](../../overview.md)

# Sale Enhancement Suggestions

Current status: **Simple Transaction**.
Goal status: **Robust E-commerce Platform**.

---

## 1. Distributed Transactions (The Saga Pattern)
**The Problem**:
What if the User pays, the Sale Service takes the money, but...
*   The **Collar Service** is down and doesn't receive the "Activate" message?
*   The **Kafka** broker crashes?
Result: **User paid, but got nothing.** (The worst customer experience).

**Solution: Outbox Pattern / Saga**
1.  **Outbox**: Save the "Event" to a local database table (`Outbox`) *in the same transaction* as the Payment.
    *   DB Transaction: `UPDATE Order SET status='paid'` + `INSERT INTO Outbox (msg='Order Paid')`.
    *   Commit.
2.  **Relay**: A separate background process reads the `Outbox` table and pushes to Kafka.
    *   If Kafka is down, it retries later.
    *   **Guarantees**: At-least-once delivery.

---

## 2. Idempotency (Double Payment Prevention)
**The Problem**:
User clicks "Pay" -> Network lags -> User clicks "Pay" again.
We might charge them twice.

**Solution: Idempotency Keys**
*   App generates a unique ID (UUID) for every button click (`idempotency_key`).
*   Sends it with the request header.
*   Server checks Redis: "Have I seen this Key in the last 5 minutes?"
    *   **Yes**: Return the *previous* response immediately. Don't charge again.
    *   **No**: Process the payment and save the Key.

---

## 3. Subscription Management (SaaS)
**The Problem**:
We currently treat sales as one-off (hardware).
But we want to charge a monthly fee for the "Smart Features".

**Solution: Subscription Model**
*   New Model: `Subscription` (Start Date, End Date, Plan).
*   **Cron Job / Celery Beat**: Runs daily.
    *   Finds subscriptions expiring in 3 days.
    *   Sends "Please Renew" SMS.
    *   Or attempts auto-charge (if card saved).
