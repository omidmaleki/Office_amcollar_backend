from random import choices
from datetime import datetime
from django.db import models
import os



class Vet(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=50)
    address = models.TextField()
    pets = models.JSONField(default=list, blank=True)
    collars = models.JSONField(default=list, blank=True)
    activated = models.BooleanField(default=True)
    vet_license_number = models.CharField(max_length=100)
    rank = models.CharField(max_length=50, choices=(("star", "star"), ("elite", "elite")), default="star")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.vet_license_number})"


class VetForm(models.Model):
    vet_id = models.ForeignKey(Vet, on_delete=models.CASCADE)

    # For identifying records
    owner_id = models.IntegerField()
    pet_id = models.IntegerField()
    purchase_id = models.IntegerField()

    # Pet Info stored locally
    pet_name = models.CharField(max_length=255, null=True, blank=True)
    pet_age = models.IntegerField(null=True, blank=True)
    pet_race = models.CharField(max_length=255, null=True, blank=True)
    pet_image = models.TextField(null=True, blank=True)

    # Threshold data
    body_temperature = models.FloatField(null=True, blank=True)
    hrv = models.FloatField(null=True, blank=True)

    status = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



def owner_directory_path(instance, filename):
    """
    مسیر فایل با نام صاحب و تاریخ
    """
    if not instance.owner_name:
        instance.owner_name = "unknown_owner"
    owner_name = instance.owner_name.replace(" ", "_")
    date_path = datetime.now().strftime("%Y/%m/%d")
    return os.path.join(owner_name, date_path, filename)


class VetInfoMedical(models.Model):
    vet_form_id = models.ForeignKey(VetForm, on_delete=models.CASCADE, default=1)
    pet_id = models.IntegerField()
    owner_id = models.IntegerField()
    owner_name = models.CharField(max_length=255)

    radiography = models.ImageField(upload_to=owner_directory_path, null=True, blank=True)
    test = models.ImageField(upload_to=owner_directory_path, null=True, blank=True)
    surgical_records = models.ImageField(upload_to=owner_directory_path, null=True, blank=True)

    possible_risks = models.TextField(null=True, blank=True)
    possible_diseases = models.TextField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Medical Record for Owner {self.owner_name} (Pet {self.pet_id})"

