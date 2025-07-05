# vitalsigns/urls.py
from django.urls import path
from .views import VitalSignsListCreateView

urlpatterns = [
    path('', VitalSignsListCreateView.as_view(), name='vitalsigns-list-create'),
]
