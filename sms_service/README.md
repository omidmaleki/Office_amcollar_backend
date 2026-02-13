# SMS Service

سرویس SMS برای ارسال OTP یا پیامک‌های مبتنی بر Template از طریق API SMS.ir طراحی شده است.

---

## 🔹 پیش‌نیازها

1. Django 5.x
2. Django REST Framework
3. دسترسی به اینترنت برای تماس با SMS.ir API
4. تنظیمات زیر در `settings.py`:

```python
SMSIR_API_KEY = "<API_KEY>"
SMSIR_TEMPLATE_ID = <TEMPLATE_ID>
```

## پارامترها
phone: شماره موبایل دریافت‌کننده پیامک

code: کد OTP یا مقدار قابل جایگزینی در Template

## خروجی نمونه

```
{
  "IsSuccessful": true,
  "Message": "پیام با موفقیت ارسال شد",
  "Code": 0
}
```