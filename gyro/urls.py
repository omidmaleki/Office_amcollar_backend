# gyro/urls.py
from django.urls import path
from .views import GyroListCreateView

urlpatterns = [
    path('', GyroListCreateView.as_view(), name='gyro-list-create'),
]
