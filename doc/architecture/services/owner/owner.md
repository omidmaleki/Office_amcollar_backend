[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Owner Service Documentation

## Introduction
The **Owner Service** is the "Filing Cabinet" for user profiles.
While the **Auth Service** handles *Logins* (Who are you?), the **Owner Service** handles *Profiles* (What is your name? Where do you live? Can you see this pet?).

**Analogy**:
*   **Auth Service**: The bouncer at the club who checks your ID.
*   **Owner Service**: The host who looks up your table reservation and knows your dietary preferences.

---

## 1. Core Model: The Owner
The `Owner` model is the heart of this service.

| Field | Description | Example |
| :--- | :--- | :--- |
| `phone` | **Unique ID**. Links this profile to the Auth Service. | `+989123456789` |
| `name` | Human-readable name. | `Ali Rezaei` |
| `address` | Physical address for shipping collars. | `Tehran, Valiasr St...` |
| `pet_ids` | **List** of Pet IDs this owner owns. | `[101, 102]` |
| `vet_id` | ID of the Veterinarian this owner chose. | `55` |

### Why store IDs as a List? (`pet_ids`)
In a Monolith, we would use a `ForeignKey`.
In Microservices, the **Pet Service** has its own database. We can't join tables.
So, we store the *List of IDs* here. When we need pet details, the **Gateway** or **Frontend** fetches them from the Pet Service.

---

## 2. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/owners/` | List all owners (Admin only). |
| `GET` | `/owners/{id}/` | Get details of a specific owner. |
| `POST` | `/owners/` | Create a new profile (usually done after Signup). |
| `PATCH` | `/owners/{id}/` | Update address or name. |

---

## 3. Interaction Flow
**Scenario: User updates their Address**
1.  **Frontend**: Sends `PATCH /owners/10/` with `{ "address": "New City" }`.
2.  **Gateway**: Auth check passed -> Forwards to **Owner Service**.
3.  **Owner Service**: Updates the `address` field in its SQLite/Postgres DB.
4.  **Response**: Returns the updated profile.

---

## 4. Technical Details
*   **Stack**: Django Rest Framework.
*   **Database**: Stores strictly profile data. Does not store Passwords or Tokens (that's Auth's job).
