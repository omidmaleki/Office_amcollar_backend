# collar/urls.py
from django.urls import path
from .views import CollarListCreateView

urlpatterns = [
    path('', CollarListCreateView.as_view(), name='collar-list-create'),
]
