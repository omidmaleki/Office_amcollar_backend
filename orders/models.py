# orders/models.py
from django.db import models
from django.conf import settings
from collar.models import Collar

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'در انتظار پرداخت'),
        ('paid', 'پرداخت شده'),
        ('cancelled', 'لغو شده'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders'
    )

    vet = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='vet_orders'
    )

    collar = models.ForeignKey(
        Collar,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )

    customer_mobile = models.CharField(max_length=11)
    pet_name = models.CharField(max_length=50)

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Order #{self.id} - {self.owner.username}"
