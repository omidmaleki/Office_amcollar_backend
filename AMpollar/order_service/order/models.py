from email.policy import default

from django.db import models

class Order(models.Model):
    user_id = models.IntegerField(null=True, blank=True)
    collar_id = models.IntegerField(default=1, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2,null=True, blank=True)
    payment_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
