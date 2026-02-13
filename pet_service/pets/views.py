from rest_framework import viewsets
from .models import Pet
from .serializers import PetSerializer, PetInfo2Serializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

# Pet Service

@api_view(["GET"])
def health(request):
    return Response({"status": "ok"}, status=200)


class PetViewSet(viewsets.ModelViewSet):
    serializer_class = PetSerializer

    def get_queryset(self):
        qs = Pet.objects.all()
        owner_id = self.request.query_params.get("owner_id")
        if owner_id:
            qs = qs.filter(owner_id=owner_id)
        return qs

    def perform_create(self, serializer):
        serializer.save()


class PetInfo2View(APIView):
    """
    آپدیت اطلاعات ثانویه Pet بر اساس owner_id
    """

    def get(self, request, owner_id):
        try:
            pet = Pet.objects.get(owner_id=owner_id)
        except Pet.DoesNotExist:
            return Response({"detail": "Pet not found for this owner_id"}, status=404)

        serializer = PetInfo2Serializer(pet)
        return Response(serializer.data, status=200)

    def patch(self, request, owner_id):
        try:
            pet = Pet.objects.get(owner_id=owner_id)
        except Pet.DoesNotExist:
            return Response({"detail": "Pet not found for this owner_id"}, status=404)

        serializer = PetInfo2Serializer(pet, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)




