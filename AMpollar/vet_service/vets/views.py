from rest_framework import viewsets
from .models import Vet, VetForm
from .serializers import VetSerializer, VetFormSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

class VetViewSet(viewsets.ModelViewSet):
    queryset = Vet.objects.all()
    serializer_class = VetSerializer



class VetFormViewSet(viewsets.ModelViewSet):
    queryset = VetForm.objects.all()
    serializer_class = VetFormSerializer


class VetListView(APIView):
    def get(self, request):
        vets = Vet.objects.all().values("id", "name")

        vet_list = list(vets)

        vet_list.append({
            "id": "others",
            "name": "Other veterinarians",
        })

        return Response(vet_list, status=200)