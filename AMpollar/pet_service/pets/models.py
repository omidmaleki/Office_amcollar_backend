from django.db import models

class Pet(models.Model):
    name = models.CharField(max_length=100)
    owner_id = models.IntegerField(default=0,null=True, blank=True)
    vet_id = models.IntegerField(default=0,null=True, blank=True)
    collar_id = models.IntegerField(default=0,null=True, blank=True)

    species = models.CharField(
        max_length=100,
        choices=(("cat", "cat"), ("dog", "dog"))
                               )
    age = models.IntegerField(null=True, blank=True)
    sex = models.CharField(
        max_length=10,
        choices=(("male", "Male"), ("female", "Female"))
    )
    race = models.CharField(max_length=100, null=True, blank=True)
    weight = models.FloatField(null=True, blank=True, default=5)
    neutered = models.BooleanField(default=False)

    surgery_history = models.DateField(null=True, blank=True, default=None)

    radiography_images = models.JSONField(default=list, blank=True)
    test_reports = models.JSONField(default=list, blank=True)

    annual_vaccine_date = models.DateField(null=True, blank=True, default=None)

    created_at = models.DateTimeField(auto_now_add=True)

class Threshold(models.Model):
    pet = models.OneToOneField(Pet, on_delete=models.CASCADE, related_name="threshold")

    # --- Health Metrics ---
    heart_rate = models.FloatField(default=90)               # 60–140 bpm → مقدار متوسط
    body_temperature = models.FloatField(default=38.5)       # 38–39.2°C → مقدار متوسط
    respiratory_rate = models.FloatField(default=20)         # 10–35 breaths/min
    oxygen_saturation = models.FloatField(default=98)        # 95%+
    hrv = models.FloatField(default=50)                      # رنج نرمال 20–100

    # --- Calories & Activity ---
    calories_consumed = models.FloatField(default=0)         # شروع روزانه از ۰
    sleep_amount = models.FloatField(default=0)              # ساعت
    activity_amount = models.FloatField(default=0)           # دقیقه/ساعت

    # --- Consumptions ---
    water_consumption = models.FloatField(default=0)         # ml
    food_consumption = models.FloatField(default=0)          # گرم/کیلو

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Thresholds for {self.pet.name}"