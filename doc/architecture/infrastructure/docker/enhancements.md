[← Back to Docker Documentation](./docker.md) | [Back to Overview](../../overview.md)

# Docker Enhancement Suggestions

This document outlines how to take our Docker setup from "Functional" to "World Class".

---

## 1. Security (Hardening the Shell)

### A. Run as Non-Root User (Rootless)
**Why?**
By default, Docker containers run as `root`. If a hacker escapes the container (a rare but possible exploit), they have `root` access to your entire server.
**How?**
Create a limited user inside the `Dockerfile`:
```dockerfile
# Create a group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# Switch to this user
USER appuser
```

### B. Read-Only Filesystems
**Why?**
If a hacker gets in, the first thing they want to do is download a virus or modify your code. If the filesystem is Read-Only, they can't write anything.
**How?**
In `docker-compose.yml`:
```yaml
services:
  amcollar-auth:
    read_only: true
    volumes:
      - /tmp  # Give them a small scratchpad if needed
```

### C. Secrets Management (No .env in Prod)
**Why?**
Environment variables (`.env`) are easy to accidentally leak (e.g., in logs or error messages).
**How?**
Use **Docker Secrets**.
1.  Save the password in a file `db_password.txt`.
2.  In Compose: `secrets: [db_password]`.
3.  In Python: Read from `/run/secrets/db_password` instead of `os.environ`.

---

## 2. Optimization (Speed & Size)

### A. Dockerignore
**Why?**
When you run `docker build`, Docker copies your *entire* folder to the engine. If you have a 2GB `node_modules` or `.git` folder, it's slow and wastes space.
**How?**
Create a `.dockerignore` file:
```text
.git
__pycache__
node_modules
*.log
```

### B. Multi-Stage Builds
**Why?**
You need `gcc` and `python-dev` to *install* packages, but you don't need them to *run* the app. Keeping them makes the image huge (800MB vs 100MB).
**How?**
Use two stages in `Dockerfile`:
1.  **Builder**: Install compilers, build wheels (`pip wheel .`).
2.  **Runner**: Copy only the built wheels and install them. Discard the compilers.

---

## 3. Maintenance (Keeping it Clean)

### A. Image Tagging Strategy
**Why?**
Using `latest` is dangerous. If you deploy `latest` today and it breaks, how do you go back to yesterday's `latest`? You can't.
**How?**
Tag images with the Git Commit Hash or Version Number:
*   `amcollar-backend:v1.2.0`
*   `amcollar-backend:a1b2c3d`
This way, `rollback` is just `docker service update --image ...:v1.1.9`.

### B. Auto-Pruning
**Why?**
Every deployment leaves behind "dangling images" (old versions). Eventually, the disk fills up.
**How?**
Run a nightly cron job:
`docker system prune -af --filter "until=24h"`
