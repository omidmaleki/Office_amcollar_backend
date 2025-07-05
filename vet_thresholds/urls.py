# vet_thresholds/urls.py
from django.urls import path
from .views import VetThresholdListCreateView, VetThresholdRetrieveUpdateDeleteView

urlpatterns = [
    path('', VetThresholdListCreateView.as_view(), name='vetthreshold-list-create'),
    path('<int:pk>/', VetThresholdRetrieveUpdateDeleteView.as_view(), name='vetthreshold-detail'),
]
