# geofence/models.py
from django.db import models
from django.utils import timezone
from pet.models import Pet
from collar.models import Collar

class GeoFence(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="geofences")
    collar = models.ForeignKey(Collar, on_delete=models.SET_NULL, null=True, blank=True, related_name="geofences")

    center_lat = models.FloatField()
    center_lon = models.FloatField()
    radius_meters = models.FloatField()
    is_active = models.BooleanField(default=True)
    last_updated = models.DateTimeField(default=timezone.now)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"GeoFence for {self.pet.name} - Radius: {self.radius_meters}m"
