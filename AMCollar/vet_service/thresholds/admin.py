from django.contrib import admin
from .models import Activity, ActivityHourly, Threshold

class ReadOnlyAdmin(admin.ModelAdmin):
    actions = None  # حذف bulk actions (مثل delete)

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

@admin.register(Activity)
class ActivityAdmin(ReadOnlyAdmin):
    list_display = (
        "id",
        "pet_id",
        "collar_id",
        "posture",
        "behavior",
        "activity_intensity",
        "calories",
        "timestamp",
    )

    list_filter = ("posture", "behavior")
    search_fields = ("pet_id", "collar_id")
    ordering = ("-timestamp",)

    list_per_page = 50
    date_hierarchy = "timestamp"
    show_full_result_count = False

@admin.register(ActivityHourly)
class ActivityHourlyAdmin(ReadOnlyAdmin):
    list_display = (
        "pet_id",
        "collar_id",
        "hour",
        "total_calories",
        "activity_seconds",
        "sleep_seconds",
    )

    list_filter = ("hour",)
    search_fields = ("pet_id",)
    ordering = ("-hour",)

    list_per_page = 50
    date_hierarchy = "hour"
    show_full_result_count = False

@admin.register(Threshold)
class ThresholdAdmin(ReadOnlyAdmin):
    list_display = (
        "pet_id",
        "heart_rate",
        "body_temperature",
        "hrv",
        "calories_consumed",
        "activity_amount",
        "sleep_amount",
        "updated_at",
    )

    search_fields = ("pet_id",)
    list_filter = ("updated_at",)
    ordering = ("-updated_at",)

    list_per_page = 25
    show_full_result_count = False