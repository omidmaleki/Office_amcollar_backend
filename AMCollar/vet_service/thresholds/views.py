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
from .alert_service import trigger_alert
COLLAR_SERVICE = "http://collar:8000/collars/by-mac/"


@api_view(["POST"])
def ingest_gyro(request):
    mac = request.data.get("mac_address")
    metrics = request.data.get("metrics")
    timestamp = request.data.get("timestamp")

    if not mac or not metrics:
        return Response({"error": "invalid payload"}, status=400)

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

    # 2️⃣ ذخیره Activity
    Activity.objects.create(
        pet_id=pet_id,
        collar_id=collar_id,
        posture=metrics["posture"],
        behavior=metrics["behavior"],
        activity_intensity=metrics["activity_intensity"],
        calories=metrics["calories"],
        sleep_time_sec=metrics["sleep_time_sec"],
        activity_time_sec=metrics["activity_time_sec"],
        timestamp=timestamp,
    )

    # # 3️⃣ (اختیاری) Threshold check
    # threshold = Threshold.objects.filter(pet_id=pet_id).first()
    # if threshold:
    #     from thresholds.services.threshold_engine import evaluate_activity
    #     from thresholds.services.alert_service import trigger_alert
    #
    #     alert_type = evaluate_activity(metrics, threshold)
    #     if alert_type:
    #         trigger_alert(pet_id, alert_type)

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
