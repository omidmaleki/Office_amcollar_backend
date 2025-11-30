from rest_framework import viewsets
from rest_framework.views import APIView
from .models import Owner
from .serializers import OwnerSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError

class OwnerViewSet(viewsets.ModelViewSet):
    queryset = Owner.objects.all()
    serializer_class = OwnerSerializer

    def create(self, request, *args, **kwargs):
        data = request.data

        try:
            owner = Owner.objects.create(
                name=data["name"],
                phone=data["phone"],
                address=data.get("address", "")
            )
        except IntegrityError:
            return Response(
                {"detail": "این شماره قبلاً ثبت شده است."},
                status=status.HTTP_409_CONFLICT
            )

        pet_id = int(data.get("pet_id"))
        if pet_id:
            if pet_id not in owner.pet_ids:
                owner.pet_ids.append(pet_id)
                owner.save()

        serializer = OwnerSerializer(owner)
        return Response(serializer.data, status=status.HTTP_201_CREATED)