from django.contrib import admin
from .models import Activity


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