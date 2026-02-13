[← Back to Shopping Documentation](./shopping.md) | [Back to Overview](../../overview.md)

# Shopping Enhancement Suggestions

Current status: **Basic Catalog**. List and Buy.
Goal status: **Full E-commerce Experience**.

---

## 1. Search & Filtering (Elasticsearch / Meilisearch)
**The Problem**:
If we have 1,000 products, `SELECT * FROM Products WHERE name LIKE '%dog%'` is slow.
We also can't easily filter by "Price > $50 AND Color = Red".

**Solution: Search Engine**
*   Sync products to **Meilisearch** or **Elasticsearch**.
*   **Benefits**:
    *   Instant search results (Typo tolerance: "leesh" -> "leash").
    *   Faceted search (Filter by Brand, Size, Rating).

---

## 2. Inventory Management (Stock Protection)
**The Problem**:
Two users buy the last "Red Leash" at the same time.
Both pay. One gets it, the other gets an email: "Sorry, out of stock."

**Solution: Redis Locking / Atomic Decrement**
1.  **Reserve**: When user clicks "Checkout", Reserve the item in Redis for 10 minutes (`DECR stock`).
2.  **Pay**: If payment succeeds, keep it decremented in DB.
3.  **Timeout**: If payment fails (or user leaves), Release the stock (`INCR stock`).

---

## 3. Recommendation Engine
**The Problem**:
Users only see what they search for. We miss upsell opportunities.

**Solution: "Frequently Bought Together"**
*   Analyze `Order` history.
*   "Users who bought *Dog Food* also bought *Water Bowl*."
*   Show these suggestions on the Cart page.
