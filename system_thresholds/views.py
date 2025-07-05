# system_thresholds/views.py
from rest_framework import generics, permissions
from .models import PetCategory, SystemThreshold
from .serializers import PetCategorySerializer, SystemThresholdSerializer

class PetCategoryListCreateView(generics.ListCreateAPIView):
    queryset = PetCategory.objects.all()
    serializer_class = PetCategorySerializer
    permission_classes = [permissions.IsAdminUser]  # فقط ادمین‌ها می‌تونند دسته‌ها رو بسازند/ببینند

class SystemThresholdListCreateView(generics.ListCreateAPIView):
    queryset = SystemThreshold.objects.all()
    serializer_class = SystemThresholdSerializer
    permission_classes = [permissions.IsAdminUser]  # فقط ادمین‌ها
