# AmCollar Backend Architecture Overview

## Introduction
AmCollar is a microservices-based backend system designed to manage smart pet collars. It handles user authentication, pet management, device communication (GPS/gyro), sales, and notifications.

## System Architecture

The system is composed of several decoupled services, communicating via REST APIs (synchronous) and Kafka (asynchronous events).

### Core Components

| Service | Description | Tech Stack |
| :--- | :--- | :--- |
| [**Gateway**](services/gateway/gateway.md) | Single entry point for all client requests. routes traffic to appropriate microservices. | Python, Django |
| [**Auth Service**](services/auth/auth.md) | Manages user registration, login, and JWT token generation. | Python, Django |
| [**Owner Service**](services/owner/owner.md) | Manages pet owner profiles and related data. | Python, Django |
| [**Pet Service**](services/pet/pet.md) | Manages pet profiles, breeds, and specific details. | Python, Django |
| [**Collar Service**](services/collar/collar.md) | Manages smart collar devices and their association with pets. | Python, Django |
| [**Sale Service**](services/sale/sale.md) | Handles orders, payments, and subscription management. | Python, Django |
| [**Shopping Service**](services/shopping/shopping.md) | E-commerce functionality for products. | Python, Django |
| [**Vet Service**](services/vet/vet.md) | Manages veterinary data and thresholds for pet health. | Python, Django |
| [**SMS Service**](services/sms/sms.md) | Handles sending SMS notifications (via third-party providers). | Python, Django |
| [**Process Server**](services/process/process.md) | Processes high-volume telemetry data (GPS, Gyro, PPG) via Kafka. | Python, Kafka, PostGIS |
| [**Frontend**](services/frontend/frontend.md) | Web application (Next.js 16) for users and admins. | Next.js, React, Tailwind |
| [**App Frontend**](services/app/app.md) | Mobile/PWA frontend for pet owners and vets (Dashboard). | Next.js, PWA |
| [**TCP Service**](services/tcp/tcp.md) | Handles raw TCP connections from devices and bridges to Kafka. | Python, Raw Sockets |

### Infrastructure

- [**Nginx**](infrastructure/nginx/nginx.md): Reverse proxy and load balancer. Handles SSL termination and serving static files.
- [**PostgreSQL**](infrastructure/postgresql/postgresql.md): Primary relational database. Each service typically has its own logical database or schema.
- [**Redis**](infrastructure/redis/redis.md): In-memory data store used for caching and as a message broker for Celery.
- [**Kafka / Zookeeper**](infrastructure/kafka/kafka.md): meaningful event streaming platform for inter-service communication and telemetry ingestion.
- [**Docker & Docker Compose**](infrastructure/docker/docker.md): Containerization and orchestration for development and production.

## Communication Patterns

1.  **Client -> Server**: Clients (Mobile App, Web Frontend) send HTTP requests to **Nginx**, which forwards them to the **Gateway**.
2.  **Gateway -> Services**: The **Gateway** authenticates requests and forwards them to the appropriate microservice (e.g., `amcollar-owner`, `amcollar-pet`) via HTTP.
3.  **Service -> Service (Sync)**: Services can make direct HTTP requests to each other for immediate data needs (e.g., Sale service checking User existence).
4.  **Service -> Service (Async)**: Services publish events to **Kafka** topics (e.g., `user_registered`, `device_data_received`). Other services subscribe to these topics to react asynchronously.

## Deployment

The system is deployed using **Docker Compose**.
- [**CI/CD**](infrastructure/ci-cd/ci-cd.md): GitHub Actions pipeline tests, builds, and pushes Docker images to a registry.
- [**Naming Convention**](infrastructure/docker/docker.md#docker-compose-files): `amcollar-<service>:<branch>-<commit>`
- [**Configuration**](infrastructure/deployment/deployment.md#environment-variables): Environment variables (`.env`) manage secrets and service URLs.
