# pet/models.py
from django.db import models
from django.conf import settings
from system_thresholds.models import PetCategory

class Pet(models.Model):
    MALE = 'male'
    FEMALE = 'female'
    GENDER_CHOICES = [
        (MALE, 'Male'),
        (FEMALE, 'Female'),
    ]

    category = models.ForeignKey(PetCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='pets')
    name = models.CharField(max_length=50)
    species = models.CharField(max_length=50)
    breed = models.CharField(max_length=50, null=True, blank=True)
    age_months = models.PositiveIntegerField()
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)
    neutered = models.BooleanField(null=True, blank=True)
    weight_kg = models.FloatField(null=True, blank=True)

    surgery_history = models.TextField(null=True, blank=True)
    radiography_images = models.JSONField(null=True, blank=True)
    blood_test_images = models.JSONField(null=True, blank=True)

    annual_vaccine_date = models.DateField(null=True, blank=True)
    other_vaccine_date = models.DateField(null=True, blank=True)

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_pets'
    )

    vet = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_pets'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (Owner: {self.owner.username}, Vet: {self.vet.username if self.vet else 'None'})"
