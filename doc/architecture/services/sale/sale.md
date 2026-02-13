[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Sale Service Documentation

## Introduction
The **Sale Service** is the "Cashier" or "Billing Department".
It handles everything related to money: creating orders, processing payments, and managing subscriptions.
It connects the User (Owner) with the Product (Collar/Subscription).

**Analogy**:
*   **Collar Service**: The Warehouse (has the products).
*   **Sale Service**: The Check-out Counter (takes the money).

---

## 1. Core Models

### A. The Order (`Order`)
Represents the *intent* to buy something.
*   "I want to buy Collar #505 for Pet #101".
*   **Status**: `pending` -> `paid` (or `cancelled`).
*   **Fields**: `owner_id`, `collar_id`, `pet_id`, `amount`.

### B. The Payment (`Payment`)
Represents the *actual transaction*.
*   "Here is $50.00".
*   **One-to-One**: Each Order has exactly one successful Payment (usually).
*   **Fields**: `amount`, `status`, `transaction_id`.

---

## 2. The Purchase Flow
**Scenario: Buying a Smart Collar**

1.  **User**: Clicks "Buy Now" in the App.
2.  **App**: Sends `POST /orders/` with `{ collar_id: 505 }`.
3.  **Sale Service**:
    *   Creates an `Order` (Status: `pending`).
    *   Calculates the price.
    *   Returns a **Payment Link** (to a gateway like Stripe/Zarinpal).
4.  **User**: Pays on the Bank Page.
5.  **Bank**: Calls our `webhook` (or User is redirected back).
6.  **Sale Service**:
    *   Updates `Payment` status to `success`.
    *   Updates `Order` status to `paid`.
    *   **Crucial Step**: Publishes an Event (`order_paid`) to Kafka.
7.  **Other Services**:
    *   **Collar Service** listens: "Oh, Order paid? I will activate Collar #505".
    *   **SMS Service** listens: "I will send a receipt SMS".

---

## 3. Technical Details
*   **Database**: Stores financial records. **Must be backed up strictly**.
*   **Async Events**: Uses Kafka to tell other services about successful payments. decoupling the "Money" logic from the "Delivery" logic.
