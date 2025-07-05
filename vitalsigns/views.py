# vitalsigns/views.py
from rest_framework import generics, permissions
from .models import VitalSigns
from .serializers import VitalSignsSerializer

from vet_thresholds.models import VetThreshold
from alerts.models import Alert
from django.utils import timezone


class VitalSignsListCreateView(generics.ListCreateAPIView):
    queryset = VitalSigns.objects.all()
    serializer_class = VitalSignsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        vs_instance = serializer.save()
        pet = vs_instance.pet
        collar = vs_instance.collar
        user = self.request.user

        try:
            threshold = VetThreshold.objects.get(vet=user, pet=pet, collar=collar)
        except VetThreshold.DoesNotExist:
            return

        hr   = vs_instance.vs_heart_rate
        spo2 = vs_instance.vs_spo2
        hrv  = vs_instance.vs_rr_interval
        bp_sys = getattr(vs_instance, 'vs_bp_sys', None)
        bp_dia = getattr(vs_instance, 'vs_bp_dia', None)

        alert_messages = []

        if hr < threshold.hr_min or hr > threshold.hr_max:
            alert_messages.append(f"ضربان قلب خارج از محدوده مجاز است: {hr} bpm")

        if spo2 is not None and (threshold.spo2_min is not None and threshold.spo2_max is not None):
            if spo2 < threshold.spo2_min or spo2 > threshold.spo2_max:
                alert_messages.append(f"سطح اکسیژن خون خارج از محدوده مجاز است: {spo2}%")

        if hrv is not None and (threshold.hrv_min is not None and threshold.hrv_max is not None):
            if hrv < threshold.hrv_min or hrv > threshold.hrv_max:
                alert_messages.append(f"مقدار HRV خارج از محدوده مجاز است: {hrv} ms")

        if bp_sys is not None and (threshold.bp_sys_min is not None and threshold.bp_sys_max is not None):
            if bp_sys < threshold.bp_sys_min or bp_sys > threshold.bp_sys_max:
                alert_messages.append(f"فشار خون سیستولیک خارج از محدوده مجاز است: {bp_sys} mmHg")

        if bp_dia is not None and (threshold.bp_dia_min is not None and threshold.bp_dia_max is not None):
            if bp_dia < threshold.bp_dia_min or bp_dia > threshold.bp_dia_max:
                alert_messages.append(f"فشار خون دیاستولیک خارج از محدوده مجاز است: {bp_dia} mmHg")

        if alert_messages:
            Alert.objects.create(
                pet=pet,
                collar=collar,
                alert_type=Alert.AlertType.VITAL_SIGNS,
                alert_level=Alert.AlertLevel.CRITICAL,
                alert_message="; ".join(alert_messages),
                alert_timestamp=timezone.now(),
                related_object=vs_instance,
            )
