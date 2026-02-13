from random import choices

from django.db import models

# Create your models here.
class Product(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=15, decimal_places=2)
    image = models.ImageField(upload_to="images/")

    color_product = models.CharField(
        max_length=100,
        choices= (("1", "1"), ("2", "2"), ("3", "3"), ("4", "4"))
                                     )

    color_container = models.CharField(
        max_length=100,
        choices= (("1", "1"), ("2", "2"), ("3", "3"), ("4", "4"))
                                     )

    size = models.CharField(choices= (("small", "small"), ("medium", "medium"), ("large", "large")))
    owner_id = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
