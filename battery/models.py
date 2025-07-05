# battery/models.py
from django.db import models
from django.utils import timezone

class Battery(models.Model):
    collar = models.ForeignKey('collar.Collar', on_delete=models.CASCADE, related_name='batteries')
    battery_serial = models.CharField(max_length=100, unique=True, null=True, blank=True)
    capacity_mah = models.IntegerField(null=True, blank=True)
    voltage = models.FloatField(null=True, blank=True)

    battery_level = models.PositiveSmallIntegerField()  # 0 تا 100 درصد
    battery_timestamp = models.DateTimeField(null=True, blank=True)

    installed_date = models.DateTimeField(null=True, blank=True)
    replaced_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Battery {self.battery_serial or 'No Serial'} - Level: {self.battery_level}%"
