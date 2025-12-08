# payment/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Payment
from order.models import Order
import requests
from order.producer import send_order_event_to_vet

PET_SERVICE = "http://pet:8000"
THRESHOLD_SERVICE = "http://threshold:8000"

@receiver(post_save, sender=Payment)
def create_order_after_payment(sender, instance, created, **kwargs):
    if not created:
        return

    # --- پیدا کردن pet_id بر اساس owner_id و collar_id ---
    pet_id = None
    try:
        pets = requests.get(f"{PET_SERVICE}/pets/", params={"owner_id": instance.owner_id}, timeout=5).json()
        # پیدا کردن پتی که collar_id آن صفر یا None است
        pet = next((p for p in pets if p.get("collar_id") in [0, None]), None)
        if pet:
            pet_id = pet["id"]
            # آپدیت pet با collar_id
            requests.patch(f"{PET_SERVICE}/pets/{pet_id}/", json={"collar_id": instance.collar_id}, timeout=5)
    except Exception as e:
        print(f"[Signals] Error fetching/updating pet: {e}")

    # --- ساخت Order ---
    if not Order.objects.filter(payment=instance).exists():
        order = Order.objects.create(
            owner_id=instance.owner_id,
            collar_id=instance.collar_id,
            vet_id=instance.vet_id,
            pet_id=pet_id,  # حالا pet_id پر شده
            amount=instance.amount,
            payment=instance,
            status="paid"
        )

        # --- Fetch pet_detail و threshold ---
        pet_detail = {}
        threshold = {}
        if pet_id:
            try:
                pet_detail = requests.get(f"{PET_SERVICE}/pets/{pet_id}/", timeout=5).json()
            except:
                pet_detail = {}
            try:
                th_list = requests.get(f"{THRESHOLD_SERVICE}/thresholds/", params={"pet_id": pet_id}, timeout=5).json()
                threshold = th_list[0] if th_list else {}
            except:
                threshold = {}

        # --- ارسال event به Kafka ---
        send_order_event_to_vet(order, pet_detail, threshold)
