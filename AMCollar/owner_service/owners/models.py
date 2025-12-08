from django.db import models

# Create your models here.
class Owner(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=100, null=True, blank=True)

    pet_ids = models.JSONField(default=list)
    collar_ids = models.JSONField(default=dict, null=True, blank=True)

    vet_id = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = "Owner"
        verbose_name_plural = "Owners"

    def __str__(self):
        return self.name
