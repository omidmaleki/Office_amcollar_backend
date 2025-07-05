# pet/views.py
from rest_framework import generics, permissions
from .models import Pet
from .serializers import PetSerializer

class PetCreateView(generics.CreateAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PetListView(generics.ListAPIView):
    serializer_class = PetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'owner':
            return Pet.objects.filter(owner=user)
        elif user.role == 'vet':
            return Pet.objects.filter(vet=user)
        return Pet.objects.none()
