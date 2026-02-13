[← Back to TCP Documentation](./tcp.md) | [Back to Overview](../../overview.md)

# TCP Enhancement Suggestions

Current status: **Threaded Server**. Good for hundreds of devices.
Goal status: **Asyncio Gateway**. Good for millions of devices.

---

## 1. Migrate to Asyncio (Scalability)
**The Problem**:
Currently, we spawn a **Thread** for every connected device.
Threads use memory (Stack space). If 10,000 dogs connect, the server will crash (OOM).

**Solution: Python `asyncio` (uvloop)**
*   Use `async def handle_client(reader, writer):`.
*   One thread can handle thousands of connections.
*   **Benefit**: Massive scalability (the "C10K Problem" solved).

---

## 2. Authentication & Security (mTLS)
**The Problem**:
Currently, **Anyone** can connect to Port 9001 and send fake data.
"My dog is running 100mph!" -> Fake data corrupts our DB.
Raw TCP has no "Login" or "Header".

**Solution: Mutual TLS (mTLS)**
*   Burn a Client Certificate onto the physical Collar chip during manufacturing.
*   Server verifies the Certificate handshake.
*   **Benefit**: Math-proven hardware identity. Only usage of valid certificates is allowed.

---

## 3. Dynamic Protocol Parsing
**The Problem**:
We assume the payload is a "String".
What if the device sends **Binary** (Protobuf/MessagePack) to save battery?

**Solution: Protocol Buffers**
*   Define `.proto` files for the collar data.
*   Compile to Python classes.
*   Parse binary packets directly.
*   **Benefit**: 50% less data usage for the user (SIM card cost).
