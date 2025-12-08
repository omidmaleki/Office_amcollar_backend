from django.db import models

# Create your models here.
class Order(models.Model):
    user_id = models.IntegerField()
    product_id = models.IntegerField()
    vet_id = models.IntegerField()
    collar_id = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - User {self.user_id}"