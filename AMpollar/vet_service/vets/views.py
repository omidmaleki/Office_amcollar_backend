from rest_framework import viewsets
from .models import Vet, VetForm
from .serializers import VetSerializer, VetFormSerializer, VetInfoMedicalSerializer, VetRegisterSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import VetInfoMedical
from rest_framework import status

class VetViewSet(viewsets.ModelViewSet):
    queryset = Vet.objects.all()
    serializer_class = VetSerializer



class VetFormViewSet(viewsets.ReadOnlyModelViewSet):
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

class VetRegisterView(APIView):
    def post(self, request):
        serializer = VetRegisterSerializer(data=request.data)
        if serializer.is_valid():
            vet = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VetInfoMedicalViewSet(viewsets.ModelViewSet):
    queryset = VetInfoMedical.objects.all()
    serializer_class = VetInfoMedicalSerializer
    # permission_classes = [IsVetService]