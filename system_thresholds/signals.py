# system_thresholds/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from pet.models import Pet
from .utils import calculate_thresholds_for_pet

@receiver(post_save, sender=Pet)
def update_system_threshold(sender, instance, created, **kwargs):
    if instance.weight_kg:
        calculate_thresholds_for_pet(instance)
