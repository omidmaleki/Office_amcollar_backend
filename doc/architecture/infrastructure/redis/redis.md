[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Redis Infrastructure Documentation

## Introduction for New Team Members
**Redis** (Remote Dictionary Server) is a super-fast, in-memory data store. Think of it like a giant, shared RAM that all our services can access. 

Because it keeps data in memory (RAM) instead of on a hard drive (Disk), it is incredibly fast—responding in microseconds.

In the **AmCollar** project, we don't use Redis as our primary database (that's PostgreSQL). Instead, we use it for two specific, critical jobs:
1.  **Message Broker**: Helping services talk to background workers (Celery).
2.  **Caching**: Storing temporary data to make the API faster.

---

## 1. The Role of Redis in Our Architecture

### A. As a Message Broker (Celery)
This is the most important use case in our project right now.

**The Problem:**
Imagine a user clicks "Generate Monthly Report". This might take 10 seconds. If the web server handles this directly, the user's browser hangs for 10 seconds. If 100 users do this at once, the server crashes.

**The Solution (Async Tasks):**
1.  **Frontend** sends a request to the **Backend (Django)**.
2.  **Django** says: "Okay, I'll do this later" and wraps the work into a "Task".
3.  **Django** puts this Task into **Redis** (specifically, into a "Queue").
4.  Django immediately responds to the user: "Report is being generated!" (Fast response).
5.  A separate program called a **Celery Worker** (running in the background) is watching Redis.
6.  The **Worker** sees the new Task in Redis, picks it up, and executes it.

**In this scenario, Redis is the "mailbox" where Django drops off work for the Workers.**

### B. As a Result Backend (Celery)
After the Celery Worker finishes the "Monthly Report", where does it put the result?
It saves the result (or the status like "Success/Failed") back into **Redis**.
Django can then check Redis later to see if the task is done.

### C. As a Cache (Future/Potential)
We can use Redis to store things that are expensive to calculate but don't change often.
*   **Example**: fetching the list of dog breeds from the database.
*   **Without Redis**: Every time a user asks, we query PostgreSQL.
*   **With Redis**: We query PostgreSQL once, save the result in Redis for 1 hour. For the next hour, we just read from Redis (instant).

---

## 2. Configuration & Connection

### Docker Setup
We run a specific Redis container named `amcollar-redis` (in Production) or just `amcollar-redis` (in Local).

*   **Production File**: `docker-compose-prd.yml`
*   **Local File**: `docker-compose-local.yml`

### Internal Networking
Inside our Docker network, services don't need to know IP addresses. They use the **Service Name** as the hostname.

*   **Host**: `amcollar-redis` (or `redis` in some configs)
*   **Port**: `6379` (The standard Redis port)

### Authentication
*   **Development**: Often runs without a password for simplicity.
*   **Production**: **CRITICAL**. We must set a password.
    *   We use the environment variable `REDIS_PASSWORD` in the `.env` file.
    *   The connection string looks like: `redis://:YourPassword@amcollar-redis:6379/0`

### Database Numbers
Redis supports multiple "logical" databases, numbered 0, 1, 2...
*   We typically use DB `0` for the default connection.
*   The `/0` at the end of the URL (`redis://.../0`) specifies this.

---

## 3. How to Debug Redis

Sometimes you need to see what's actually happenning inside Redis. You can use the `redis-cli` tool.

### Accessing Redis via Docker
Since Redis is in a container, you first "enter" the container:

```bash
# 1. Enter the container
docker exec -it amcollar-redis sh

# 2. Run the Command Line Interface (CLI)
# If no password:
redis-cli

# If password is set (Production):
redis-cli -a YourPassword
```

### Useful Commands
Once you are in the `redis-cli` prompt:

*   `PING`: Checks if Redis is alive. It should reply `PONG`.
*   `KEYS *`: Lists all keys stored. **WARNING**: Do not run this on a massive production database, it can slow it down.
*   `GET <key>`: View the value of a specific key.
*   `FLUSHALL`: **DANGER**. Deletes EVERYTHING. Never run this in production unless you are 100% sure.
*   `MONITOR`: Streams every command received by Redis in real-time. Great for debugging to see if your app is actually sending data.

---

## 4. Key Takeaways for Interns
1.  **Don't store permanent data here**: Redis is "in-memory". If the server restarts, data *might* be lost (depending on config). Always rely on PostgreSQL for data you can't afford to lose.
2.  **Watch your memory**: Since it uses RAM, storing huge objects in Redis is expensive. Keep values small.
3.  **Async is easy**: If you have a slow function in Python, learn how to use `@shared_task` with Celery. Redis handles the magic in the middle.
