from django.db import models

class Pet(models.Model):
    name = models.CharField(max_length=100)
    owner_id = models.IntegerField(null=True, blank=True)
    vet_id = models.IntegerField(null=True, blank=True)
    collar_id = models.IntegerField(null=True, blank=True)

    species = models.CharField(
        max_length=100,
        choices=(("cat", "cat"), ("dog", "dog"))
                               )
    age = models.IntegerField(null=True, blank=True)
    sex = models.CharField(
        max_length=10,
        choices=(("male", "Male"), ("female", "Female"))
    )
    race = models.CharField(max_length=100, null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    neutered = models.BooleanField(default=False)

    surgery_history = models.TextField(null=True, blank=True)

    radiography_images = models.JSONField(default=list, blank=True)
    test_reports = models.JSONField(default=list, blank=True)

    annual_vaccine_date = models.DateField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
