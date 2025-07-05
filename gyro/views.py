# gyro/views.py
from rest_framework import generics, permissions
from .models import Gyro
from .serializers import GyroSerializer

class GyroListCreateView(generics.ListCreateAPIView):
    queryset = Gyro.objects.all().order_by('-timestamp')
    serializer_class = GyroSerializer
    permission_classes = [permissions.IsAuthenticated]
