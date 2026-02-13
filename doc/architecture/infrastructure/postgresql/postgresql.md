[← Back to Overview](../../overview.md) | [Enhancement Suggestions](./enhancements.md)

# PostgreSQL Usage Documentation

## Introduction for New Team Members
**PostgreSQL** (often just "Postgres") is our primary database. It is where we store all the permanent data for the application, such as user users, pet profiles, and transaction logs.

If Redis is our "short-term memory", PostgreSQL is our "long-term memory".

---

## 1. Our Database Architecture

### One Instance, Many Databases
In a microservices architecture, it's a best practice for each service (like `pet_service` or `auth_service`) to have its own private data.

*   **Physical Setup**: We run **one** PostgreSQL server (container) to save resources.
*   **Logical Setup**: Inside that server, we create separate **databases** for each service.

**Why?**
This prevents the `pet_service` from accidentally reading or changing data in the `auth_service`. It keeps our code clean and decoupled.

### Service-to-Database Mapping
Here is which database belongs to which service:

| Service | Database Name | What it stores |
| :--- | :--- | :--- |
| **Auth** | `amcollar_auth` | Users, passwords, permissions. |
| **Owner** | `amcollar_owner` | Human profiles, addresses. |
| **Pet** | `amcollar_pet` | Pet names, breeds, medical info. |
| **Collar** | `amcollar_collar` | Device settings, firmware versions. |
| **Sale** | `amcollar_sale` | Subscriptions, plans, payments. |
| **Shopping**| `amcollar_shopping`| Products, inventory. |
| **Vet** | `amcollar_vet` | Clinic details. |
| **SMS** | `amcollar_sms` | Logs of sent messages. |

---

## 2. Configuration & Connection

### Docker Setup
*   **Container Name**: `amcollar-db` (Production) or `db` (Local).
*   **Image**: `postgres:15` (We use version 15).
*   **Port**: `5432` (Standard Postgres port).

### How Services Connect
Each Django service has a `DATABASE_URL` environment variable in its `.env` file or `docker-compose` config.

**Format:**
`postgres://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>`

**Example (Production):**
`postgres://postgres:SecretPass@amcollar-db:5432/amcollar_pet`

### Environment Variables
You will see these in your `.env` file:
*   `POSTGRES_USER`: Usually `postgres` (the Superuser).
*   `POSTGRES_PASSWORD`: The password for the superuser. **Keep this safe!**
*   `POSTGRES_DB`: The default database name (often `amcollar` or specific to the service).

### Database Initialization (`init-dbs.sql`)
When you start the database container for the very first time, it is empty. We need to create the specific databases (`amcollar_auth`, `amcollar_pet`, etc.) before any service can connect.

**How it works:**
1.  We have a file named `init-dbs.sql` in the root of the project.
2.  Extensions like Docker Compose mount this file into the container at `/docker-entrypoint-initdb.d/init-dbs.sql`.
3.  The official Postgres image runs any SQL script found in that folder **only on the first startup**.

**Contents of `init-dbs.sql`:**
```sql
CREATE DATABASE amcollar_auth;
CREATE DATABASE amcollar_owner;
-- ... and so on for all services
```

**Troubleshooting:**
If you add a new service and its database isn't showing up:
1.  Add the `CREATE DATABASE ...` line to `init-dbs.sql`.
2.  **Crucial**: You must delete the existing database volume (`docker volume rm ...`) and restart. The script *only* runs if the database is empty.

---

## 3. Local Development Guide

### Viewing Data (The Easy Way)
You don't need to write SQL commands to see what's happening. You can use a GUI tool like **DBeaver** or **pgAdmin**.

**Connection Details for Localhost:**
*   **Host**: `localhost`
*   **Port**: `5432`
*   **Username**: `postgres` (or what is in your `.env`)
*   **Password**: `password` (default for local dev)
*   **Database**: The specific one you want to see (e.g., `amcollar_pet`)

### Resetting the Database
Sometimes you mess up your local data and want to start fresh.
1.  **Stop Docker**: `docker compose down`
2.  **Delete Volume**: `docker volume rm amcollar_repo_db_data` (Check exact name with `docker volume ls`)
3.  **Restart**: `docker compose up -d`
4.  **Re-run Migrations**: Django will recreate the tables for you.

---

## 4. Key Takeaways
1.  **Migrations Matter**: We don't create tables manually with SQL. We use Django Migrations (`python manage.py makemigrations` / `migrate`).
2.  **Respect Boundaries**: If you are working on the **Pet Service**, do not try to read tables from the **Auth Service** directly. Use an API call instead.
3.  **Persisted Data**: Data in Postgres survives container restarts because we use a Docker **Volume** (`postgres_data`).
