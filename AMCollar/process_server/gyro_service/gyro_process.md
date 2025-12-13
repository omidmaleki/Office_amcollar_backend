
### ۱. تابع `compute_bmi`

```python
def compute_bmi(weight_kg, height_m):
    return weight_kg / (height_m ** 2)
```

* ورودی: وزن (کیلوگرم) و قد (متر)
* خروجی: شاخص توده بدنی (BMI)
* فرمول BMI: وزن تقسیم بر مجذور قد.

---

### ۲. تابع `process_window`

```python
def process_window(data_window, weight_kg, height_m, window_seconds):
```

* **ورودی‌ها:**

  * `data_window`: لیستی از داده‌های حسگر در یک بازه زمانی.

    * هر عنصر باید یک دیکشنری با کلیدهای `ACCx`, `ACCy`, `ACCz`, `Gx`, `Gy`, `Gz` باشد.
  * `weight_kg` و `height_m`: برای محاسبه BMI و کالری.
  * `window_seconds`: طول بازه زمانی به ثانیه.

* **خروجی:** دیکشنری با اطلاعات زیر:

  * وضعیت بدن (`posture`)
  * حالت رفتاری (`behavior`)
  * شدت فعالیت (`activity_intensity`)
  * کالری مصرفی (`calories`)
  * BMI
  * مدت زمان خواب یا فعالیت (`sleep_time_sec`, `activity_time_sec`)

---

### ۳. پردازش داده‌های حسگر

```python
acc = np.array([[d["ACCx"], d["ACCy"], d["ACCz"]] for d in data_window])
gyro = np.array([[d["Gx"], d["Gy"], d["Gz"]] for d in data_window])
```

* داده‌های شتاب‌سنج و ژیروسکوپ را به آرایه‌های NumPy تبدیل می‌کند.

```python
acc_mag = np.linalg.norm(acc, axis=1)
gyro_mag = np.linalg.norm(gyro, axis=1)
```

* **مقدار مطلق (Magnitude)** شتاب و چرخش را در هر نمونه محاسبه می‌کند:

  * ( \text{mag} = \sqrt{x^2 + y^2 + z^2} )

```python
acc_mean = acc_mag.mean()
acc_var = acc_mag.var()
gyro_mean = gyro_mag.mean()
```

* محاسبه میانگین و واریانس شتاب و میانگین ژیروسکوپ.

---

### ۴. تشخیص وضعیت بدن (Posture)

```python
if acc_mean < 9.9 and gyro_mean < 0.05:
    posture = "lying"
elif acc_mean < 10.5:
    posture = "sitting"
else:
    posture = "standing"
```

* با توجه به میانگین شتاب و ژیروسکوپ، وضعیت بدن را حدس می‌زند:

  * کم شتاب و کم چرخش → خوابیده
  * شتاب متوسط → نشسته
  * شتاب بالا → ایستاده

---

### ۵. شدت فعالیت و حالت رفتاری

```python
activity_intensity = acc_var
```

* **شدت فعالیت** با واریانس شتاب سنج تخمین زده می‌شود.

```python
if activity_intensity < 0.02 and gyro_mean < 0.03:
    behavior = "sleep"
elif activity_intensity < 0.1:
    behavior = "rest"
elif activity_intensity < 0.5:
    behavior = "active"
else:
    behavior = "highly_active"
```

* با توجه به واریانس شتاب و میانگین ژیروسکوپ، حالت رفتاری مشخص می‌شود:

  * بسیار کم → خواب
  * کم → استراحت
  * متوسط → فعال
  * زیاد → خیلی فعال

---

### ۶. محاسبه کالری با استفاده از MET

```python
MET_MAP = {
    "sleep": 0.95,
    "rest": 1.2,
    "active": 2.5,
    "highly_active": 4.5
}
MET = MET_MAP[behavior]
calories = MET * weight_kg * (window_seconds / 3600)
```

* **MET (Metabolic Equivalent of Task)** برای هر رفتار مشخص شده.
* کالری مصرفی تقریباً بر اساس وزن، MET و زمان محاسبه می‌شود.

---

### ۷. خروجی نهایی

```python
return {
    "posture": posture,
    "behavior": behavior,
    "activity_intensity": round(activity_intensity, 4),
    "calories": round(calories, 4),
    "BMI": round(compute_bmi(weight_kg, height_m), 2),
    "sleep_time_sec": window_seconds if behavior == "sleep" else 0,
    "activity_time_sec": window_seconds if behavior in ["active", "highly_active"] else 0
}
```

* دیکشنری شامل اطلاعات اصلی، کالری، BMI و مدت زمان خواب/فعالیت.

---

💡 **جمع‌بندی ساده:**
این کد داده‌های حسگر حرکتی را در یک بازه زمانی می‌گیرد، وضعیت بدن و شدت فعالیت را تخمین می‌زند، کالری مصرفی و BMI را محاسبه می‌کند و اطلاعات را در قالب یک دیکشنری بازمی‌گرداند.

---