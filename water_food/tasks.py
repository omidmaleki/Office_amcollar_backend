# water_food/tasks.py
from django.utils import timezone
from datetime import timedelta
from .models import WaterFoodRecord, WaterFoodContainer
from system_thresholds.utils import find_pet_category
from alerts.models import Alert

def aggregate_daily_water_food():
    now = timezone.now()
    yesterday = now - timedelta(days=1)

    containers = WaterFoodContainer.objects.all()

    for container in containers:
        records = WaterFoodRecord.objects.filter(container=container, timestamp__gte=yesterday, timestamp__lt=now)
        total_water = sum(r.water_weight_grams or 0 for r in records)
        total_food = sum(r.food_weight_grams or 0 for r in records)

        aggregated_record = WaterFoodRecord.objects.create(
            container=container,
            timestamp=now,
            water_weight_grams=total_water,
            food_weight_grams=total_food,
            is_aggregated=True,  # <--- مهم
        )

        pet = container.pet
        category = find_pet_category(pet)
        if not category:
            continue
        thresholds = category.thresholds.first()
        if not thresholds:
            continue

        alert_messages = []
        if total_water < thresholds.daily_water_ml:
            alert_messages.append(f"مصرف آب کمتر از حد استاندارد است: {total_water}g")
        if total_food < thresholds.daily_food_grams:
            alert_messages.append(f"مصرف غذا کمتر از حد استاندارد است: {total_food}g")

        if alert_messages:
            Alert.objects.create(
                pet=pet,
                collar=container.collar,
                alert_type=Alert.AlertType.FOOD_WATER,
                alert_level=Alert.AlertLevel.WARNING,
                alert_message="؛ ".join(alert_messages),
                alert_timestamp=timezone.now(),
                related_object=aggregated_record,
            )
