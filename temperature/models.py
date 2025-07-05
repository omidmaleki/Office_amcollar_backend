# Temperature/models.py
from django.db import models
from django.utils import timezone
from collar.models import Collar
from pet.models import Pet

class Temperature(models.Model):
    collar = models.ForeignKey(Collar, on_delete=models.SET_NULL, null=True, blank=True, related_name='temperatures')
    pet = models.ForeignKey(Pet, on_delete=models.SET_NULL, null=True, blank=True, related_name='temperatures')

    temp_value = models.FloatField()
    temp_timestamp = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Temperature {self.temp_value}°C at {self.temp_timestamp} - Pet: {self.pet} - Collar: {self.collar}"
