# owner_thresholds/models.py
from django.db import models
from django.conf import settings
from pet.models import Pet
from collar.models import Collar

class OwnerThreshold(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owner_thresholds")
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="owner_thresholds")
    collar = models.ForeignKey(Collar, on_delete=models.SET_NULL, null=True, blank=False, related_name="owner_thresholds")

    geofence_radius = models.FloatField(help_text="Safe geofence radius in meters")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('owner', 'pet', 'collar')

    def __str__(self):
        return f"OwnerThreshold: {self.owner.username} - {self.pet.name} - Collar: {self.collar} ({self.geofence_radius}m)"
