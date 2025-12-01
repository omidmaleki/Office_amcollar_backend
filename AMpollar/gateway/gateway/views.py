from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests

OWNER_SERVICE = "http://owner:8000"
PET_SERVICE = "http://pet:8000"
SMS_SERVICE = "http://sms:8000"
AUTH_SERVICE = "http://auth:8000"

# ---------------- Owner Proxy ----------------
class OwnerProxy(APIView):
    def get(self, request):
        """List all owners or filter by query params"""
        resp = requests.get(f"{OWNER_SERVICE}/owners/", params=request.query_params)
        return Response(resp.json(), status=resp.status_code)

    def post(self, request):
        """Create owner"""
        resp = requests.post(f"{OWNER_SERVICE}/owners/", json=request.data)
        try:
            data = resp.json()
        except ValueError:
            data = {"detail": "No content returned from Owner service."}
        return Response(data, status=resp.status_code)

# ---------------- Pet Proxy ----------------
class PetProxy(APIView):
    def get(self, request):
        resp = requests.get(f"{PET_SERVICE}/pets/", params=request.query_params)
        return Response(resp.json(), status=resp.status_code)

    def post(self, request):
        resp = requests.post(f"{PET_SERVICE}/pets/", json=request.data)
        return Response(resp.json(), status=resp.status_code)

# ---------------- Shopping Proxy ----------------
class ShoppingProxy(APIView):
    def get(self, request):
        resp = requests.get(f"{PET_SERVICE}/pets/", params=request.query_params)
        return Response(resp.json(), status=resp.status_code)

# ---------------- SMS Proxy ----------------
@api_view(["POST"])
def sms_proxy(request):
    body = request.data
    try:
        resp = requests.post(f"{SMS_SERVICE}/sms/", json=body, timeout=5)
        resp.raise_for_status()
        return Response(resp.json(), status=resp.status_code)
    except requests.exceptions.RequestException as e:
        return Response({"success": False, "message": str(e)}, status=500)

# ---------------- Send OTP Proxy ----------------

@api_view(["POST"])
def auth_proxy(request, path):
    """
    Generic proxy for auth service (owners/vets)
    Example: /auth/owners/send-otp/ → forwards to http://auth:8000/auth/owners/send-otp/
    """
    url = f"http://auth:8000/auth/{path}/"

    try:
        resp = requests.post(url, json=request.data, timeout=5)
        return Response(resp.json(), status=resp.status_code)
    except requests.exceptions.RequestException as e:
        return Response({"success": False, "message": str(e)}, status=500)


# ---------------- Register Owner & Pet ----------------
class RegisterOwnerPetInfo1ViewSet(APIView):
    def post(self, request):
        data = request.data
        owner_data = data.get("owner")
        pet_data = data.get("pet")

        if not owner_data or not pet_data:
            return Response({"detail": "owner and pet data required"}, status=400)

        # check owner exists
        owner_check_res = requests.get(f"{OWNER_SERVICE}/owners/", params={"phone": owner_data["phone"]})
        existing_owners = owner_check_res.json()
        if existing_owners:
            return Response({"detail": "این شماره قبلاً ثبت شده است."}, status=409)

        # create pet
        pet_res = requests.post(f"{PET_SERVICE}/pets/", json=pet_data)
        if pet_res.status_code >= 400:
            return Response({"detail": "خطا در سرویس pet"}, status=500)
        pet_id = pet_res.json().get("id")

        # create owner
        owner_payload = {
            "name": owner_data["name"],
            "phone": owner_data["phone"],
            "address": owner_data.get("address", ""),
            "pet_id": pet_id
        }
        owner_res = requests.post(f"{OWNER_SERVICE}/owners/", json=owner_payload)

        return Response({
            "pet": pet_res.json(),
            "owner": owner_res.json()
        }, status=200)


