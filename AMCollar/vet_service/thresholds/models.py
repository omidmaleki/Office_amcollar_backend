from django.db import models


# -------------------------------
#        Threshold Model
# -------------------------------
class Threshold(models.Model):
    pet_id = models.IntegerField(unique=True, db_index=True)

    # --- Heart Rate ---
    heart_rate = models.FloatField(default=70, blank=True, null=True)
    heart_rate_min = models.FloatField(null=True, blank=True)
    heart_rate_max = models.FloatField(null=True, blank=True)

    # --- Body Temperature ---
    body_temperature = models.FloatField(default=37, blank=True, null=True)
    temperature_min = models.FloatField(null=True, blank=True)
    temperature_max = models.FloatField(null=True, blank=True)

    # --- HRV ---
    hrv = models.FloatField(default=50, blank=True, null=True)


    # --- Respiratory Rate ---
    respiratory_rate = models.FloatField(default=20, blank=True, null=True)


    # --- Oxygen Saturation ---
    oxygen_saturation = models.FloatField(default=95, blank=True, null=True)


    # --- Calories & Activity ---
    calories_consumed = models.FloatField(default=0, blank=True, null=True)


    sleep_amount = models.FloatField(default=8, blank=True, null=True)


    activity_amount = models.FloatField(default=60, blank=True, null=True)


    # --- Water & Food ---
    water_consumption = models.FloatField(default=1.5, blank=True, null=True)


    food_consumption = models.FloatField(default=300, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Threshold for pet {self.pet_id}"


# -------------------------------
#        Radiography Model
# -------------------------------
class RadiographyImage(models.Model):
    pet_id = models.IntegerField()
    image = models.ImageField(upload_to="radiography/")
    description = models.TextField(blank=True, null=True)
    taken_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Radiography {self.id} for pet {self.pet_id}"


# -------------------------------
#        Test Report Model
# -------------------------------
class TestReport(models.Model):
    pet_id = models.IntegerField()

    test_name = models.CharField(max_length=255)
    result_text = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="test_reports/", null=True, blank=True)
    taken_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Test Report: {self.test_name} for pet {self.pet_id}"


# -------------------------------
#        Surgery History Model
# -------------------------------
class SurgeryHistory(models.Model):
    pet_id = models.IntegerField()

    surgery_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    performed_at = models.DateTimeField()

    document = models.FileField(upload_to="surgery_documents/", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Surgery {self.surgery_name} for pet {self.pet_id}"

class Activity(models.Model):
    pet_id = models.IntegerField(db_index=True)
    collar_id = models.IntegerField(db_index=True)

    posture = models.CharField(max_length=20)
    behavior = models.CharField(max_length=30)

    activity_intensity = models.FloatField()
    calories = models.FloatField()

    sleep_time_sec = models.IntegerField(default=0, null=True, blank=True)
    activity_time_sec = models.IntegerField(default=0, null=True, blank=True)

    timestamp = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)


class ActivityHourly(models.Model):
    pet_id = models.IntegerField(db_index=True)
    collar_id = models.IntegerField(db_index=True)

    hour = models.DateTimeField(db_index=True)  # مثلا 2025-12-16 10:00

    total_calories = models.FloatField(default=0)
    activity_seconds = models.IntegerField(default=0)
    sleep_seconds = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("pet_id", "hour")


class PPGReading(models.Model):
    pet_id = models.IntegerField(db_index=True)
    collar_id = models.IntegerField(db_index=True)

    spo2 = models.FloatField(null=True, blank=True)
    hrv = models.FloatField(null=True, blank=True)
    heart_rate = models.FloatField(null=True, blank=True)

    timestamp = models.DateTimeField(db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["pet_id", "collar_id", "timestamp"]),
        ]
