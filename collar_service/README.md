# Collar Management Microservice

این سرویس یک **میکروسرویس مدیریت قلاده (Collar)** است که با Django Rest Framework پیاده‌سازی شده و مسئول مدیریت اطلاعات قلاده‌ها و وضعیت WiFi آن‌ها می‌باشد.

---

## ✨ قابلیت‌ها

* CRUD کامل برای قلاده‌ها (Collar)
* جستجوی قلاده بر اساس MAC Address
* مدیریت وضعیت WiFi قلاده‌ها
* فیلتر وضعیت WiFi بر اساس owner_id
* سازگار با معماری Microservice

---

## 🧱 معماری

```
[ Client / IoT Device ]
        |
        v
[ Collar Service ]
        |
        v
[ Database ]
```

* این سرویس به صورت مستقل اجرا می‌شود
* قابلیت اتصال به Auth Service از طریق owner_id

---

## ⚙️ تکنولوژی‌ها

* Python 3
* Django
* Django Rest Framework
* PostgreSQL / MySQL
* Docker 

---

## 📦 مدل‌ها

### Collar

| فیلد            | توضیح               |
| --------------- | ------------------- |
| name            | نام محصول           |
| description     | توضیحات             |
| price           | قیمت                |
| image           | تصویر               |
| color_product   | رنگ محصول           |
| color_container | رنگ بسته‌بندی       |
| size            | سایز                |
| mac_address     | مک آدرس یکتا        |
| owner_id        | لیست Ownerها (JSON) |
| created_at      | زمان ایجاد          |
| updated_at      | زمان بروزرسانی      |

---

### WifiCollarStatus

| فیلد     | توضیح      |
| -------- | ---------- |
| owner_id | شناسه مالک |
| ssid     | نام WiFi   |
| password | رمز WiFi   |

---

## 🔗 API Endpoints

### Collar

#### لیست و ایجاد قلاده

```
GET    /collars/
POST   /collars/
```

#### دریافت، ویرایش، حذف

```
GET    /collars/{id}/
PUT    /collars/{id}/
PATCH  /collars/{id}/
DELETE /collars/{id}/
```

#### دریافت قلاده با MAC Address

```
GET /collars/by-mac/{mac_address}/
```

**Response نمونه:**

```json
{
  "id": 1,
  "owner_id": [12, 15]
}
```

---

### Wifi Collar Status

#### لیست و ایجاد

```
GET  /collars_status/
POST /collars_status/
```

#### فیلتر بر اساس owner_id

```
GET /collars_status/?owner_id=12
```

#### دریافت، ویرایش، حذف

```
GET    /collars_status/{id}/
PUT    /collars_status/{id}/
PATCH  /collars_status/{id}/
DELETE /collars_status/{id}/
```

---

## 🧭 Router Configuration

```python
router.register("collars", CollarViewSet)
router.register("collars_status", WifiCollarStatusViewSet)
```

---

## 🌍 Environment Variables (پیشنهادی)

```env
DEBUG=False
SECRET_KEY=your-secret-key
DATABASE_URL=postgres://...
```

---

## 🐳 Docker (نمونه)

```yaml
services:
  collar:
    build: .
    ports:
      - "8001:8000"
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

## 🔐 نکات امنیتی و معماری

* ارتباط با Auth Service از طریق owner_id
* MAC Address به صورت unique index شده
* آماده برای اتصال به IoT Device

---

## 📈 توسعه‌های پیشنهادی

* اتصال مستقیم به Auth Service (JWT Validation)
* Encrypt کردن password WiFi
* اضافه کردن status آنلاین/آفلاین قلاده
* استفاده از Redis برای Cache

---

## 📄 License

MIT L
