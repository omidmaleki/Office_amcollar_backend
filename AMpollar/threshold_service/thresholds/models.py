from django.db import models


class Threshold(models.Model):
    pet_id = models.IntegerField()

    # --- Health Metrics ---
    heart_rate = models.FloatField(default=70,blank=True, null=True)
    body_temperature = models.FloatField(default=37,blank=True, null=True)
    respiratory_rate = models.FloatField(default=20,blank=True, null=True)
    oxygen_saturation = models.FloatField(default=95,blank=True, null=True)
    hrv = models.FloatField(default=50,blank=True, null=True)

    # --- Calories & Activity ---
    calories_consumed = models.FloatField(default=0,blank=True, null=True)
    sleep_amount = models.FloatField(default=8,blank=True, null=True)
    activity_amount = models.FloatField(default=60,blank=True, null=True)

    # --- Consumptions ---
    water_consumption = models.FloatField(default=1.5,blank=True, null=True)
    food_consumption = models.FloatField(default=300,blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Threshold for pet {self.pet_id}"
