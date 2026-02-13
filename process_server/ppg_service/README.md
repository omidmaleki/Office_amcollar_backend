# 📘 README — PPG Service

## 📌 Overview

`ppg_service` یک میکروسرویس مسئول **دریافت داده خام PPG از Kafka**، سپس **پردازش سیگنال، محاسبه Heart Rate (HR)، SpO2 و HRV** است.

این سرویس به صورت real-time روی دیتاهای سنسور MAX86141 کار می‌کند و قابلیت پردازش حجم بالای داده را دارد.

---

## 🧩 Features

* دریافت batchهای PPG از Kafka
* استخراج IR / RED samples
* فیلتر‌گذاری سیگنال (Band-pass)
* تشخیص قله‌ها (Peak Detection)
* محاسبه HR
* محاسبه SpO2
* محاسبه HRV براساس چند HR
* پشتیبانی از batch processing
* سازگار با Kafka high-throughput pipeline

---

## 🗂 Project Structure

```
ppg_service/
│── consumer.py         # Kafka consumer + main logic
│── HR_process.py       # HR calculation pipeline
│── SPO2_process.py     # SPO2 calculation
│── requirements.txt
│── Dockerfile
│── README.md
```

---

# 🔧 PPG Consumer Logic

سرویس Kafka را در تاپیک `ppg` subscribe می‌کند:

```python
consumer = KafkaConsumer(
    "ppg",
    bootstrap_servers="kafka:9092",
    value_deserializer=lambda v: json.loads(v.decode("utf-8")),
    auto_offset_reset="latest",
    enable_auto_commit=True
)
```

### فرمت پیام ورودی Kafka:

```json
{
  "payload": "{\"timestamp\": 123, \"samples\": {\"ir\": [...], \"red\": [...]}}"
}
```

---

# 📥 Batch Normalization

تابع زیر تضمین می‌کند پیام‌های Kafka همیشه `list[]` شوند:

```python
def normalize_kafka_message(value):
    if isinstance(value, list):
        return value
    if isinstance(value, dict):
        return [value]
```

این باعث می‌شود چه پروڈیوسر batch بفرستد و چه message تکی، کد stable باشد.

---

# 📊 Buffering Logic

برای جلوگیری از پردازش زودتر از موعد:

* هر پیام → حدود `EXPECTED_SAMPLES` نمونه دارد
* پس از `(SEND_COUNT × EXPECTED_SAMPLES)` پردازش انجام می‌شود

```python
if len(ir_buffer) >= SEND_COUNT * EXPECTED_SAMPLES:
    process()
```

### تنظیمات:

```
FS = 150                  # Sampling Rate
SEND_COUNT = 10           # چند batch برای پردازش HR
HRV_COUNT = 30            # تعداد HR برای محاسبه HRV
```

---

# ❤️ Heart Rate Processing Pipeline

این بخش در فایل `HR_process.py` است.

### 1) Band-pass Filter (0.5–4 Hz)

```python
filtered = bandpass_filter(ppg, fs)
```

### 2) Smoothing

```python
smoothed = smooth_signal(filtered)
```

### 3) Peak Detection

```python
peaks = detect_peaks(smoothed, fs)
```

### 4) HR Calculation

```python
rr_intervals = np.diff(peaks) / fs
hr_values = 60 / rr_intervals
return float(np.mean(hr_values))
```

اگر کمتر از 2 قله پیدا شود:

```
⚠️ HR: No valid HR detected
```

---

# 🩸 SpO2 Calculation

در فایل `SPO2_process.py`:

### الگوریتم اصلی:

```
R = (AC_red / DC_red) / (AC_ir / DC_ir)
SpO2 = 110 − 25 × R
```

اگر AC خیلی کوچک باشد:

```
return None
```

---

# 💓 HRV Calculation

پس از جمع شدن `HRV_COUNT` مقدار HR:

```python
hrv = float(np.mean(hr_list))
print(f"HRV: {hrv}")
hr_list.clear()
```

---

# 🐳 Docker Usage

## Build

```
docker build -t ppg-service .
```

## Run

```
docker run --network=my_net ppg-service
```

> Kafka باید با hostname `kafka` در دسترس باشد.

---

# 🧪 Debug Logs

نمونه لاگ‌های مهم:

```
📥 Received Kafka batch with 1 items
🔍 Detected 100 samples per message
📊 buffers → IR: 500, RED: 500
⚙️ Processing 1000 samples...
❤️ HR: 63.4
🩸 SPO2: 96.2
```

ارورها:

```
⚠️ SPO2: No valid SPO2 detected
⚠️ HR: No valid HR detected
❌ HR error: <msg>
```

---

# ⚙️ Environment Variables (optional)

```
KAFKA_HOST=kafka
KAFKA_PORT=9092
TOPIC=ppg
```

---

# 📌 Notes for Development

* اگر داده ثابت باشد (مثل `4,4,4,4`) هیچ HR/SPO2 قابل استخراج نیست
* دیتای MAX86141 باید AC component داشته باشد
* مقدارهای IR/RED واقعی معمولاً بین 10k – 100k هستند
* بهتر است یک pre-check برای signal validation اضافه کنید

---

# 📞 Support

برای توسعه، تست و دیباگ بهتر است از داده‌های واقعی سنسور استفاده شود. نمودار و تحلیل سیگنال می‌تواند به بهینه‌سازی HR/SPO2 کمک کند.
