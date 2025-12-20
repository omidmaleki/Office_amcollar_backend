# thresholds/views.py
from rest_framework.viewsets import ModelViewSet
from .models import Threshold, RadiographyImage, TestReport, SurgeryHistory, Activity
from .realtime import send_activity_update_to_frontend
from .serializers import (
    ThresholdSerializer,
    RadiographySerializer,
    TestReportSerializer,
    SurgeryHistorySerializer
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime, timezone as dt_timezone
from .models import Activity, PPGReading


@api_view(["POST"])
def ingest_gyro(request):
    mac = request.data.get("mac_address")
    metrics = request.data.get("metrics")
    timestamp_ms = request.data.get("timestamp")
    pet_id = request.data.get("pet_id")
    collar_id = request.data.get("collar_id")

    if not all([mac, metrics, pet_id, collar_id]) or not isinstance(timestamp_ms, int):
        return Response({"error": "invalid payload"}, status=400)

    timestamp_dt = datetime.fromtimestamp(
        timestamp_ms / 1000,
        tz=dt_timezone.utc
    )

    posture = metrics.get("posture", "unknown")
    behavior = metrics.get("behavior", "unknown")
    activity_intensity = metrics.get("activity_count", 0)
    calories = metrics.get("calories", 0)

    # -------- بررسی تغییرات --------
    activity, created = Activity.objects.get_or_create(
        pet_id=pet_id,
        collar_id=collar_id,
        defaults={
            "posture": posture,
            "behavior": behavior,
            "activity_intensity": activity_intensity,
            "calories": calories,
            "timestamp": timestamp_dt,
        }
    )

    changed = False
    if not created:
        fields_to_update = {}
        if activity.posture != posture:
            fields_to_update["posture"] = posture
            changed = True
        if activity.behavior != behavior:
            fields_to_update["behavior"] = behavior
            changed = True
        # اگر خواستی activity_intensity و calories هم چک کنی، اضافه کن
        fields_to_update["activity_intensity"] = activity_intensity
        fields_to_update["calories"] = calories
        fields_to_update["timestamp"] = timestamp_dt

        if changed or fields_to_update:
            for k, v in fields_to_update.items():
                setattr(activity, k, v)
            activity.save(update_fields=fields_to_update.keys())

    # -------- ارسال به فرانت اگر تغییر کرده --------
    if changed or created:
        send_activity_update_to_frontend(activity)

    return Response({"status": "ok"})

@api_view(["POST"])
def ingest_ppg(request):
    pet_id = request.data.get("pet_id")
    collar_id = request.data.get("collar_id")
    hr = request.data.get("hr")
    spo2 = request.data.get("spo2")
    hrv = request.data.get("hrv")
    timestamp_ms = request.data.get("timestamp")

    if not pet_id or not collar_id or not isinstance(timestamp_ms, int):
        return Response({"error": "invalid payload"}, status=400)

    timestamp_dt = datetime.fromtimestamp(
        timestamp_ms / 1000,
        tz=dt_timezone.utc
    )

    # ---------- 1. SAVE READING (HISTORY) ----------
    PPGReading.objects.create(
        pet_id=pet_id,
        collar_id=collar_id,
        heart_rate=hr,
        spo2=spo2,
        hrv=hrv,
        timestamp=timestamp_dt
    )

    # ---------- 2. UPDATE THRESHOLD ----------
    threshold, _ = Threshold.objects.get_or_create(pet_id=pet_id)

    updated_fields = []

    if hr is not None:
        threshold.heart_rate = hr
        updated_fields.append("heart_rate")

    if spo2 is not None:
        threshold.oxygen_saturation = spo2
        updated_fields.append("oxygen_saturation")

    if hrv is not None:
        threshold.hrv = hrv
        updated_fields.append("hrv")

    if updated_fields:
        threshold.updated_at = timestamp_dt
        threshold.save(update_fields=updated_fields + ["updated_at"])

    return Response({"status": "ok"})


class PetFilterViewSet(ModelViewSet):
    """Base class to filter by pet_id automatically"""
    def get_queryset(self):
        qs = super().get_queryset()
        pet_id = self.request.query_params.get("pet_id")
        if pet_id:
            qs = qs.filter(pet_id=pet_id)
        return qs


class ThresholdViewSet(PetFilterViewSet):
    queryset = Threshold.objects.all()
    serializer_class = ThresholdSerializer


class RadiographyViewSet(PetFilterViewSet):
    queryset = RadiographyImage.objects.all()
    serializer_class = RadiographySerializer


class TestReportViewSet(PetFilterViewSet):
    queryset = TestReport.objects.all()
    serializer_class = TestReportSerializer


class SurgeryHistoryViewSet(PetFilterViewSet):
    queryset = SurgeryHistory.objects.all()
    serializer_class = SurgeryHistorySerializer
