[← Back to PostgreSQL Documentation](./postgresql.md) | [Back to Overview](../../overview.md)

# PostgreSQL Enhancement Suggestions

This document outlines improvements for our database infrastructure. These changes move us from a "setup that works" to a "professional, scalable, and secure system."

---

## 1. Security Improvements (Protecting Data)

### A. Principle of Least Privilege
**Why?**
Currently, our services connect using the `postgres` superuser. This user can do *anything*—delete all databases, change passwords, etc. If a hacker compromises the **Pet Service**, they shouldn't be able to delete the **Auth Database**.

**How?**
Create a specific user for each service that can *only* touch its own database.

```sql
-- 1. Create a user for the specific service
CREATE USER pet_service_user WITH PASSWORD 'secure_password';

-- 2. Give it permissions ONLY for its database
GRANT ALL PRIVILEGES ON DATABASE amcollar_pet TO pet_service_user;
```

### B. SSL/TLS Connections
**Why?**
Like with Redis, standard Postgres connections are plain text. If our database is on a different server than our backend, someone could intercept the data.

**How?**
1.  Configure Postgres to require SSL in `postgresql.conf`.
2.  Update Django `DATABASE_URL` parameters to include `?sslmode=require`.

---

## 2. Performance (Making it Fast)

### A. Connection Pooling (PgBouncer)
**Why?**
Opening a connection to a database is "expensive" (takes time and CPU).
*   **Current State**: Every time Django uses the DB, it might open a new connection.
*   **Problem**: If 1000 users hit the site, we open 1000 connections. Postgres will run out of memory and crash.

**How?**
Use a tool called **PgBouncer**. It keeps a few connections open (e.g., 20) and shares them among thousands of users. It acts like a "waiter" managing tables for many guests.

### B. Indexing Strategy
**Why?**
Imagine looking for a name in a phone book.
*   **With Index**: You look at the alphabetical tabs (Fast).
*   **Without Index**: You read every single page until you find it (Slow).
Postgres needs "Indexes" on columns we search often (like `user_id` or `email`).

**How?**
1.  Identify slow queries using `pg_stat_statements`.
2.  Add indexes in Django Models:
    ```python
    email = models.EmailField(db_index=True)
    ```

---

## 3. Operations (Keeping it Running)

### A. Automated Backups (WAL-G)
**Why?**
Servers fail. Disks corrupt. Humans delete things by mistake. We need a way to go back in time.

**How?**
Don't just run `pg_dump` once a day. Use **WAL-G**.
*   It continuously uploads the database changes (WAL logs) to cloud storage (like S3).
*   It allows **Point-in-Time Recovery**. We can say "Restore the database to exactly 14:32 yesterday."

### B. Monitoring (Prometheus + Grafana)
**Why?**
We need to know *before* the database crashes.

**How?**
Run a `postgres_exporter` container. It tells us:
*   How many active connections?
*   Is the disk full?
*   Are queries getting slower?
