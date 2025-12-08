from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Payment
from order.models import Order

@receiver(post_save, sender=Payment)
def create_order_after_payment(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'order'):
        Order.objects.create(
            owner_id=instance.owner_id,
            collar_id=instance.collar_id,
            vet_id=instance.vet_id,
            pet_id=None,
            amount=instance.amount,
            payment=instance,
            status="paid"
        )
