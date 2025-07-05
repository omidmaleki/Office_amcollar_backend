# device_information/models.py
from django.db import models
from django.utils import timezone
from pet.models import Pet
from collar.models import Collar

class DeviceInformation(models.Model):
    device_id = models.CharField(max_length=100, unique=True)  # Device Unique ID
    collar = models.OneToOneField(Collar, on_delete=models.CASCADE, related_name='device_info')
    pet = models.ForeignKey(Pet, on_delete=models.SET_NULL, null=True, blank=True, related_name='device_infos')

    firmware_version = models.CharField(max_length=50, null=True, blank=True)
    hardware_version = models.CharField(max_length=50, null=True, blank=True)
    last_sync_time = models.DateTimeField(null=True, blank=True)
    is_online = models.BooleanField(default=False)

    notifications_enabled = models.BooleanField(default=True)
    led_on = models.BooleanField(default=True)
    gps_on = models.BooleanField(default=True)
    vibration_on = models.BooleanField(default=True)
    sound_on = models.BooleanField(default=True)

    paired_timestamp = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Device {self.device_id} for Pet {self.pet} (Collar {self.collar})"
