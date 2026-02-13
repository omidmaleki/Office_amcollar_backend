# notification/view.py
from rest_framework import viewsets
from .models import Veterinary, ContactUs
from .serializers import VeterinarySerializer, ContactUsSerializer


class VeterinaryViewSet(viewsets.ModelViewSet):
    queryset = Veterinary.objects.all()
    serializer_class = VeterinarySerializer


class ContactUsViewSet(viewsets.ModelViewSet):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer
