from django.db import models

class Payment(models.Model):
    user_id = models.IntegerField()
    product_id = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")
    transaction_id = models.CharField(max_length=100, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)
