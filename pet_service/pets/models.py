from django.db import models

class Pet(models.Model):
    name = models.CharField(max_length=100)
    owner_id = models.IntegerField(default=0,null=True, blank=True)
    vet_id = models.IntegerField(default=0,null=True, blank=True)
    collar_id = models.IntegerField(default=0,null=True, blank=True)

    species = models.CharField(
        max_length=100,
        choices=(("cat", "cat"), ("dog", "dog"))
                               )
    age = models.IntegerField(null=True, blank=True)
    sex = models.CharField(
        max_length=10,
        choices=(("male", "Male"), ("female", "Female"))
    )
    pet_image = models.ImageField(null=True, blank=True)
    race = models.CharField(max_length=100, null=True, blank=True)
    weight = models.FloatField(null=True, blank=True, default=5)
    neutered = models.BooleanField(default=False)

    surgery_history = models.DateField(null=True, blank=True, default=None)

    radiography_images = models.JSONField(default=list, blank=True)
    test_reports = models.JSONField(default=list, blank=True)

    annual_vaccine_date = models.DateField(null=True, blank=True, default=None)

    created_at = models.DateTimeField(auto_now_add=True)
