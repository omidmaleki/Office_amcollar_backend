# gyro/models.py
from django.db import models

class Gyro(models.Model):
    collar = models.ForeignKey('collar.Collar', on_delete=models.CASCADE, related_name='gyros')
    pet = models.ForeignKey('pet.Pet', on_delete=models.CASCADE, related_name='gyros')

    accel_x = models.FloatField()
    accel_y = models.FloatField()
    accel_z = models.FloatField()

    gyro_x = models.FloatField()
    gyro_y = models.FloatField()
    gyro_z = models.FloatField()

    timestamp = models.DateTimeField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Gyro Data at {self.timestamp or 'Unknown Time'}"
