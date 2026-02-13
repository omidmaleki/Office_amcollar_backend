[← Back to Deployment Documentation](./deployment.md) | [Back to Overview](../../overview.md)

# Deployment Enhancement Suggestions

Current status: **Basic**. We pull and restart.
Goal status: **Resilient**. Zero downtime, instant rollback, deep visibility.

---

## 1. Zero Downtime Deployment

### The Problem
When we run `docker-compose restart`, there is a **10-30 second gap** where the old container is dead and the new one is booting up. Users see a "502 Bad Gateway" error.

### The Solution: Blue-Green Deployment
**Concept**:
1.  **Blue** (Old) is running live.
2.  Deploy **Green** (New) alongside it. Wait for it to be healthy.
3.  Switch Nginx to point to **Green**.
4.  Kill **Blue**.

**How to Implement?**
*   **Nginx Upstreams**:
    ```nginx
    upstream backend {
        server 127.0.0.1:8000; # Blue
        server 127.0.0.1:8001; # Green (backup)
    }
    ```
*   **Tools**: Use **Docker Swarm** (built-in) or **Kubernetes** (advanced) which handle rolling updates automatically.

---

## 2. Infrastructure as Code (IaC)

### The Problem
If the server crashes and deletes everything, how long does it take to set up a new one?
"Uh, I need to install Docker, then Nginx, then copy config files..." -> **Hours/Days**.

### The Solution: Ansible / Terraform
**Concept**: Write code that *creates* server infrastructure.
**How?**
Write an **Ansible Playbook**:
```yaml
- name: Install Docker
  apt: name=docker.io state=present

- name: Copy Nginx Config
  copy: src=./nginx.conf dest=/etc/nginx/nginx.conf
```
Now, you can set up a new server in **minutes** by running one command.

---

## 3. Centralized Logging (ELK / Loki)

### The Problem
We have 10 microservices. If a user says "I can't login", you have to SSH in and check 5 different log files (`auth`, `gateway`, `db`).

### The Solution: Log Aggregation
**Concept**: All containers send logs to **One Place**.
*   **Promtail**: Reads logs from Docker.
*   **Loki**: Stores logs.
*   **Grafana**: You search logs like Google. "Show me all ERROR logs from 'auth-service' in the last 10 mins".

**Action Item**:
Add a `loki` container to our `docker-compose` and set logging driver to `json-file` (or send directly to Loki).
