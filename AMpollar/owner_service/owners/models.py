from django.db import models

# Create your models here.
class Owner(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    pet_ids = models.JSONField(default=list)