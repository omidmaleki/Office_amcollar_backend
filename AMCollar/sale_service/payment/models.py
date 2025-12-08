from django.db import models

class Payment(models.Model):
    owner_id = models.IntegerField()
    collar_id = models.IntegerField()
    vet_id = models.IntegerField(null=True, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default="pending")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} - {self.status}"
