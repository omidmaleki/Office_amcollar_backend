# Vet & Threshold Microservices

این سند، مستند رسمی **Vet Service** و **Threshold Service** در معماری Microservice پروژه است.

---

## 🏗️ جایگاه در معماری

### Vet Service

مسئول مدیریت دامپزشکان، فرم‌های ویزیت، اطلاعات پزشکی و تعامل با:

* Pet Service
* Owner Service
* Threshold Service
* Kafka (Event Driven)

### Threshold Service

مسئول دریافت داده‌های سنسور، پردازش بلادرنگ، ذخیره آستانه‌ها و ارسال داده Real-time به Frontend.

---

## 🐾 Vet Service

### Models

#### Vet

* name, phone, address
* vet_license_number
* pets, collars (JSON)
* rank (star | elite)

#### VetForm

فرم ویزیت دامپزشک (Snapshot از اطلاعات Pet)

* vet, owner_id, pet_id, purchase_id
* pet_name, pet_age, pet_race, pet_image
* body_temperature, hrv
* status (pending | completed)

#### VetInfoMedical

اطلاعات پزشکی تکمیلی:

* radiography
* test
* surgical_records
* possible_risks
* possible_diseases

---

### API Endpoints

#### Vet CRUD

```
GET    /vets/
POST   /vets/
```

#### Vet Register

```
POST /vets/register/
```

#### Vet List (Dropdown)

```
GET /vets/list/
```

#### VetForm

```
GET    /vet-forms/
PUT    /vet-forms/{id}/
PATCH  /vet-forms/{id}/
```

#### Create VetForm from Pet

```
POST /vet-forms/from-pet/{pet_id}/
```

این endpoint:

* اطلاعات Pet را از Pet Service می‌گیرد
* Threshold را از Threshold Service می‌خواند
* VetForm می‌سازد

---

### Kafka Integration

#### Producer

پس از `status=completed`:

```
Topic: update_threshold_topic
Payload:
{
  pet_id,
  body_temperature,
  hrv
}
```

#### Consumer

Vet Service همچنین پیام‌های زیر را مصرف می‌کند:

```
Topic: vetform_topic
```

و VetForm جدید می‌سازد.

---

## 📊 Threshold Service

### Responsibilities

* دریافت داده Gyro/Activity از Collar
* ذخیره Activity
* ارسال Real-time به Frontend (WebSocket)
* Aggregation ساعتی و روزانه (Celery)

---

### API Endpoints

#### Ingest Gyro

```
POST /gyro/ingest/
```

Payload نمونه:

```json
{
  "mac_address": "AA:BB:CC",
  "metrics": {
    "posture": "sleep",
    "behavior": "calm",
    "activity_count": 10,
    "calories": 3
  },
  "timestamp": 1734353440000,
  "pet_id": 1,
  "collar_id": 2
}
```

---

#### Threshold CRUD

```
GET /thresholds/?pet_id=1
```

#### Radiography

```
GET /radiography/?pet_id=1
```

#### Test Reports

```
GET /test-reports/?pet_id=1
```

#### Surgery History

```
GET /surgery-history/?pet_id=1
```

---

## 🔴 Realtime (WebSocket)

Channel:

```
ws://.../ws/activity/{pet_id}/
```

ارسال خودکار در صورت تغییر Activity:

* posture
* behavior

---

## ⏱️ Background Tasks (Celery)

### aggregate_activity_hourly

* هر 10 ثانیه
* تجمیع Activity → ActivityHourly

### update_threshold_daily

* روزانه
* محاسبه calories, sleep, activity

---

## 🔐 Validation & Security

* ThresholdSerializer اعتبار Pet را از Pet Service چک می‌کند
* VetInfoMedical اعتبار Owner را از Owner Service چک می‌کند
* Transaction atomic در update VetForm

---

## ✅ Best Practices استفاده‌شده

* Event Driven Architecture (Kafka)
* Snapshot Pattern (VetForm)
* CQRS نسبی (Write via Events)
* Real-time via Channels
* Async Aggregation (Celery)

---

## 🚀 پیشنهادهای توسعه

* Schema Registry برای Kafka
* RBAC بین Vet / Admin
* Saga Pattern برای Purchase → VetForm
* Monitoring (Prometheus + Grafana)

---

📌 این دو سرویس قلب **Medical Intelligence** سیستم شما هستند.
