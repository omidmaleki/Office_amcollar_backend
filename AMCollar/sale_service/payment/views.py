import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError, transaction
from .models import Payment
from .serializers import PaymentSerializer

COLLAR_SERVICE = "http://collar:8000"
PET_SERVICE = "http://pet:8000"

class CreatePaymentView(APIView):
    """
    ایجاد Payment و اتصال Collar به Pet و Owner
    """

    def post(self, request):
        data = request.data
        owner_id = data.get("owner_id")
        collar_id = data.get("collar_id")
        vet_id = data.get("vet_id")
        pet_id = data.get("pet_id")

        # ---------------------- چک اولیه ----------------------
        if not owner_id or not collar_id or not pet_id:
            return Response(
                {"error": "owner_id, collar_id and pet_id are required"}, status=400
            )

        try:
            # ---------------------- بررسی Collar ----------------------
            try:
                r_collar = requests.get(f"{COLLAR_SERVICE}/collars/{collar_id}/", timeout=5)
                r_collar.raise_for_status()
                collar_data = r_collar.json()
                price = collar_data.get("price")
            except requests.RequestException as e:
                return Response({"error": f"Collar service unreachable: {str(e)}"}, status=503)

            # ---------------------- بررسی Pet ----------------------
            try:
                r_pet = requests.get(f"{PET_SERVICE}/pets/{pet_id}/", timeout=5)
                r_pet.raise_for_status()
                pet_data = r_pet.json()
            except requests.RequestException as e:
                return Response({"error": f"Pet service unreachable: {str(e)}"}, status=503)

            # بررسی مالکیت Pet
            if pet_data.get("owner_id") != owner_id:
                return Response({"error": "Pet does not belong to owner"}, status=400)

            # ---------------------- ایجاد Payment ----------------------
            with transaction.atomic():
                payment = Payment.objects.create(
                    owner_id=owner_id,
                    collar_id=collar_id,
                    vet_id=vet_id,
                    pet_id=pet_id,
                    amount=price,
                    status="success"
                )

                # ---------------------- اتصال Collar به Owner ----------------------
                try:
                    collar_patch = requests.patch(
                        f"{COLLAR_SERVICE}/collars/{collar_id}/",
                        json={"owner_id": owner_id},
                        timeout=5
                    )
                    collar_patch.raise_for_status()
                except requests.RequestException:
                    # فقط لاگ بزنیم، rollback دیتابیس نداریم چون Payment ساخته شده
                    print(f"Warning: Failed to update collar {collar_id} with owner_id {owner_id}")

                # ---------------------- اتصال Pet به Collar ----------------------
                try:
                    pet_patch = requests.patch(
                        f"{PET_SERVICE}/pets/{pet_id}/",
                        json={"collar_id": collar_id},
                        timeout=5
                    )
                    pet_patch.raise_for_status()
                except requests.RequestException:
                    print(f"Warning: Failed to update pet {pet_id} with collar_id {collar_id}")

            # ---------------------- پاسخ ----------------------
            return Response({"payment": PaymentSerializer(payment).data}, status=201)

        except IntegrityError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
