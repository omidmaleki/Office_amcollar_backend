# alerts/views.py
from rest_framework import generics, permissions
from .models import Alert
from .serializers import AlertSerializer

class AlertListCreateView(generics.ListCreateAPIView):
    queryset = Alert.objects.all().order_by('-alert_timestamp')
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAuthenticated]

class AlertDetailView(generics.RetrieveUpdateAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [permissions.IsAuthenticated]
