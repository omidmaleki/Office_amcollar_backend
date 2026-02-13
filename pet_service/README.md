# Pet Management Microservice

این سرویس یک **میکروسرویس مدیریت حیوانات (Pet)** است که اطلاعات پایه و پزشکی حیوانات را نگهداری می‌کند و به صورت مستقل در معماری Microservice اجرا می‌شود.

این سرویس معمولاً از طریق **API Gateway** فراخوانی می‌شود و با سرویس‌های Owner، Vet و Collar در ارتباط است (از طریق ID).

---

## 🎯 مسئولیت‌ها

* CRUD کامل Pet
* فیلتر Pet بر اساس owner_id
* مدیریت اطلاعات ثانویه و پزشکی Pet
* Health Check برای Orchestrator / Gateway

---

## 🧱 معماری

```
[ API Gateway ]
       |
       v
[ Pet Service ]
       |
       v
[ Database ]
```

* Pet Service فقط مسئول داده‌های Pet است
* هیچ وابستگی مستقیم به دیتابیس سرویس‌های دیگر ندارد
* ارتباط بین سرویس‌ها از طریق ID انجام می‌شود

---

## ⚙️ تکنولوژی‌ها

* Python 3
* Django
* Django Rest Framework
* PostgreSQL / MySQL
* Docker (پیشنهادی)

---

## 📦 مدل‌ها

### Pet

| فیلد                | نوع        | توضیح              |
| ------------------- | ---------- | ------------------ |
| id                  | Integer    | شناسه              |
| name                | String     | نام حیوان          |
| owner_id            | Integer    | شناسه مالک         |
| vet_id              | Integer    | شناسه دامپزشک      |
| collar_id           | Integer    | شناسه قلاده        |
| species             | Enum       | cat / dog          |
| age                 | Integer    | سن                 |
| sex                 | Enum       | male / female      |
| pet_image           | Image      | تصویر              |
| race                | String     | نژاد               |
| weight              | Float      | وزن                |
| neutered            | Boolean    | عقیم شده           |
| surgery_history     | Date       | سابقه جراحی        |
| radiography_images  | JSON[List] | تصاویر رادیولوژی   |
| test_reports        | JSON[List] | گزارش آزمایش       |
| annual_vaccine_date | Date       | تاریخ واکسن سالانه |
| created_at          | DateTime   | زمان ایجاد         |

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

### Pet CRUD

#### ایجاد Pet

```
POST /pets/
```

Request نمونه:

```json
{
  "name": "Leo",
  "species": "dog",
  "sex": "male",
  "age": 3,
  "owner_id": 12,
  "vet_id": 5,
  "collar_id": 2
}
```

---

#### لیست Petها

```
GET /pets/
```

#### فیلتر بر اساس Owner

```
GET /pets/?owner_id=12
```

---

#### دریافت / ویرایش / حذف

```
GET    /pets/{id}/
PUT    /pets/{id}/
PATCH  /pets/{id}/
DELETE /pets/{id}/
```

---

## 🧬 Pet Secondary Info (Info2)

این Endpoint برای **آپدیت اطلاعات پزشکی و ثانویه Pet** طراحی شده و از طریق `owner_id` کار می‌کند.

```
GET   /pets/info2/<owner_id>/
PATCH /pets/info2/<owner_id>/
```

### فیلدهای قابل ویرایش

* name
* species
* age
* sex
* pet_image
* race
* weight
* neutered
* surgery_history
* annual_vaccine_date

### فیلدهای Read-only

* id
* owner_id
* vet_id
* collar_id

---

## 🔐 Validation & Rules

* هر Pet به یک Owner متصل است (owner_id)
* تغییر owner_id، vet_id و collar_id در Info2 مجاز نیست
* owner_id برای دریافت Pet یکتا در Info2 فرض شده است

---

## 🐳 Docker Sample

```yaml
services:
  pet:
    build: .
    ports:
      - "8003:8000"
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

* Index روی owner_id
* پشتیبانی از چند Pet برای هر Owner در Info2
* اتصال Event-driven به Owner Service
* JWT Validation از طریق Gateway

---

## 📄 License

MIT License
