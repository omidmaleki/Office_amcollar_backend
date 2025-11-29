from decimal import Decimal
from django.db import models
from django.conf import settings


class Pet(models.Model):

    class Gender(models.TextChoices):
        MALE = 'male', 'Male'
        FEMALE = 'female', 'Female'

    # Basic Info
    category = models.ForeignKey(
        'PetCategory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pets'
    )

    name = models.CharField(max_length=50)
    species = models.CharField(max_length=50)
    breed = models.CharField(max_length=50, null=True, blank=True)
    age_months = models.PositiveIntegerField()

    gender = models.CharField(
        max_length=6,
        choices=Gender.choices
    )
    neutered = models.BooleanField(null=True, blank=True)

    weight_kg = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Example: 4.25"
    )

    # Medical Info
    surgery_history = models.TextField(null=True, blank=True)
    radiography_images = models.JSONField(null=True, blank=True)
    blood_test_images = models.JSONField(null=True, blank=True)

    annual_vaccine_date = models.DateField(null=True, blank=True)
    other_vaccine_date = models.DateField(null=True, blank=True)

    # Relations
    owner_id = models.IntegerField(null=True, blank=True)
    vet_ids = models.JSONField(default=list)
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Pet"
        verbose_name_plural = "Pets"
        ordering = ['-created_at']

    def __str__(self):
        vet_name = self.vet.username if self.vet else "No Vet"
        return f"{self.name} — Owner: {self.owner.username} | Vet: {vet_name}"

