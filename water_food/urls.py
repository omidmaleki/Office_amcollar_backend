# water_food/urls.py
from django.urls import path
from .views import WaterFoodContainerListCreateView, WaterFoodRecordListCreateView

urlpatterns = [
    path('containers/', WaterFoodContainerListCreateView.as_view(), name='waterfood-container-list-create'),
    path('records/', WaterFoodRecordListCreateView.as_view(), name='waterfood-record-list-create'),
]
