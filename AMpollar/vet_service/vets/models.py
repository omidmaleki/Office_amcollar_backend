from random import choices

from django.db import models


class VetForm(models.Model):
    owner_id = models.IntegerField()
    pet_id = models.IntegerField()
    purchase_id = models.IntegerField()
    status = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"VetForm #{self.id} for Owner {self.owner_id}"


class Vet(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    address = models.TextField()
    pets = models.JSONField(default=list, blank=True)
    collars = models.JSONField(default=list, blank=True)
    activated = models.BooleanField(default=True)
    vet_license_number = models.CharField(max_length=100)
    rank = models.CharField(max_length=50, choices=(("star", "star"), ("elite", "elite")))
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.vet_license_number})"