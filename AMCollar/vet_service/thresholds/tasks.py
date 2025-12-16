# celery/tasks.py
from celery import shared_task
from django.utils import timezone
from django.db.models import Sum
from datetime import timedelta
from .models import Activity, ActivityHourly, Threshold

@shared_task
def aggregate_activity_hourly():
    # now = timezone.now()
    # hour_start = now.replace(minute=0, second=0, microsecond=0)
    # hour_end = hour_start + timedelta(hours=1)
    #
    # activities = Activity.objects.filter(
    #     timestamp__gte=hour_start,
    #     timestamp__lt=hour_end
    # )

    now = timezone.now()
    window_start = now.replace(microsecond=0)
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
                "activity_seconds": qs.aggregate(Sum("activity_time_sec"))["activity_time_sec__sum"] or 0,
                "sleep_seconds": qs.aggregate(Sum("sleep_time_sec"))["sleep_time_sec__sum"] or 0,
            }
        )


@shared_task
def update_threshold_daily(pet_id):
    today = timezone.now().date()

    qs = ActivityHourly.objects.filter(
        pet_id=pet_id,
        hour__date=today
    )

    Threshold.objects.update_or_create(
        pet_id=pet_id,
        defaults={
            "calories_consumed": qs.aggregate(Sum("total_calories"))["total_calories__sum"] or 0,
            "activity_amount": (qs.aggregate(Sum("activity_seconds"))["activity_seconds__sum"] or 0) / 60,
            "sleep_amount": (qs.aggregate(Sum("sleep_seconds"))["sleep_seconds__sum"] or 0) / 3600,
        }
    )
