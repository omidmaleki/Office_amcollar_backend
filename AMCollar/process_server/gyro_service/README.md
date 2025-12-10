# Gyro Service

Gyro Service مسئول دریافت داده‌های شتاب‌سنج و ژیروسکوپ (accelerometer & gyro) از دستگاه‌ها، پردازش آن‌ها و محاسبه وضعیت بدن (posture)، سطح فعالیت و کالری مصرفی است. این سرویس از Kafka برای مصرف داده‌ها و انتقال به سایر سرویس‌ها استفاده می‌کند.

---

## 📦 ساختار پروژه

```
gyro_service/
│
├── consumer.py # Kafka consumer اصلی برای دریافت داده‌های Gyro
├── gyro_process.py # توابع پردازش داده‌های Gyro و محاسبه posture/activity/calories
├── Dockerfile # Dockerfile برای ساخت سرویس
└── README.md # این فایل
```

---

## ⚙️ consumer.py

این فایل Kafka Consumer را پیاده‌سازی می‌کند و داده‌های دریافتی از topic مشخص را پردازش می‌کند.

### 🔹 کد اصلی
```python
from kafka import KafkaConsumer
import json
from gyro_process import process_gyro_data
import os

# پیکربندی Kafka
KAFKA_BOOTSTRAP = os.getenv("KAFKA_BOOTSTRAP", "kafka:9092")
topic = os.getenv("KAFKA_TOPIC", "gyro_events")  # topic پیش‌فرض

consumer = KafkaConsumer(
    topic,
    bootstrap_servers=KAFKA_BOOTSTRAP,
    group_id="gyro_group",
    auto_offset_reset="earliest",
    value_deserializer=lambda m: json.loads(m.decode("utf-8"))
)

print(f"[Consumer] Listening on topic: {topic}")

for msg in consumer:
    raw_msg = msg.value
    try:
        payload_str = raw_msg.get("payload", "{}")
        payload = json.loads(payload_str)
        result = process_gyro_data(payload)
        print(f"[Processed] Device: {raw_msg.get('device_ip')} → Payload: {payload} → Result: {result}", flush=True)
    except Exception as e:
        print("[Error] Processing message:", raw_msg, e, flush=True)
```
### توضیحات🔹

KafkaConsumer داده‌ها را از topic مشخص شده مصرف می‌کند.

payload پیام‌ها معمولاً به صورت رشته JSON است، بنابراین ابتدا باید دیکود و به dict تبدیل شود.

process_gyro_data() داده‌ها را پردازش می‌کند و وضعیت بدن و کالری مصرفی را محاسبه می‌کند.

خطاها در پردازش با try/except گرفته می‌شوند و لاگ می‌شوند.

### ⚙️ gyro_process.py
این فایل الگوریتم پردازش داده‌های Gyro را شامل می‌شود:
```pycon
import numpy as np

def process_gyro_data(payload, weight_kg=70):
    """
    پردازش داده‌های شتاب‌سنج و ژیروسکوپ و محاسبه:
    - وضعیت بدن (posture)
    - سطح فعالیت (activity_level)
    - کالری مصرفی (calories)
    """
    acc = np.array([payload["ACCx"], payload["ACCy"], payload["ACCz"]])
    gyro = np.array([payload["Gx"], payload["Gy"], payload["Gz"]])

    acc_mag = np.linalg.norm(acc)
    gyro_mag = np.linalg.norm(gyro)

    # دسته‌بندی وضعیت بدن
    if acc_mag < 9.9 and gyro_mag < 0.1:
        posture = "lying"
    elif acc_mag < 10.5 and gyro_mag < 0.2:
        posture = "sitting"
    else:
        posture = "standing"

    # سطح فعالیت
    activity_level = abs(acc_mag - 9.8)

    # تخمین کالری مصرفی (به ازای هر ثانیه)
    if posture == "lying":
        MET = 1.0
    elif posture == "sitting":
        MET = 1.3
    else:
        MET = 1.8 + activity_level * 5

    calories = MET * weight_kg * (1 / 3600)

    return {
        "posture": posture,
        "activity_level": float(round(activity_level, 2)),
        "calories": float(round(calories, 4))
    }
```
---
### 🔹 توضیحات
acc_mag و gyro_mag بردارهای magnitude شتاب و ژیروسکوپ هستند.

وضعیت بدن بر اساس شدت شتاب و ژیروسکوپ دسته‌بندی می‌شود.

سطح فعالیت از اختلاف مقدار شتاب از شتاب گرانش محاسبه می‌شود.

کالری مصرفی با MET تقریبی و وزن کاربر بر حسب کیلوگرم محاسبه می‌شود.

---

### 📝 لاگ‌ها

مثال لاگ‌های دریافتی و پردازش شده:
```
[Consumer] Listening on topic: gyro_events
[Processed] Device: 172.18.0.1 → Payload: {...} → Result: {'posture': 'sitting', 'activity_level': 0.2, 'calories': 0.00007}
[Processed] Device: 172.18.0.1 → Payload: {...} → Result: {'posture': 'standing', 'activity_level': 0.5, 'calories': 0.00015}
```
---
### 🔹 نکات مهم
* اگر داده‌ها ناقص یا JSON نامعتبر باشند، در لاگ نمایش داده می‌شوند ولی سرویس ادامه می‌دهد.

* وزن کاربر (weight_kg) برای محاسبه کالری قابل تغییر است.
* داده‌های شتاب و ژیروسکوپ باید شامل فیلدهای ACCx, ACCy, ACCz, Gx, Gy, Gz باشند.
---

