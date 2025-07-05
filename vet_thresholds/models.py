# vet_thresholds/models.py
from django.db import models
from django.conf import settings
from pet.models import Pet
from collar.models import Collar
from django.utils import timezone

class VetThreshold(models.Model):
    vet = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="vet_thresholds")
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="vet_thresholds")
    collar = models.ForeignKey(Collar, on_delete=models.CASCADE, related_name="vet_thresholds")

    temp_min = models.FloatField()
    temp_max = models.FloatField()

    hr_min = models.FloatField()
    hr_max = models.FloatField()

    hrv_min = models.FloatField(null=True, blank=True)
    hrv_max = models.FloatField(null=True, blank=True)

    spo2_min = models.FloatField(null=True, blank=True)
    spo2_max = models.FloatField(null=True, blank=True)

    bp_sys_min = models.FloatField(null=True, blank=True)
    bp_sys_max = models.FloatField(null=True, blank=True)
    bp_dia_min = models.FloatField(null=True, blank=True)
    bp_dia_max = models.FloatField(null=True, blank=True)

    thresholds_updated = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('vet', 'pet', 'collar')

    def __str__(self):
        return f"VetThreshold for {self.pet.name} by {self.vet.username} on Collar {self.collar.serial_number}"
