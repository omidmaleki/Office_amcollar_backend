# device_information/urls.py
from django.urls import path
from .views import DeviceInformationListCreateView, DeviceInformationRetrieveUpdateView

urlpatterns = [
    path('', DeviceInformationListCreateView.as_view(), name='device-info-list-create'),
    path('<int:pk>/', DeviceInformationRetrieveUpdateView.as_view(), name='device-info-detail'),
]
