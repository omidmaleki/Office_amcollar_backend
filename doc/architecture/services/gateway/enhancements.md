[← Back to Gateway Documentation](./gateway.md) | [Back to Overview](../../overview.md)

# Gateway Enhancement Suggestions

Current status: **Manual Proxy**. We wrote custom Django Views to forward requests.
Goal status: **High-Performance Gateway**.

---

## 1. Architecture Improvements

### A. Switch to a Dedicated Gateway Tool (Kong / Traefik)
**Why?**
Writing a Gateway in Python (Django) is flexible but **Slow**. Every request spins up a heavy Django process.
Typical Gateways (Kong, Nginx, Traefik, APISIX) are written in Go or Lua and handle 100x more traffic.
**How?**
Replace `amcollar-gateway` container with **Kong** configuration.
It handles Routing, Authentication, and Rate Limiting out of the box.

### B. API Composition (GraphQL / BFF)
**Why?**
Right now, to show the "Dashboard", the Frontend makes 5 requests:
1.  Get User (`/owners/`)
2.  Get Pets (`/pets/`)
3.  Get Collars (`/collars/`)
... This is slow on mobile data.
**How?**
Implement a **BFF (Backend for Frontend)** pattern or **GraphQL**.
The Frontend makes **1 Request** (`/dashboard`). The Gateway calls all 5 services internally, merges the JSON, and sends back **1 Response**.

---

## 2. Security & Stability

### A. Rate Limiting
**Why?**
A hacker (or a bug) could spam `/auth/login/` 1000 times a second and crash our DB.
**How?**
add **Throttling**.
"Allow max 10 requests per minute from IP 1.2.3.4".

### B. Circuit Breaking
**Why?**
If the **SMS Service** is down and taking 30 seconds to timeout, the Gateway waits... and waits... and eventually the Gateway crashes too because all threads are waiting.
**How?**
Implement a **Circuit Breaker**.
"If SMS Service fails 5 times, stop calling it for 1 minute. Return error immediately."

---

## 3. Documentation (Swagger / OpenAPI)

### A. Centralized Documentation
**Why?**
A new developer doesn't know what APIs exist.
**How?**
The Gateway should aggregate **Swagger/OpenAPI** specs from all services and serve them at `api.amcollar.com/docs`.
One place to see EVERY endpoint in the system.
