from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ThresholdViewSet

router = DefaultRouter()
router.register(r'thresholds', ThresholdViewSet, basename='threshold')

urlpatterns = [
    path('', include(router.urls)),
]
