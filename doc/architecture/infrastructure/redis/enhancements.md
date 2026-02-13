[← Back to Redis Documentation](./redis.md) | [Back to Overview](../../overview.md)

# Redis Enhancement Suggestions

This document outlines improvements we can make to our Redis infrastructure. Usage of these enhancements is recommended as the project grows.

---

## 1. Security Improvements (Safety First)

### A. Rename Dangerous Commands
**Why?** 
Redis has commands that can delete the entire database in milliseconds (`FLUSHALL`, `FLUSHDB`). If an attacker (or a tired developer) runs this by mistake in production, we lose all Celery tasks and cache data instantly.

**How?**
We can disable these commands in the `redis.conf` file so nobody can run them.

```conf
# In redis.conf
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command CONFIG ""  # Prevents changing settings on the fly
```

### B. Enable TLS (Encryption)
**Why?**
By default, Redis sends data as "plain text". If a hacker is inside our network, they can read the messages (e.g., user emails in Celery tasks) by just listening to the traffic.

**How?**
We would need to:
1.  Generate SSL certificates.
2.  Start Redis with `--tls-port 6379`.
3.  Update Django to connect using `rediss://` (note the extra 's') instead of `redis://`.

---

## 2. Reliability (Don't Lose Data)

### A. Persistence Policy (RDB vs AOF)
**Why?**
Redis stores data in RAM. If the server crashes or restarts, RAM is cleared. We need to save data to the Disk to survive restarts.

**How?**
There are two main ways to save data:
1.  **RDB (Snapshots)**: Saves the database every X minutes. 
    *   *Pro*: Faster restarts. 
    *   *Con*: You lose data since the last snapshot (e.g., last 5 minutes).
2.  **AOF (Append Only File)**: Logs every single write command.
    *   *Pro*: You lose almost nothing (maybe 1 second).
    *   *Con*: File gets big and restart is slower.

**Recommendation**: Enable **Both**.
In `redis.conf`:
```conf
appendonly yes
save 900 1  # Save snapshot if 1 key changed in 900 secs
```

---

## 3. Performance (Speed & Stability)

### A. Max Memory Configuration
**Why?**
If Redis uses more RAM than the server has, the server will "swap" (use disk as RAM), which is incredibly slow, or crash.

**How?**
Set a limit. If Redis reaches this limit, it should delete old, less-used data (Eviction) to make room for new data.

In `redis.conf`:
```conf
maxmemory 512mb          # Limit to 512 MB
maxmemory-policy allkeys-lru # Delete the Least Recently Used keys first
```

---

## 4. Scaling (High Availability)

### A. Redis Sentinel (Auto-Recovery)
**Why?**
Right now, we have 1 Redis server. If it dies, the site breaks. 
**Sentinel** is a system that watches your Redis. If the main one dies, it promotes a backup (Replica) to be the new main one automatically.

**How?**
This requires running multiple Redis containers (1 Primary, 2 Replicas, 3 Sentinels). It's complex but necessary for 99.99% uptime.
