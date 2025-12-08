# Sale Service

این سرویس مسئول **پرداخت و سفارش (Payment & Order)** در پروژه AmCollar است.  
سرویس با Django REST Framework ساخته شده و با PostgreSQL و Kafka هماهنگ است.

---

## 🛠️ تکنولوژی‌ها

- Python 3.10  
- Django 5.1  
- Django REST Framework  
- PostgreSQL  
- Kafka (برای Event Streaming در نسخه‌های پیشرفته)  
- Docker / Docker Compose


---

## ⚡ نصب و راه‌اندازی

docker compose up --build

## Endpoint 🚀
۱. ایجاد Payment و Order

POST /payments/create/
Content-Type: application/json

{
  "owner_id": 1,
  "collar_id": 5,
  "vet_id": 2,
  "pet_id": 3
}
Response:
{
  "payment": {
    "id": 1,
    "owner_id": 1,
    "collar_id": 5,
    "vet_id": 2,
    "amount": "123.45",
    "status": "success",
    "created_at": "2025-12-08T10:00:00Z"
  },
  "order": {
    "id": 1,
    "owner_id": 1,
    "collar_id": 5,
    "vet_id": 2,
    "pet_id": 3,
    "amount": "123.45",
    "status": "paid",
    "payment": 1,
    "created_at": "2025-12-08T10:00:01Z"
  }
}

## لیست سفارش‌ها

GET /orders/


[
  {
    "id": 1,
    "owner_id": 1,
    "collar_id": 5,
    "vet_id": 2,
    "pet_id": 3,
    "amount": "123.45",
    "status": "paid",
    "payment": 1,
    "created_at": "2025-12-08T10:00:01Z"
  }
]


## ⚙️ نکات مهم

وقتی Payment ساخته می‌شود، Order به صورت خودکار با Signal ایجاد می‌شود.

یک Payment فقط یک Order دارد (OneToOneField).

مقدار amount همیشه به صورت Decimal ذخیره می‌شود.
