# stress_pain/urls.py
from django.urls import path
from .views import StressPainRecordListCreateView, StressPainRecordRetrieveUpdateDestroyView

urlpatterns = [
    path('', StressPainRecordListCreateView.as_view(), name='stresspain-list-create'),
    path('<int:pk>/', StressPainRecordRetrieveUpdateDestroyView.as_view(), name='stresspain-detail'),
]
