# alerts/models.py
from django.db import models
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import uuid

class Alert(models.Model):
    class AlertType(models.TextChoices):
        VITAL_SIGNS = "vital_signs", "Vital Signs"
        GEOFENCE = "geofence", "Geofence"
        BATTERY = "battery_low", "Battery Low"
        MANUAL = "manual_alert", "Manual Alert"
        OTHER = "other", "Other"
        FOOD_WATER = "food_water", "Food & Water"

    class AlertLevel(models.TextChoices):
        INFO = "info", "Info"
        WARNING = "warning", "Warning"
        CRITICAL = "critical", "Critical"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    pet = models.ForeignKey("pet.Pet", on_delete=models.CASCADE, related_name="alerts")
    collar = models.ForeignKey("collar.Collar", on_delete=models.SET_NULL, null=True, blank=True, related_name="alerts")

    alert_type = models.CharField(max_length=20, choices=AlertType.choices)
    alert_level = models.CharField(max_length=20, choices=AlertLevel.choices)
    alert_message = models.TextField()

    alert_timestamp = models.DateTimeField()

    alert_resolved = models.BooleanField(default=False)
    alert_resolved_timestamp = models.DateTimeField(null=True, blank=True)

    related_object_type = models.ForeignKey(ContentType, on_delete=models.SET_NULL, null=True, blank=True)
    related_object_id = models.PositiveIntegerField(null=True, blank=True)
    related_object = GenericForeignKey('related_object_type', 'related_object_id')

    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.alert_type} | {self.alert_level} | Pet: {self.pet.name}"
