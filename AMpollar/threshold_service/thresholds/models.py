from django.db import models


class Threshold(models.Model):
    pet_id = models.IntegerField()

    # --- Health Metrics ---
    heart_rate = models.FloatField(default=70)
    body_temperature = models.FloatField(default=37)
    respiratory_rate = models.FloatField(default=20)
    oxygen_saturation = models.FloatField(default=95)
    hrv = models.FloatField(default=50)

    # --- Calories & Activity ---
    calories_consumed = models.FloatField(default=0)
    sleep_amount = models.FloatField(default=8)
    activity_amount = models.FloatField(default=60)

    # --- Consumptions ---
    water_consumption = models.FloatField(default=1.5)
    food_consumption = models.FloatField(default=300)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Threshold for pet {self.pet_id}"
