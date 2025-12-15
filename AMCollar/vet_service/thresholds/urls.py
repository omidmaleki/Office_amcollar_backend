# thresholds/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ThresholdViewSet,
    RadiographyViewSet,
    TestReportViewSet,
    SurgeryHistoryViewSet,
    ingest_gyro
)

router = DefaultRouter()
router.register("thresholds", ThresholdViewSet, basename="threshold")
router.register("radiography", RadiographyViewSet, basename="radiography")
router.register("test-reports", TestReportViewSet, basename="test_reports")
router.register("surgery-history", SurgeryHistoryViewSet, basename="surgery_history")

urlpatterns = [
    path("", include(router.urls)),
    path("gyro/ingest/", ingest_gyro, name="ingest-gyro"),
]
