# TCP Service

TCP Service مسئول دریافت داده‌ها از دستگاه‌ها (مثل Gyro، PPG و داده‌های Raw)، مدیریت ارتباط TCP و ارسال داده‌ها به Kafka است. این سرویس به‌عنوان واسط بین دستگاه‌ها و Kafka عمل می‌کند و پیام‌ها را به شکل **Batch یا تکی** به topic های مشخص ارسال می‌کند.

---

## 📦 ساختار پروژه
```
tcp_service/
│
├── tcp_server.py # TCP server اصلی و Kafka batch sender
├── Dockerfile # Dockerfile برای ساخت سرویس
└── README.md # این فایل
```

---

## ⚙️ tcp_server.py

این فایل وظیفه مدیریت ارتباطات TCP، دریافت پیام‌ها و ارسال به Kafka را دارد.

### 🔹 پیکربندی

```python
# روی هر پورت چه تاپیکی ارسال شود؟
PORT_TOPIC_MAP = {
    9001: "gyro_events",
    9002: "ppg",
    9003: "raw_events"
}

BATCH_SIZE = 50  # تعداد پیام‌ها در هر batch
KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
```
* هر پورت یک نوع داده خاص دارد.
* پیام‌ها ابتدا در Queue داخلی قرار می‌گیرند و سپس توسط Kafka Worker ارسال می‌شوند
* BATCH_SIZE تعداد پیام‌های ارسالی در هر دسته را مشخص می‌کند.
---
### 🔹 بخش‌های اصلی
1. TCP Client Handler
```python
def handle_client(conn, addr, port):
    """
    مدیریت ارتباط TCP با هر دستگاه.
    پیام‌ها را دریافت کرده و در صف مربوطه قرار می‌دهد.
    """
```
* دریافت داده از دستگاه با conn.recv().
* تبدیل پیام به دیکشنری و افزودن timestamp و device_ip.
* قرار دادن پیام در Queue داخلی مربوط به پورت.

2. Kafka Worker
    """
    ارسال پیام‌ها به Kafka به صورت batch یا پس از timeout.
    """
- پیام‌ها از Queue گرفته می‌شوند.
- وقتی تعداد پیام‌ها >= BATCH_SIZE شد یا 0.5 ثانیه گذشته، ارسال می‌شوند.
- خطاهای ارسال در لاگ ثبت می‌شوند.
3. TCP Server
```python
def handle_client(conn, addr, port):
    """
    مدیریت ارتباط TCP با هر دستگاه.
    پیام‌ها را دریافت کرده و در صف مربوطه قرار می‌دهد.
    """
```
---
### 📝 لاگ‌ها
مثال لاگ‌های TCP Service:
```
[TCP] Listening on port 9002
[TCP] New device connected ('172.18.0.1', 49108) on port 9002
[TCP] Received from port 9002: {'device_ip': '172.18.0.1', 'port': 9002, 'payload': '{...}', 'timestamp': 1765375389}
[TCP] Device disconnected: ('172.18.0.1', 49108)
[Kafka] Sent 1 messages (timeout flush) → topic: ppg
```
---
### 🚀 نحوه راه‌اندازی
* اجرای محلی
```
export KAFKA_BOOTSTRAP="kafka:9092"
python tcp_server.py
```