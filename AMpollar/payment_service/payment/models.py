from django.db import models

class Payment(models.Model):
    owner_id = models.IntegerField(default=0)
    collar_id = models.IntegerField(null=True, blank=True)
    vet_id = models.IntegerField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")
    transaction_id = models.CharField(max_length=100, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
