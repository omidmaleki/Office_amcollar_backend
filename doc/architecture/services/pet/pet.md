[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Pet Service Documentation

## Introduction
The **Pet Service** is the "Medical Record" of the system.
It doesn't care *who* the owner is (that's Owner Service). It cares about **The Animal**.
It stores static data (Breed, Age, Sex) and medical history (Vaccinations, Surgeries).

**Analogy**:
*   **Owner Service**: The Front Desk at the clinic that has your address and phone number.
*   **Pet Service**: The file folder the Doctor holds with the X-rays and weight charts.

---

## 1. Core Model: The Pet
The `Pet` model represents one animal.

| Field | Description | Example |
| :--- | :--- | :--- |
| `name` | Pet's name. | `Coco` |
| `owner_id` | **Reference ID**. Who owns this pet? | `10` |
| `species` | `cat` or `dog`. | `dog` |
| `age`, `weight` | Physical stats. | `3` (years), `5.5` (kg) |
| `neutered` | Boolean. Is the pet sterilized? | `True` |
| `surgery_history` | Date of last surgery. | `2023-01-01` |
| `collar_id` | ID of the smart collar device. | `505` |

### Loose Coupling
Notice `owner_id` is just an Interger.
The Pet Service **doesn't knowing** the Owner's name.
If it needs the name (e.g., for a certificate), the **Gateway** fetches the Pet data AND the Owner data, then combines them.

---

## 2. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/pets/` | List all pets (Admin). |
| `GET` | `/pets/{id}/` | Get details of a specific pet. |
| `POST` | `/pets/` | Register a new pet. |
| `PATCH` | `/pets/{id}/` | Update weight or medical info. |

---

## 3. Data Flow
**Scenario: "Show my Pet's Profile"**
1.  **Mobile App**: Requests `GET /pets/101/`.
2.  **Gateway**: Checks Token -> Forwards to **Pet Service**.
3.  **Pet Service**: Returns `{ "id": 101, "name": "Coco", "weight": 5.5, "owner_id": 10 }`.
4.  **Mobile App**: displays "Coco (5.5kg)".

*Note: If the App wants to say "Coco belongs to Ali", it needs to make a SECOND request to the Owner Service for `owner_id: 10`.*

---

## 4. Technical Details
*   **Database**: Stores strictly animal data.
*   **Images**: Stores `pet_image` and `radiography_images` (File storage, likely mounted volume or S3).
