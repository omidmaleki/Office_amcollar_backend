from django.db import models

# Create your models here.
class Owner(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=100)
    pet_ids = models.JSONField(default=list)

    class Meta:
        verbose_name = "Owner"
        verbose_name_plural = "Owners"

    def __str__(self):
        return self.name