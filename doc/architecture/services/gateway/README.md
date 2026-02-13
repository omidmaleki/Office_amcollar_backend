[← Back to Overview](../../overview.md)

# Gateway Service Documentation

## Overview
The Gateway Service acts as the API Gateway for the AmCollar backend. It is the single entry point for all client requests, routing them to the appropriate microservice.

## Key Responsibilities
- **Request Routing**: Proxies requests from `/api/` to the correct internal service (e.g., `/api/auth/` -> `amcollar-auth`).
- **Load Balancing**: Distributes traffic (if multiple instances exist).
- **Security**: Can perform initial validation or rate limiting.
- **Protocol Translation**: Translates external HTTP/S requests to internal HTTP.

## Architecture
- **Tech Stack**: Python, Django (likely using `requests` or `httpx` to proxy).
- **Deployment**: Exposed via Nginx.

## Configuration
- **Service URLs**: Configured via environment variables (e.g., `AUTH_SERVICE_URL`, `OWNER_SERVICE_URL`).
- **Routing Rules**: Defined in `gateway/urls.py` or similar mapping files.
