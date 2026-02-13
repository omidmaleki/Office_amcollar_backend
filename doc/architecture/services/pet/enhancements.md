[← Back to Pet Documentation](./pet.md) | [Back to Overview](../../overview.md)

# Pet Enhancement Suggestions

Current status: **Basic CRUD**. Stores what we tell it.
Goal status: **Intelligent Health Platform**.

---

## 1. File Storage (Images & X-Rays)
**The Problem**:
We are storing `radiography_images` locally in the container or a volume.
If the server crashes or we move to a new server, we might lose the X-rays.
Also, serving images via Django is slow.

**Solution: Object Storage (S3 / MinIO)**
*   Upload images to **AWS S3** or **ArvanCloud S3**.
*   Store only the *URL* in the database (`https://s3.cloud.com/pets/101/xray.jpg`).
*   **Benefit**: faster, cheaper, and safer.

---

## 2. Audit Logging (Medical History)
**The Problem**:
If a Vet changes a pet's weight from `5kg` to `50kg` by mistake, we just overwrite the old value.
We lose the history ("Was he gaining weight last month?").

**Solution: History Table**
Create a `PetWeightHistory` model:
`{ pet_id: 101, weight: 5.5, date: "2023-01-01" }`
`{ pet_id: 101, weight: 5.6, date: "2023-02-01" }`
This allows us to draw **Growth Charts** for the user.

---

## 3. Breed Standardization
**The Problem**:
Users can type anything for `race` (Breed).
One types "Golden Retriever", another "Goldie", another "Golden".
This makes analytics impossible.

**Solution: Breed Service / Enum**
Create a standard list of breeds.
Dropdown menu in the App: `[ "Golden Retriever", "German Shepherd", "Poodle" ]`.
Store the `breed_id`, not the string.
