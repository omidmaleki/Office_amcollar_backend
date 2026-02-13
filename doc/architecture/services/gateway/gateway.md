[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Gateway Service Documentation

## Introduction
The **Gateway Service** is the "Front Door" (or Receptionist) of our backend.
Frontend applications (Mobile App, Admin Panel) **NEVER** talk directly to microservices (like Pet Service or Auth Service). They only talk to the Gateway.

**Why?**
1.  **Security**: The Gateway checks "Who are you?" (Authentication) before passing the request.
2.  **Simplicity**: The frontend only needs to know one URL (`api.amcollar.com`), not 10 different URLs for 10 services.
3.  **Routing**: It knows exactly where to send each request.

---

## 1. How It Works (The Routing Map)
The Gateway looks at the URL you requested and forwards it to the correct internal service.

| URL Path | Destination Service | Description |
| :--- | :--- | :--- |
| `/auth/*` | **Auth Service** | Login, Signup, Token Refresh. |
| `/owners/*` | **Owner Service** | User profiles, address management. |
| `/pets/*` | **Pet Service** | Pet profiles, photos, details. |
| `/collars/*` | **Collar Service** | Device status, assigning collars to pets. |
| `/orders/*` | **Sale Service** | Buying subscriptions or hardware. |
| `/vet/*` | **Vet Service** | Veterinary clinics, medical forms. |
| `/sms/*` | **SMS Service** | Sending notifications (internal use mostly). |

### Example Journey
1.  **Frontend Request**: `POST https://api.amcollar.com/pets/create/`
2.  **Gateway**:
    *   Intercepts the request.
    *   Checks headers (Authentication).
    *   Looks up `/pets/`.
    *   Forwards request (internally) to `http://amcollar-pet:8000/pets/create/`.
3.  **Pet Service**: Processes request, saves to DB.
4.  **Gateway**: Returns the response to the Frontend.

---

## 2. Technical Implementation
*   **Framework**: Django (Python).
*   **Mechanism**: Uses `requests` library (as a Reverse Proxy) or specific Protocol Buffers (gRPC) if configured.
*   **Key Files**:
    *   `urls.py`: Defines the routing table.
    *   `views.py`: Contains `OwnerProxy`, `PetProxy`, etc., which handle the logic of forwarding requests.

---

## 3. How to Debug
**"I get a 500 error on /pets/, but the Pet Service is fine!"**
1.  **Check Gateway Logs**:
    ```bash
    docker logs amcollar-gateway --tail 50
    ```
    *Look for connection errors (e.g., "Connection refused" means it can't reach the Pet Service).*

2.  **Check Network**:
    Can the Gateway see the Pet Service?
    ```bash
    docker exec -it amcollar-gateway sh
    ping amcollar-pet
    ```
