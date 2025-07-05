# water_food/views.py
from rest_framework import generics, permissions
from .models import WaterFoodContainer, WaterFoodRecord
from .serializers import WaterFoodContainerSerializer, WaterFoodRecordSerializer
from rest_framework.exceptions import PermissionDenied

class WaterFoodContainerListCreateView(generics.ListCreateAPIView):
    serializer_class = WaterFoodContainerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return WaterFoodContainer.objects.filter(pet__owner=user)

class WaterFoodRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = WaterFoodRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return WaterFoodRecord.objects.filter(container__pet__owner=user)

    def perform_create(self, serializer):
        # جلوگیری از ایجاد رکورد دستی از طریق API
        raise PermissionDenied("رکوردهای مصرف آب و غذا فقط بصورت خودکار ثبت می‌شوند.")
