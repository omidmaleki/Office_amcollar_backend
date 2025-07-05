# stress_pain/models.py
from django.db import models
from pet.models import Pet
from collar.models import Collar
from django.utils import timezone
from alerts.models import Alert
from django.contrib.contenttypes.models import ContentType

class StressPainRecord(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='stress_pain_records')
    collar = models.ForeignKey(Collar, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='stress_pain_records')
    timestamp = models.DateTimeField()

    # داده های حیاتی از PPG و سایر سنسورها
    heart_rate = models.FloatField(null=True, blank=True)
    hrv = models.FloatField(null=True, blank=True)  # Heart Rate Variability (مهم برای استرس)
    spo2 = models.FloatField(null=True, blank=True)  # میزان اکسیژن خون

    # داده دمایی
    body_temperature_celsius = models.FloatField(null=True, blank=True)

    # داده های حرکتی
    acceleration_x = models.FloatField(null=True, blank=True)
    acceleration_y = models.FloatField(null=True, blank=True)
    acceleration_z = models.FloatField(null=True, blank=True)

    gyro_x = models.FloatField(null=True, blank=True)
    gyro_y = models.FloatField(null=True, blank=True)
    gyro_z = models.FloatField(null=True, blank=True)

    # سرعت حرکت از GPS (یا ترکیبی از GPS و شتاب‌سنج)
    speed_kmh = models.FloatField(null=True, blank=True)

    # حالت یا نتیجه تشخیص (مثلا استرس، درد، یا طبیعی)
    stress_level = models.CharField(
        max_length=20,
        choices=[
            ('normal', 'Normal'),
            ('low', 'Low Stress'),
            ('medium', 'Medium Stress'),
            ('high', 'High Stress'),
            ('pain', 'Pain Detected'),
        ],
        default='normal'
    )

    notes = models.TextField(null=True, blank=True)  # یادداشت یا جزئیات بیشتر (اختیاری)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"StressPainRecord for {self.pet.name} at {self.timestamp} - Stress: {self.stress_level}"

    def save(self, *args, **kwargs):
        # ابتدا رکورد ذخیره می‌شود (برای اینکه id داشته باشد)
        super().save(*args, **kwargs)

        # ساخت هشدار در صورت استرس یا درد بالا
        if self.stress_level in ['high', 'pain']:
            # بررسی اینکه هشدار قبلاً برای همین رکورد ساخته نشده باشد
            alert_exists = Alert.objects.filter(
                related_object_type=ContentType.objects.get_for_model(self),
                related_object_id=self.id,
                alert_level=Alert.AlertLevel.CRITICAL if self.stress_level == 'pain' else Alert.AlertLevel.WARNING
            ).exists()

            if not alert_exists:
                alert_message = f"تشخیص {self.get_stress_level_display()} برای حیوان {self.pet.name} در زمان {self.timestamp}"
                Alert.objects.create(
                    pet=self.pet,
                    collar=self.collar,
                    alert_type=Alert.AlertType.OTHER,
                    alert_level=Alert.AlertLevel.CRITICAL if self.stress_level == 'pain' else Alert.AlertLevel.WARNING,
                    alert_message=alert_message,
                    alert_timestamp=timezone.now(),
                    related_object=self,
                )
