from django.contrib import admin
from .models import Activity, ActivityHourly


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pet_id",
        "collar_id",
        "posture",
        "behavior",
        "activity_intensity",
        "calories",
        "timestamp",
        "created_at",
    )

    list_filter = ("posture", "behavior", "created_at")
    search_fields = ("pet_id", "collar_id")
    ordering = ("-timestamp",)

@admin.register(ActivityHourly)
class ActivityHourlyAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "pet_id",
        "collar_id",
        "hour",
        "total_calories",
        "activity_seconds",
        "sleep_seconds",
        "created_at",
    )
    list_filter = ("hour", "created_at")
    search_fields = ("pet_id", "collar_id")
    ordering = ("-hour",)