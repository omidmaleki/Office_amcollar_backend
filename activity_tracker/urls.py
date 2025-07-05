# activity_tracker/urls.py
from django.urls import path
from .views import ActivityRecordListCreateView, ActivityRecordRetrieveUpdateDestroyView

urlpatterns = [
    path('', ActivityRecordListCreateView.as_view(), name='activityrecord-list-create'),
    path('<int:pk>/', ActivityRecordRetrieveUpdateDestroyView.as_view(), name='activityrecord-detail'),
]
