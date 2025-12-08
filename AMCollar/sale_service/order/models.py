from django.db import models
from payment.models import Payment

class Order(models.Model):
    owner_id = models.IntegerField()
    pet_id = models.IntegerField(null=True, blank=True)
    collar_id = models.IntegerField()
    vet_id = models.IntegerField(null=True, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=20, default="pending")

    payment = models.OneToOneField(
        Payment, on_delete=models.CASCADE, related_name="order", null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.status}"
