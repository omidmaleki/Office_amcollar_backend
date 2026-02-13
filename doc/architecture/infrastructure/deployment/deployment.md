[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# Deployment Documentation

## Introduction
**Deployment** is the process of taking the code from your laptop (or GitHub) and making it run live for real users.
Our goal is to make deployment **automated**, **repeatable**, and **safe**.

---

## 1. The Deployment Script (`deploy.sh`)

We use a script called `deploy.sh` to automate the heavy lifting. Here is what it does, step-by-step:

### Step 1: Calculate the Version (Tag)
Instead of just naming our version "v1", we use the **Git Branch** and **Commit Hash**.
*   **Why?** If a bug appears in production, we need to know *exactly* which line of code caused it.
*   **Example**: `main-a1b2c3d` means "Code from the `main` branch, commit `a1b2c3d`".

### Step 2: Build & Push (CI/CD)
Usually, a CI/CD server (like GitHub Actions) builds the Docker images and uploads them to a **Registry** (like Docker Hub or ArvanCloud).
*   `docker build -t amcollar-backend:main-a1b2c3d .`
*   `docker push amcollar-backend:main-a1b2c3d`

### Step 3: Pull & Restart (The Server)
The `deploy.sh` script on the server:
1.  **Pulls** the new image: "Download `main-a1b2c3d`".
2.  **Updates** the service: "Stop the old container, start the new one."
    ```bash
    export IMAGE_TAG=main-a1b2c3d
    docker system prune -f  # Clean up old junk
    docker-compose -f docker-compose-prd.yml up -d
    ```

---

## 2. Server Configuration (`.env`)

The code is the same everywhere, but the **Configuration** changes.
On the production server, we have a `.env` file that is **NOT** in Git.

| Variable | Local Value | Production Value | Why? |
| :--- | :--- | :--- | :--- |
| `DEBUG` | `True` | `False` | Showing error traces to hackers is bad. |
| `DB_HOST` | `localhost` | `amcollar-db` | Database is a separate container. |
| `SECRET_KEY` | `12345` | `xY#9@...` | Cryptographic security. |

**Important**: Never commit production secrets to Git!

---

## 3. How to Deploy (Manual Fallback)

If the automated pipeline breaks, here is how to deploy manually:

1.  **SSH into the Server**:
    ```bash
    ssh user@your-server-ip
    ```
2.  **Navigate to Project**:
    ```bash
    cd /opt/amcollar-backend
    ```
3.  **Pull Latest Code**:
    ```bash
    git pull origin main
    ```
4.  **Run Deployment**:
    ```bash
    ./deploy.sh
    ```
5.  **Verify**:
    Check if containers are healthy:
    ```bash
    docker ps
    ```

---

## 4. Troubleshooting Deployments

**"The site is down (502 Bad Gateway)!"**
*   **Check Nginx**: Is Nginx running? (`docker ps`)
*   **Check Backend**: Did the new code crash on startup?
    ```bash
    docker logs amcollar-gateway --tail 100
    ```
    *Look for "ModuleNotFoundError" or "Database connection failed".*

**"Updates aren't showing up!"**
*   **Did you pull?** Make sure `IMAGE_TAG` is actually updated in the `.env` or exported in the shell.
*   **Browser Cache**: Try Ctrl+Shift+R.
