from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests

# ---------------------- SERVICE URLs ----------------------
OWNER_SERVICE = "http://owner:8000"
PET_SERVICE = "http://pet:8000"
COLLAR_SERVICE = "http://collar:8000"
ORDER_SERVICE = "http://order:8000"
PAYMENT_SERVICE = "http://payment:8000"
NOTIFICATION_SERVICE = "http://notification:8000"
SMS_SERVICE = "http://sms:8000"
AUTH_SERVICE = "http://auth:8000"
VET_SERVICE = "http://vet:8000"


# ---------------------- GENERIC PROXY CLASS ----------------------
class BaseProxy(APIView):
    SERVICE_URL = None

    def get(self, request):
        resp = requests.get(f"{self.SERVICE_URL}", params=request.query_params)
        return Response(resp.json(), status=resp.status_code)

    def post(self, request):
        resp = requests.post(f"{self.SERVICE_URL}", json=request.data)
        return Response(resp.json(), status=resp.status_code)


# ---------------------- SPECIFIC PROXIES ----------------------
class OwnerProxy(BaseProxy):
    SERVICE_URL = f"{OWNER_SERVICE}/owners/"


class PetProxy(BaseProxy):
    SERVICE_URL = f"{PET_SERVICE}/pets/"


class CollarProxy(BaseProxy):
    SERVICE_URL = f"{COLLAR_SERVICE}/products/"


class OrderProxy(BaseProxy):
    SERVICE_URL = f"{ORDER_SERVICE}/orders/"


class PaymentProxy(BaseProxy):
    SERVICE_URL = f"{PAYMENT_SERVICE}/payments/"


class NotificationProxy(BaseProxy):
    SERVICE_URL = f"{NOTIFICATION_SERVICE}/notifications/"


class VetProxy(BaseProxy):
    SERVICE_URL = f"{VET_SERVICE}/pets/"


# ---------------------- AUTH Proxy ----------------------
@api_view(["POST"])
def auth_proxy(request, path):
    """
    ANY request to /auth/<path>/ goes to auth service
    Example:
        /auth/owners/send-otp/
        /auth/vets/login/
    """
    url = f"{AUTH_SERVICE}/auth/{path}/"

    try:
        resp = requests.post(url, json=request.data)
        return Response(resp.json(), status=resp.status_code)
    except Exception as e:
        return Response({"error": str(e)}, status=500)


# ---------------------- SMS Proxy ----------------------
@api_view(["POST"])
def sms_proxy(request):
    try:
        resp = requests.post(f"{SMS_SERVICE}/sms/", json=request.data)
        return Response(resp.json(), status=resp.status_code)
    except Exception as e:
        return Response({"success": False, "message": str(e)}, status=500)


# ---------------------- Combined Register Endpoint ----------------------
class RegisterOwnerPetInfoView(APIView):
    """
    Register Owner + Pet in one API call
    """

    def post(self, request):
        try:
            data = request.data
            owner_data = data.get("owner")
            pet_data = data.get("pet")
            vet_id = data.get("vet")

            if not owner_data or not pet_data:
                return Response({"detail": "owner + pet required"}, status=400)

            # ------------------ Create Pet ------------------
            try:
                pet_res = requests.post(f"{PET_SERVICE}/pets/", json=pet_data)
            except requests.exceptions.RequestException:
                return Response({"detail": "pet service unavailable"}, status=503)

            if pet_res.status_code >= 400:
                return Response(
                    {"detail": "pet service error", "error": pet_res.json()},
                    status=pet_res.status_code
                )

            pet_json = pet_res.json()
            pet_id = pet_json.get("id")

            # ------------------ Prepare Owner Payload ------------------
            owner_payload = {
                "name": owner_data.get("name"),
                "phone": owner_data.get("phone"),
                "address": owner_data.get("address", ""),
                "vet_id": vet_id,
                "collar_ids": {str(pet_id): pet_data.get("name")},
                "pet_ids": [pet_id]
            }

            # ------------------ Create Owner ------------------
            try:
                owner_res = requests.post(
                    f"{OWNER_SERVICE}/owners/",
                    json=owner_payload
                )
            except requests.exceptions.RequestException:
                return Response({"detail": "owner service unavailable"}, status=503)

            if owner_res.status_code == 409:
                return Response(
                    {"detail": "owner already exists"},
                    status=409
                )

            if owner_res.status_code >= 400:
                return Response(
                    {"detail": "owner service error", "error": owner_res.json()},
                    status=owner_res.status_code
                )

            return Response({
                "owner": owner_res.json(),
                "pet": pet_json,
                "vet": {"id": vet_id}
            }, status=200)

        except Exception as e:
            return Response(
                {"detail": f"internal server error: {str(e)}"},
                status=500
            )
