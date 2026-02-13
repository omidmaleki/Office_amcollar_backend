[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Docker & Docker Compose Infrastructure

## Introduction
We use **Docker** to package our application. Think of a Docker Container as a lightweight "Virtual Machine" that contains just the code and the libraries it needs to run.
**Docker Compose** is a tool to run *multiple* containers (Database, Redis, Backend, Frontend) together as a single system.

**Why?**
*   **Consistency**: "It works on my machine" becomes "It works everywhere."
*   **Isolation**: The Python version in the container doesn't mess with your laptop's Python.

---

## 1. The Three Environments
We have three different "modes" for running the project, each with a specific goal.

### A. Production (`docker-compose-prd.yml`)
**Goal**: Stability, Speed, Security.
*   **Used By**: The actual live server (deployed via CI/CD).
*   **Key Features**:
    *   **Images**: Pulls pre-built, optimized images from a registry (e.g., `docker.arvancloud.ir/...`). It does NOT build code.
    *   **Web Server**: Uses **Gunicorn** with **Gevent** (production-grade server).
    *   **Entry Point**: All traffic goes through **Nginx** (Reverse Proxy). You cannot access services directly (e.g., port 8000 is hidden).
    *   **Restart**: `restart: unless-stopped` (Auto-restarts if it crashes).

### B. Local Development (`docker-compose-local.yml`)
**Goal**: Developing features *inside* Docker.
*   **Used By**: Developers building new features.
*   **Key Features**:
    *   **Builds**: Builds images from your local source code (`build: .`).
    *   **Hot-Reloading (Frontend)**: The `volumes` section maps your laptop's folder to the container. If you save a file in VS Code, the container sees it immediately.
    *   **Direct Access**: Ports are exposed (e.g., `8000`, `3000`) so you can test APIs directly without Nginx.
    *   **Tools**: Includes **Kafka UI** (`localhost:8085`) to see easy-to-miss events.

### C. Runserver Debug (`docker-compose-runserver.yml`)
**Goal**: Deep debugging and "Native" feel.
*   **Used By**: Developers fixing hard bugs.
*   **Key Features**:
    *   **Command**: Runs `python manage.py runserver` instead of Gunicorn. This gives you the familiar Django debug storage and auto-reload.
    *   **Simplicity**: Good if you want to run one service in isolation or see raw Django logs.

---

## 2. Common Commands

| Goal | Command |
| :--- | :--- |
| **Start Local** | `docker-compose -f docker-compose-local.yml up --build` |
| **Start Prod** | `docker-compose -f docker-compose-prd.yml up -d` |
| **Stop Everything** | `docker-compose down` |
| **View Logs** | `docker logs -f amcollar-backend` (or specific container name) |
| **Clean Up** | `docker system prune -f` (Frees up space) |

---

## 3. Project Structure in Docker

### Services Map
*   **`amcollar-db`**: The Brain (PostgreSQL). Stores users, pets, collars.
*   **`amcollar-redis`**: The Memory (Cache) & Messenger (Celery Broker).
*   **`amcollar-kafka`**: The Nervous System (Events). Passes "GPS Data" from TCP to Process Server.
*   **`amcollar-gateway`**: The Receptionist. The only one that talks to the Frontend. Routes requests to Auth, Owner, etc.
*   **`tcp-service`**: The Antenna. Receives raw socket data from physical collars.

### Networking
All services live in a custom network called `backend`.
*   They talk to each other using **Service Names**.
    *   Example: Authentication Service connects to DB using host `amcollar-db`, not `localhost` or an IP.

---

## 4. Troubleshooting
**"I updated the code but nothing changed!"**
*   **Cause**: You might be reusing an old image.
*   **Fix**: Run `docker-compose ... up --build` to force a recompile.

**"Database connection failed"**
*   **Cause**: The database container isn't ready yet.
*   **Fix**: Check `depends_on`. We use `healthchecks` to make sure services wait for the DB to be healthy before starting.
