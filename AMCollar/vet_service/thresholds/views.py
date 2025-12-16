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

    Activity.objects.create(
        pet_id=pet_id,
        collar_id=collar_id,
        posture=metrics.get("posture", "unknown"),
        behavior=metrics.get("behavior", "unknown"),
        activity_intensity=metrics.get("activity_count", 0),
        calories=metrics.get("calories", 0),
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
