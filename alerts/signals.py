# alerts/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Alert
from notifications.models import Notification
from users.models import User

@receiver(post_save, sender=Alert)
def create_notification_for_alert(sender, instance, created, **kwargs):
    if created:
        print(f"Alert created: {instance}")
        user = instance.pet.owner if instance.pet else None
        if user:
            Notification.objects.create(
                user=user,
                pet=instance.pet,
                collar=instance.collar,
                title=f"{instance.get_alert_level_display()} هشدار: {instance.get_alert_type_display()}",
                message=instance.alert_message,
                type="system"
            )
