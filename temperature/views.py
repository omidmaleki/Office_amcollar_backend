# Temperature/views.py
from rest_framework import generics, permissions
from .models import Temperature
from .serializers import TemperatureSerializer

from vet_thresholds.models import VetThreshold
from alerts.models import Alert
from django.utils import timezone


class TemperatureCreateView(generics.CreateAPIView):
    queryset = Temperature.objects.all()
    serializer_class = TemperatureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        temp_instance = serializer.save()
        pet = temp_instance.pet
        collar = temp_instance.collar
        user = self.request.user

        # تلاش برای گرفتن بازه‌های دامپزشک برای این پت و قلاده
        try:
            threshold = VetThreshold.objects.get(vet=user, pet=pet, collar=collar)
        except VetThreshold.DoesNotExist:
            # اگر پیدا نشد، هشدار نده و ادامه بده
            return

        temp = temp_instance.temp_value

        # چک کردن بازه دما
        if temp < threshold.temp_min or temp > threshold.temp_max:
            alert_message = f"دمای بدن خارج از محدوده مجاز است: {temp} درجه سانتی‌گراد"
            Alert.objects.create(
                pet=pet,
                collar=collar,
                alert_type=Alert.AlertType.VITAL_SIGNS,
                alert_level=Alert.AlertLevel.CRITICAL,
                alert_message=alert_message,
                alert_timestamp=timezone.now(),
                related_object=temp_instance,
            )

class TemperatureListView(generics.ListAPIView):
    queryset = Temperature.objects.all()
    serializer_class = TemperatureSerializer
    permission_classes = [permissions.IsAuthenticated]
