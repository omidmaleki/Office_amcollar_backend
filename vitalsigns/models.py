# vitalsigns/models.py
from django.db import models
from django.utils import timezone
from collar.models import Collar
from pet.models import Pet

class VitalSigns(models.Model):
    collar = models.ForeignKey(Collar, on_delete=models.SET_NULL, null=True, blank=True, related_name='vital_signs')
    pet = models.ForeignKey(Pet, on_delete=models.SET_NULL, null=True, blank=True, related_name='vital_signs')

    vs_ppg_red = models.JSONField(null=True, blank=True)
    vs_ppg_ir = models.JSONField(null=True, blank=True)
    vs_ppg_green = models.JSONField(null=True, blank=True)

    vs_heart_rate = models.FloatField()
    vs_spo2 = models.FloatField(null=True, blank=True)
    vs_rr_interval = models.FloatField(null=True, blank=True)
    vs_pulse_amplitude = models.FloatField(null=True, blank=True)
    vs_motion_artifact = models.BooleanField(default=False)
    vs_signal_quality = models.FloatField(null=True, blank=True)
    vs_respiration_rate = models.FloatField(null=True, blank=True)

    # فیلدهای جدید برای فشار خون
    vs_bp_sys = models.FloatField(null=True, blank=True, verbose_name="Systolic Blood Pressure")
    vs_bp_dia = models.FloatField(null=True, blank=True, verbose_name="Diastolic Blood Pressure")

    vs_timestamp = models.DateTimeField(null=True, blank=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"VitalSigns {self.vs_timestamp} - Pet: {self.pet} - Collar: {self.collar}"
