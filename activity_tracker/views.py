# activity_tracker/views.py
from rest_framework import generics, permissions
from .models import ActivityRecord
from .serializers import ActivityRecordSerializer
from system_thresholds.models import SystemThreshold
from alerts.models import Alert
from django.utils import timezone

class ActivityRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = ActivityRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'owner':
            return ActivityRecord.objects.filter(pet__owner=user)
        elif user.role == 'vet':
            return ActivityRecord.objects.filter(pet__vet=user)
        return ActivityRecord.objects.none()

    def perform_create(self, serializer):
        activity_record = serializer.save()

        pet = activity_record.pet
        calories_burned = activity_record.calories_burned

        try:
            category = pet.category  # مطمئن شو مدل Pet فیلد category داره
            system_threshold = SystemThreshold.objects.get(category=category)
        except SystemThreshold.DoesNotExist:
            system_threshold = None

        if system_threshold and calories_burned is not None:
            daily_calories_ref = system_threshold.daily_calories

            if calories_burned < daily_calories_ref * 0.8:
                alert_message = f"کالری سوزانده شده کمتر از حد انتظار است: {calories_burned} کیلوکالری (مرجع: {daily_calories_ref})"
                Alert.objects.create(
                    pet=pet,
                    collar=activity_record.collar,
                    alert_type=Alert.AlertType.OTHER,
                    alert_level=Alert.AlertLevel.WARNING,
                    alert_message=alert_message,
                    alert_timestamp=timezone.now(),
                    related_object=activity_record,
                )
            elif calories_burned > daily_calories_ref * 1.2:
                alert_message = f"کالری سوزانده شده بالاتر از حد انتظار است: {calories_burned} کیلوکالری (مرجع: {daily_calories_ref})"
                Alert.objects.create(
                    pet=pet,
                    collar=activity_record.collar,
                    alert_type=Alert.AlertType.OTHER,
                    alert_level=Alert.AlertLevel.INFO,
                    alert_message=alert_message,
                    alert_timestamp=timezone.now(),
                    related_object=activity_record,
                )

class ActivityRecordRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ActivityRecord.objects.all()
    serializer_class = ActivityRecordSerializer
    permission_classes = [permissions.IsAuthenticated]