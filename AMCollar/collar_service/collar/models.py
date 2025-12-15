from django.db import models

class Collar(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=15, decimal_places=2)
    image = models.ImageField(upload_to="images/", null=True, blank=True)

    color_product = models.CharField(
        max_length=100,
        choices=(("1", "1"), ("2", "2"), ("3", "3"), ("4", "4"))
    )

    color_container = models.CharField(
        max_length=100,
        choices=(("1", "1"), ("2", "2"), ("3", "3"), ("4", "4"))
    )

    size = models.CharField(
        max_length=20,
        choices=(("small", "small"), ("medium", "medium"), ("large", "large"))
    )

    mac_address = models.CharField(
        max_length=17,           # AA:BB:CC:DD:EE:FF
        unique=True,
        db_index=True
    )

    owner_id = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class WifiCollarStatus(models.Model):
    owner_id = models.IntegerField(default=0)
    ssid = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
