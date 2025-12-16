# thresholds/views.py
from rest_framework.viewsets import ModelViewSet
from .models import Threshold, RadiographyImage, TestReport, SurgeryHistory, Activity
from .serializers import (
    ThresholdSerializer,
    RadiographySerializer,
    TestReportSerializer,
    SurgeryHistorySerializer
)
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

from django.conf import settings
from datetime import datetime, timezone as dt_timezone

from .models import Activity


COLLAR_SERVICE = "http://collar:8000/collars/by-mac/"

@api_view(["POST"])
def ingest_gyro(request):
    mac = request.data.get("mac_address")
    metrics = request.data.get("metrics")
    timestamp_ms = request.data.get("timestamp")

    if not mac or not metrics or not isinstance(timestamp_ms, int):
        return Response({"error": "invalid payload"}, status=400)

    if not settings.COLLAR_SERVICE:
        return Response({"error": "COLLAR_SERVICE not configured"}, status=500)

    # 1️⃣ Resolve collar by MAC
    collar_res = requests.get(
        f"{settings.COLLAR_SERVICE}/collars/by-mac/{mac}/",
        timeout=3
    )

    if collar_res.status_code != 200:
        return Response({"error": "collar not found"}, status=404)

    collar_data = collar_res.json()
    collar_id = collar_data["id"]
    pet_id = collar_data["pet_id"]

    # ✅ تبدیل timestamp (ms) به datetime آگاه (UTC)
    timestamp_dt = datetime.fromtimestamp(
        timestamp_ms / 1000,
        tz=dt_timezone.utc
    )

    # 2️⃣ ذخیره Activity
    Activity.objects.create(
        pet_id=pet_id,
        collar_id=collar_id,
        posture=metrics.get("posture"),
        behavior=metrics.get("behavior"),
        activity_intensity=metrics.get("activity_intensity"),
        calories=metrics.get("calories"),
        sleep_time_sec=metrics.get("sleep_time_sec"),
        activity_time_sec=metrics.get("activity_time_sec"),
        timestamp=timestamp_dt,
    )

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
