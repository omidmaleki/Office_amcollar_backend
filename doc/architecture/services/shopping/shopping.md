[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Shopping Service Documentation

## Introduction
The **Shopping Service** is the "Pet Store" or "Marketplace".
While the **Sale Service** handles the *Subscription* and *Primary Hardware* (The Collar), the Shopping Service is designed for everything else:
*   Accessories (Leashes, Bowls)
*   Food & Treats
*   Replacement Parts

**Analogy**:
*   **Sale Service**: The "membership desk" where you sign up and get your ID card.
*   **Shopping Service**: The "Gift Shop" next door.

---

## 1. Core Model: The Product (`Product`)
Represents a physical item for sale.

| Field | Description | Example |
| :--- | :--- | :--- |
| `name` | Item name. | `Premium Leather Leash` |
| `description` | Marketing text. | `Durable and stylish...` |
| `price` | Cost in local currency. | `25.00` |
| `image` | Photo of the item. | `leash.jpg` |
| `color/size` | Variants. | `Red`, `Medium` |

---

## 2. Order Management
The service handles its own simple Order flow, distinct from the complex Subscription flow of the Sale Service.

*   **Order**: `{ user_id: 1, product_id: 5, amount: 25.00, status: "pending" }`
*   **Payment**: Integreates with payment providers to settle the transaction.

### Why separate checking out?
*   **Different Logistics**: Selling a bag of dog food (shipping) is different from activating a digital subscription (instant).
*   **Different Business Logic**: Shopping might have "Inventory", "Shipping Addresses", and "Returns", which the Subscription service doesn't need.

---

## 3. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/products/` | Browse the catalog. |
| `GET` | `/products/{id}/` | View item details. |
| `POST` | `/cart/checkout/` | Buy items. |

---

## 4. Technical Details
*   **Database**: Stores Product Catalog and Shop Orders.
*   **Independence**: Can be deployed (or removed) without breaking the core App functionality.
