# Auth OTP Microservice

این سرویس یک **میکروسرویس احراز هویت مبتنی بر OTP** است که با استفاده از Django Rest Framework پیاده‌سازی شده و وظیفه‌ی ارسال و اعتبارسنجی کد یکبار مصرف (OTP) و صدور JWT را بر عهده دارد.

---

## ✨ قابلیت‌ها

* ارسال OTP از طریق سرویس SMS (Microservice جداگانه)
* اعتبارسنجی OTP با زمان انقضا
* پشتیبانی از نقش‌ها (Owner / Vet / Admin)
* صدور Access Token و Refresh Token (JWT)
* معماری Microservice-friendly
* ارتباط با SMS Gateway از طریق HTTP

---

## 🧱 معماری

```
[ Client ]
    |
    v
[ Auth Service ]  --->  [ SMS Service ]
    |
    v
[ Database ]
```

* **Auth Service**: مدیریت OTP، کاربران و JWT
* **SMS Service / Gateway**: ارسال پیامک
* ارتباط بین سرویس‌ها از طریق REST

---

## ⚙️ تکنولوژی‌ها

* Python 3
* Django & Django Rest Framework
* SimpleJWT
* PostgreSQL / MySQL
* Docker (پیشنهادی)

---

## 🔐 مدل‌ها

### Owner

| فیلد      | توضیح                 |
| --------- | --------------------- |
| phone     | شماره موبایل (Unique) |
| role      | owner / vet / admin   |
| is_active | وضعیت فعال            |
| is_staff  | دسترسی ادمین          |

### OTP

| فیلد       | توضیح             |
| ---------- | ----------------- |
| phone      | شماره موبایل      |
| role       | نقش               |
| code_hash  | هش کد OTP         |
| expires_at | زمان انقضا        |
| used       | استفاده شده یا نه |

---

## 🔑 API Endpoints

### Owner

#### ارسال OTP

```
POST /owners/send-otp/
{
  "phone": "09123456789"
}
```

#### تایید OTP

```
POST /owners/verify-otp/
{
  "phone": "09123456789",
  "code": "1234"
}
```

---

### Vet

#### ارسال OTP

```
POST /vets/send-otp/
```

#### تایید OTP

```
POST /vets/verify-otp/
```

---

### Admin

#### اختصاص نقش

```
POST /assign-role/
{
  "phone": "09123456789",
  "role": "vet"
}
```

> 🔒 فقط Admin دسترسی دارد

---

## 🔐 JWT Response

```json
{
  "success": true,
  "access": "<ACCESS_TOKEN>",
  "refresh": "<REFRESH_TOKEN>",
  "expires_in": 300
}
```

---

## 🌍 Environment Variables

```env
SMS_SERVICE_URL=http://sms:8000
GATEWAY_URL=http://gateway:8000
OTP_EXPIRE_MINUTES=5
SECRET_KEY=your-secret-key
DEBUG=False
```

---

## 🐳 Docker (نمونه)

```yaml
services:
  auth:
    build: .
    ports:
      - "8000:8000"
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

## 📌 نکات امنیتی

* OTP به صورت **هش شده** ذخیره می‌شود
* OTP فقط یکبار قابل استفاده است
* دارای زمان انقضا
* JWT شامل role و phone است

---

## 📄 License

MIT License

---

✉️ در صورت نیاز به توسعه (Rate Limit، Redis، Celery، OTP Cache) قابل گسترش است.
