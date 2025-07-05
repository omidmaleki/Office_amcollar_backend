# system_thresholds/models.py
from django.db import models

class PetCategory(models.Model):
    species = models.CharField(max_length=50)  # مثل سگ، گربه و ...
    breed = models.CharField(max_length=50, null=True, blank=True)  # نژاد (اختیاری)
    min_weight = models.FloatField(null=True, blank=True)
    max_weight = models.FloatField(null=True, blank=True)
    min_age_months = models.IntegerField(null=True, blank=True)
    max_age_months = models.IntegerField(null=True, blank=True)

    def __str__(self):
        breed_display = self.breed if self.breed else "Any"
        return f"{self.species} - {breed_display} ({self.min_weight} to {self.max_weight} kg)"

class SystemThreshold(models.Model):
    category = models.ForeignKey(PetCategory, on_delete=models.CASCADE, related_name='thresholds')
    daily_calories = models.FloatField(null=True, blank=True)
    daily_water_ml = models.FloatField(null=True, blank=True)
    daily_food_grams = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Thresholds for {self.category}"
