from rest_framework import viewsets
from .models import Vet, VetForm
from .serializers import VetSerializer, VetFormSerializer, VetInfoMedicalSerializer, VetRegisterSerializer
from .models import VetInfoMedical
from .producer import send_threshold_update_event
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests

PET_SERVICE = "http://pet:8000"
THRESHOLD_SERVICE = "http://threshold:8000"


class CreateVetFormFromPet(APIView):

    def post(self, request, pet_id):
        vet_id = request.data.get("vet_id")
        owner_id = request.data.get("owner_id")
        purchase_id = request.data.get("purchase_id")

        if not vet_id:
            return Response({"error": "vet_id is required"}, status=400)

        # ----- Get Pet -----
        try:
            pet_resp = requests.get(f"{PET_SERVICE}/pets/{pet_id}/")
            pet_resp.raise_for_status()
            pet = pet_resp.json()
        except Exception as e:
            return Response({"error": f"PetService error: {e}"}, status=400)

        # ----- Get Threshold -----
        try:
            t_resp = requests.get(f"{THRESHOLD_SERVICE}/thresholds/by-pet/{pet_id}/")
            t_resp.raise_for_status()
            threshold = t_resp.json()
        except:
            threshold = {}

        vet_form_data = {
            "vet_id": vet_id,
            "owner_id": owner_id,
            "pet_id": pet_id,
            "purchase_id": purchase_id,

            "pet_name": pet["name"],
            "pet_age": pet["age"],
            "pet_race": pet["race"],
            "pet_image": pet.get("pet_image"),

            "body_temperature": threshold.get("body_temperature"),
            "hrv": threshold.get("hrv"),
        }

        serializer = VetFormSerializer(data=vet_form_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=201)



class VetViewSet(viewsets.ModelViewSet):
    queryset = Vet.objects.all()
    serializer_class = VetSerializer



class VetFormViewSet(viewsets.ModelViewSet):
    queryset = VetForm.objects.all()
    serializer_class = VetFormSerializer

    http_method_names = ["get", "patch", "put"]

    def update(self, request, *args, **kwargs):
        return self._update_instance(request, partial=False)

    def partial_update(self, request, *args, **kwargs):
        return self._update_instance(request, partial=True)

    def _update_instance(self, request, partial=False):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            self.perform_update(serializer)

            if serializer.instance.status == "completed":
                send_threshold_update_event(serializer.instance)

        return Response(serializer.data)

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