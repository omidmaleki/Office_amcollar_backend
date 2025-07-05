# collar/models.py
from django.db import models
from users.models import User
from pet.models import Pet


class Collar(models.Model):
    serial_number = models.CharField(max_length=100, unique=True)
    firmware_version = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    assigned_pet = models.ForeignKey(Pet, on_delete=models.SET_NULL, null=True, blank=True, related_name='collars')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='collars')

    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Collar {self.serial_number} - Owner: {self.owner.username}"
