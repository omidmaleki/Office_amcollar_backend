# celery/tasks.py
from celery import shared_task
from django.utils import timezone
from django.db.models import Sum
from datetime import timedelta
from .models import Activity, ActivityHourly, Threshold

@shared_task
def aggregate_activity_hourly():
    now = timezone.now()

    window_start = now.replace(
        second=(now.second // 10) * 10,
        microsecond=0
    )
    window_end = window_start + timedelta(seconds=10)

    activities = Activity.objects.filter(
        timestamp__gte=window_start,
        timestamp__lt=window_end
    )

    pet_ids = activities.values_list("pet_id", flat=True).distinct()

    for pet_id in pet_ids:
        qs = activities.filter(pet_id=pet_id)
        collar_id = qs.first().collar_id if qs.exists() else None

        ActivityHourly.objects.update_or_create(
            pet_id=pet_id,
            hour=window_end,
            defaults={
                "collar_id": collar_id,
                "total_calories": qs.aggregate(Sum("calories"))["calories__sum"] or 0,
                "activity_seconds": qs.aggregate(Sum("activity_intensity"))["activity_intensity__sum"] or 0,
                "sleep_seconds": 0,
            }
        )



@shared_task
def update_threshold_daily():
    # day = timezone.now().date() - timedelta(days=1)
    day = timezone.now().date()

    pet_ids = ActivityHourly.objects.filter(
        hour__date=day
    ).values_list("pet_id", flat=True).distinct()

    for pet_id in pet_ids:
        qs = ActivityHourly.objects.filter(
            pet_id=pet_id,
            hour__date=day
        )

        agg = qs.aggregate(
            total_calories=Sum("total_calories"),
            activity_seconds=Sum("activity_seconds"),
            sleep_seconds=Sum("sleep_seconds")
        )

        Threshold.objects.update_or_create(
            pet_id=pet_id,
            defaults={
                "calories_consumed": agg["total_calories"] or 0,
                "activity_amount": (agg["activity_seconds"] or 0) / 60,
                "sleep_amount": (agg["sleep_seconds"] or 0) / 3600,
            }
        )
