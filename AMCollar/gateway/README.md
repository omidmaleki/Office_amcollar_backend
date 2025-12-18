# API Gateway / Orchestrator Microservice

این سرویس نقش **API Gateway و Orchestrator** را در معماری Microservice ایفا می‌کند و نقطه‌ی ورود (Single Entry Point) کل سیستم است.

تمام درخواست‌های کلاینت (Web / Mobile / IoT) ابتدا به این سرویس وارد شده و سپس به سرویس مربوطه **Forward** یا **Orchestrate** می‌شوند.

---

## 🎯 مسئولیت‌ها

* Proxy کردن درخواست‌ها به سرویس‌های داخلی
* Orchestration بین چند سرویس (Saga-like)
* تجمیع داده‌ها از چند Microservice
* مدیریت Rollback در عملیات‌های چندمرحله‌ای
* پنهان‌سازی ساختار داخلی سیستم از کلاینت

---

## 🧱 معماری کلی

```
                [ Client ]
                     |
                     v
              [ API Gateway ]
   ------------------------------------------------
   |     |      |       |       |       |         |
[Auth] [Owner] [Pet] [Collar] [Sale] [Vet] [SMS]
```

---

## ⚙️ تکنولوژی‌ها

* Python 3
* Django
* Django Rest Framework
* requests
* Docker / Docker Compose

---

## 🌍 Service Endpoints (Internal)

```python
OWNER_SERVICE     = http://owner:8000
PET_SERVICE       = http://pet:8000
COLLAR_SERVICE    = http://collar:8000
SALE_SERVICE      = http://sale:8000
SMS_SERVICE       = http://sms:8000
AUTH_SERVICE      = http://auth:8000
VET_SERVICE       = http://vet:8000
THRESHOLD_SERVICE = http://threshold:8000
```

---

## 🔁 Proxy Pattern

### BaseProxy

یک کلاس عمومی برای Forward کردن GET و POST:

```python
class BaseProxy(APIView):
    SERVICE_URL = None
```

تمام Proxyها از این کلاس ارث‌بری می‌کنند.

---

## 🔗 Proxy Endpoints

### Owner Service

```
GET  /owners/
POST /owners/
```

### Pet Service

```
GET  /pets/
POST /pets/
GET  /pets/info2/<owner_id>/
PATCH /pets/info2/<owner_id>/
```

### Collar Service

```
GET  /collars/
POST /collars/

GET  /collars/status/
POST /collars/status/
PATCH /collars/status/
```

---

### Auth Service (Dynamic Proxy)

```
POST /auth/<any-path>/
```

مثال:

```
/auth/owners/send-otp/
/auth/vets/verify-otp/
```

---

### SMS Service

```
POST /sms/
```

---

### Payment & Orders (Sale Service)

#### Create Payment

```
POST /payments/create/
```

Required Fields:

```json
{
  "owner_id": 1,
  "collar_id": 2,
  "vet_id": 3,
  "pet_id": 4
}
```

#### Orders (Aggregated)

```
GET /orders/
```

این Endpoint اطلاعات را از چند سرویس جمع‌آوری می‌کند:

* Sale
* Owner
* Pet

---

### Vet Service

```
POST /vet/vets/register/
GET  /vet/vet-forms/
POST /vet/vet-forms/
GET  /vet/vet-forms/<pk>/
PATCH /vet/vet-forms/<pk>/
GET  /vet/medical-info/
POST /vet/medical-info/
```

---

### Threshold Service

```
GET  /thresholds/
POST /thresholds/
GET  /thresholds/<pk>/
PATCH /thresholds/<pk>/
DELETE /thresholds/<pk>/
```

---

## 🔄 Orchestration Endpoint

### Register Owner + Pet (Saga Pattern)

```
POST /register/
```

### Flow:

1. Health Check (Owner, Pet)
2. Create Owner
3. Create Pet
4. Update Owner with pet_id
5. Rollback در صورت خطا

### Request Sample:

```json
{
  "owner": {
    "name": "Ali",
    "phone": "09123456789",
    "address": "Tehran"
  },
  "pet": {
    "name": "Leo",
    "species": "dog",
    "age": 3
  },
  "vet": 5
}
```

---

## 🔐 Error Handling

* Timeout برای تمام درخواست‌ها
* Forward کردن status code اصلی
* Rollback خودکار در عملیات چندمرحله‌ای

---

## 🐳 Docker Sample

```yaml
services:
  gateway:
    build: .
    ports:
      - "8000:8000"
    depends_on:
      - owner
      - pet
      - auth
```

---

## 📈 Best Practices & Future Improvements

* JWT Validation در Gateway
* Rate Limiting
* Circuit Breaker (Hystrix Pattern)
* Centralized Logging
* API Versioning
* OpenAPI / Swagger

---

## 📄 License

MIT License
