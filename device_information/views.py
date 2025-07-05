# device_information/views.py
from rest_framework import generics
from .models import DeviceInformation
from .serializers import DeviceInformationSerializer

class DeviceInformationListCreateView(generics.ListCreateAPIView):
    queryset = DeviceInformation.objects.all()
    serializer_class = DeviceInformationSerializer

class DeviceInformationRetrieveUpdateView(generics.RetrieveUpdateAPIView):
    queryset = DeviceInformation.objects.all()
    serializer_class = DeviceInformationSerializer
