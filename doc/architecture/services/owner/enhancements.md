[← Back to Owner Documentation](./owner.md) | [Back to Overview](../../overview.md)

# Owner Enhancement Suggestions

Current status: **Isolated Storage**. Simple and decoupled.
Goal status: **Integrated & Consistent**.

---

## 1. Data Integrity (The "Ghost Pet" Problem)
**The Problem**:
We store `pet_ids: [100, 101]`.
What happens if Pet `100` is deleted in the **Pet Service**?
The Owner Service doesn't know. It still thinks the owner has Pet `100`.
This creates "Ghost Pets" or errors on the frontend.

**Solution: Event-Driven Architecture**
*   **Pet Service**: When a pet is deleted, publish a Kafka Event: `pet_deleted { id: 100 }`.
*   **Owner Service**: Listen for `pet_deleted`. When received, remove `100` from `pet_ids`.

---

## 2. Database Design
**The Problem**:
Using `JSONField` for `pet_ids` makes it hard to answer questions like:
*"Find all owners who own Pet 100"*.
We have to scan *every* row and parse JSON.

**Solution: Association Table**
Even in microservices, if we want efficiency, we might need a local lookup table:
`OwnerPet { owner_id, pet_id }`.
this allows indexed queries.

---

## 3. Validation
**The Problem**:
Currently, I can create an owner with `vet_id: 999999`, even if Vet 999999 doesn't exist.

**Solution: Cross-Service Validation**
When setting a `vet_id`:
1.  Owner Service calls **Gateway** -> **Vet Service**: "Does Vet 999999 exist?"
2.  If Yes -> Save.
3.  If No -> Return Error.
*Note: This makes the system "Tightly Coupled" (less independent). Use carefully.*
