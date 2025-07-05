# water_food/models.py
from django.db import models
from collar.models import Collar
from pet.models import Pet
from alerts.models import Alert
from django.utils import timezone

class WaterFoodContainer(models.Model):
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='water_food_containers')
    collar = models.ForeignKey(Collar, on_delete=models.SET_NULL, null=True, blank=True, related_name='water_food_containers')
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Container for {self.pet.name}"

class WaterFoodRecord(models.Model):
    container = models.ForeignKey(WaterFoodContainer, on_delete=models.CASCADE, related_name='records')
    timestamp = models.DateTimeField(default=timezone.now)

    water_weight_grams = models.FloatField(null=True, blank=True)
    food_weight_grams = models.FloatField(null=True, blank=True)

    is_aggregated = models.BooleanField(default=False)  # <--- اضافه شد

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp} - {self.container.pet.name}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.is_aggregated:
            # هشدار برای رکوردهای تجمیعی را اینجا ایجاد نمی‌کنیم
            return

        from system_thresholds.utils import find_pet_category

        pet = self.container.pet
        category = find_pet_category(pet)
        if not category:
            return

        thresholds = category.thresholds.first()
        if not thresholds:
            return

        alert_messages = []

        if self.water_weight_grams is not None and self.water_weight_grams < thresholds.daily_water_ml:
            alert_messages.append(f"مصرف آب کمتر از حد استاندارد است: {self.water_weight_grams}g")

        if self.food_weight_grams is not None and self.food_weight_grams < thresholds.daily_food_grams:
            alert_messages.append(f"مصرف غذا کمتر از حد استاندارد است: {self.food_weight_grams}g")

        if alert_messages:
            Alert.objects.create(
                pet=pet,
                collar=self.container.collar,
                alert_type=Alert.AlertType.FOOD_WATER,
                alert_level=Alert.AlertLevel.WARNING,
                alert_message="؛ ".join(alert_messages),
                alert_timestamp=timezone.now(),
                related_object=self
            )
