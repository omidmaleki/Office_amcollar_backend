# Temperature/urls.py
from django.urls import path
from .views import TemperatureCreateView, TemperatureListView

urlpatterns = [
    path('create/', TemperatureCreateView.as_view(), name='temperature-create'),
    path('list/', TemperatureListView.as_view(), name='temperature-list'),
]
