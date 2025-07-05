# activity_tracker/models.py
from django.db import models
from pet.models import Pet
from collar.models import Collar


class ActivityRecord(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='activity_records')
    collar = models.ForeignKey(Collar, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='activity_records')
    date = models.DateField()

    sleep_duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    calories_burned = models.FloatField(null=True, blank=True)
    walk_duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    walk_distance_km = models.FloatField(null=True, blank=True)

    # فعالیت‌های جزئی‌تر
    play_duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    run_duration_minutes = models.PositiveIntegerField(null=True, blank=True)

    gps_path = models.JSONField(null=True, blank=True)  # لیست مختصات GPS

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"ActivityRecord {self.date} - Pet: {self.pet.name}"
