[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Nginx Infrastructure Documentation

## Overview
Nginx serves as the **Reverse Proxy** and **Load Balancer** for AmCollar. It terminates SSL/TLS connections, serves static assets for some services, and routes HTTP traffic to the appropriate backend microservices based on the domain and URL path.

## Configuration Analysis (`nginx/conf.d/default.conf`)

### 1. Upstream Definitions
The configuration defines "upstreams" mapping internal Docker service names to their ports. This decouples the Nginx config from specific container IP addresses.

| Upstream Name | Docker Service | Port | Description |
| :--- | :--- | :--- | :--- |
| `auth_backend` | `amcollar-auth` | 8000 | User Authentication & Tokens |
| `owner_backend` | `amcollar-owner` | 8000 | Owner Profiles |
| `pet_backend` | `amcollar-pet` | 8000 | Pet Profiles |
| `collar_backend` | `amcollar-collar` | 8000 | Device Management |
| `sale_backend` | `amcollar-sale` | 8000 | Orders & Payments |
| `sms_backend` | `amcollar-sms` | 8000 | SMS Notifications |
| `vet_backend` | `amcollar-vet` | 8000 | Veterinary Data |
| `gateway_backend` | `amcollar-gateway` | 8000 | **API Gateway** (Main Entrypoint) |
| `frontend_backend` | `amcollar-frontend` | 3000 | Data Web App (Next.js) |
| `app_frontend_backend` | `amcollar-app-frontend` | 3000 | Mobile App Web/PWA |

### 2. Main Server Block (`amcollar.com`)
Handles traffic for the main website and administrative interfaces.

#### General Settings
- **Listen**: Port 443 (HTTPS) with HTTP/2 enabled.
- **SSL**: Uses Let's Encrypt certificates (`/etc/letsencrypt/live/amcollar.com/...`). Enforces TLS 1.2/1.3 and strong ciphers.
- **HTTP Redirect**: Port 80 redirects to HTTPS 443.

#### Core Routing
- **`/` (Root)**: Proxies to `frontend_backend` (The main Web App).
- **`/api/`**: Proxies to `gateway_backend`.
    - **CORS**: Configured to allow all origins (`*`) and standard methods/headers.
    - **Usage**: Mobile apps and the frontend use this path to access backend logic via the Gateway.

#### Admin Interfaces
Direct access to Django Admin interfaces for internal management. Each service's admin is mapped to a sub-path:

- `/admin/auth/` -> `auth_backend/admin/`
- `/admin/owner/` -> `owner_backend/admin/`
- `/admin/pet/` -> `pet_backend/admin/`
- `/admin/collar/` -> `collar_backend/admin/`
- `/admin/sale/` -> `sale_backend/admin/`
- `/admin/sms/` -> `sms_backend/admin/`
- `/admin/gateway/` -> `gateway_backend/admin/`
- `/admin/vet/` -> `vet_backend/admin/`

**Note**: Each admin block also handles `static` and `media` files for that specific service, ensuring the admin UI loads correctly (e.g., `/admin/auth/static/`).

#### Static & Media Files
Some paths are served directly by Nginx for performance, bypassing the backend containers entirely.
- `/sowner/admin/static/` -> Serves from `/opt/amcollar/staticfiles/`
- `/svet/admin/static/` -> Serves from `/opt/amcollar/staticfiles/`
- `/media/vet/` -> Serves from `/opt/amcollar/media/vet/`

### 3. App Server Block (`app.amcollar.com`)
Dedicated subdomain for the mobile/PWA frontend.
- **Upstream**: `app_frontend_backend`.
- **SSL**: Shares the same wildcard or multi-domain certificate.
