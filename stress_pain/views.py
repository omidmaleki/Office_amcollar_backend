# stress_pain/views.py
from rest_framework import generics, permissions
from .models import StressPainRecord
from .serializers import StressPainRecordSerializer

class StressPainRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = StressPainRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'owner':
            return StressPainRecord.objects.filter(pet__owner=user)
        elif user.role == 'vet':
            return StressPainRecord.objects.filter(pet__vet=user)
        return StressPainRecord.objects.none()

class StressPainRecordRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = StressPainRecord.objects.all()
    serializer_class = StressPainRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
