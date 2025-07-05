# collar/views.py
from rest_framework import generics
from .models import Collar
from .serializers import CollarSerializer
from rest_framework.permissions import IsAuthenticated

class CollarListCreateView(generics.ListCreateAPIView):
    queryset = Collar.objects.all()
    serializer_class = CollarSerializer
    permission_classes = [IsAuthenticated]
