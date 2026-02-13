# process_server/shared/device_context.py
import requests
import os

COLLAR_SERVICE_BY_MAC_URL = os.getenv(
    "COLLAR_SERVICE_BY_MAC_URL",
    "http://collar:8000/collars/by-mac/"
)

PET_SERVICE_URL = os.getenv(
    "PET_SERVICE_URL",
    "http://pet:8000/pets/"
)


def resolve_device_context(mac_address: str) -> dict:
    if not mac_address:
        raise ValueError("mac_address missing")

    # ---- collar ----
    collar_resp = requests.get(f"{COLLAR_SERVICE_BY_MAC_URL}{mac_address}/", timeout=10)
    collar_resp.raise_for_status()
    collar = collar_resp.json()

    owner_id = collar.get("owner_id")
    collar_id = collar.get("id")

    if not owner_id or not collar_id:
        raise ValueError("Invalid collar data")

    # ---- pet ----
    pet_resp = requests.get(f"{PET_SERVICE_URL}?owner_id={owner_id}", timeout=10)
    pet_resp.raise_for_status()
    pets = pet_resp.json()

    if not pets:
        raise ValueError("No pet found for owner")

    pet = pets[0]

    return {
        "pet_id": pet["id"],
        "owner_id": owner_id,
        "collar_id": collar_id,
        "species": pet.get("species"),
        "breed": pet.get("race"),
        "weight_kg": pet.get("weight_kg", 5),
    }
