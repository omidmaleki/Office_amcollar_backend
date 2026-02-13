# Owner Management Microservice

این سرویس یک **میکروسرویس مدیریت Owner (مالک)** است که در معماری Microservice استفاده می‌شود و اطلاعات پایه‌ی مالک حیوانات را نگهداری می‌کند.

این سرویس به صورت مستقل اجرا شده و از طریق **API Gateway** یا مستقیم قابل دسترسی است.

---

## 🎯 مسئولیت‌ها

* CRUD کامل Owner
* نگهداری ارتباط Owner با Pet و Collar (به صورت ID)
* Health Check برای Orchestration
* ارسال OTP از طریق Gateway (Proxy)

---

## 🧱 معماری

```
[ API Gateway ]
       |
       v
[ Owner Service ]
       |
       v
[ Database ]
```

* Owner Service stateful است
* فقط داده‌ی Owner را مدیریت می‌کند
* وابستگی مستقیم به سرویس Pet و Collar ندارد

---

## ⚙️ تکنولوژی‌ها

* Python 3
* Django
* Django Rest Framework
* PostgreSQL / MySQL
* Docker (پیشنهادی)

---

## 📦 مدل‌ها

### Owner

| فیلد       | نوع             | توضیح                 |
| ---------- | --------------- | --------------------- |
| id         | Integer         | شناسه                 |
| name       | String          | نام مالک              |
| phone      | String          | شماره موبایل (Unique) |
| address    | String          | آدرس                  |
| pet_ids    | JSON[List[int]] | لیست شناسه حیوانات    |
| collar_ids | JSON[Dict]      | نگاشت collar به pet   |
| vet_id     | Integer         | دامپزشک مرتبط         |

---

## 🔗 API Endpoints

### Health Check

```
GET /health/
```

Response:

```json
{ "status": "ok" }
```

---

### Owner CRUD

#### ایجاد Owner

```
POST /owners/
```

Request:

```json
{
  "name": "Ali",
  "phone": "09123456789",
  "address": "Tehran",
  "vet_id": 3,
  "pet_ids": [],
  "collar_ids": {}
}
```

Responses:

* `201 Created`
* `409 Conflict` → شماره قبلاً ثبت شده

---

#### لیست Ownerها

```
GET /owners/
```

#### دریافت Owner

```
GET /owners/{id}/
```

#### ویرایش Owner

```
PUT   /owners/{id}/
PATCH /owners/{id}/
```

#### حذف Owner

```
DELETE /owners/{id}/
```

---

### ارسال OTP (Proxy به Gateway)

```
POST /send-otp/
```

Request:

```json
{
  "phone": "09123456789",
  "otp_code": "1234"
}
```

> این Endpoint مستقیماً OTP ارسال نمی‌کند و درخواست را به **API Gateway / SMS Service** فوروارد می‌کند.

---

## 🔐 Validation & Rules

* phone یکتا است
* name و phone الزامی هستند
* ایجاد Owner داخل `transaction.atomic` انجام می‌شود

---

## 🐳 Docker Sample

```yaml
services:
  owner:
    build: .
    ports:
      - "8002:8000"
    env_file:
      - .env
```

---

## 🚀 اجرا

```bash
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

---

## 📈 Best Practices & Future Improvements

* حذف SendOtp از Owner و انتقال کامل به Auth Service
* JWT Validation (via Gateway)
* Index روی phone
* Event-driven sync با Pet/Collar (Kafka / RabbitMQ)

---

## 📄 License

MIT License
