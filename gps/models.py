# gps/models.py
from django.db import models
from pet.models import Pet
from collar.models import Collar

class GPS(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='gps_data')
    collar = models.ForeignKey(Collar, on_delete=models.CASCADE, related_name='gps_data')

    gps_lat = models.FloatField()
    gps_lon = models.FloatField()
    gps_speed = models.FloatField(null=True, blank=True)
    gps_heading = models.FloatField(null=True, blank=True)
    gps_satellites = models.IntegerField(null=True, blank=True)
    gps_accuracy_horizontal = models.FloatField(null=True, blank=True)
    gps_timestamp = models.DateTimeField(null=True, blank=True)
    gps_valid = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"GPS ({self.gps_lat}, {self.gps_lon}) at {self.gps_timestamp or 'unknown time'}"
