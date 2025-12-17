import json
# thresholds/realtime.py
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()

def send_activity_update_to_frontend(activity):
    """
    ارسال تغییر Activity به فرانت.
    activity: instance از مدل Activity
    """
    if not activity:
        return

    data = {
        "pet_id": activity.pet_id,
        "collar_id": activity.collar_id,
        "posture": activity.posture,
        "behavior": activity.behavior,
        "activity_intensity": activity.activity_intensity,
        "calories": activity.calories,
        "timestamp": activity.timestamp.isoformat(),
    }

    # ارسال به کانال عمومی یا کانال اختصاصی pet_id
    async_to_sync(channel_layer.group_send)(
        f"pet_{activity.pet_id}",  # کانال اختصاصی هر پت
        {
            "type": "activity_update",  # handler در consumer WebSocket
            "message": data,
        }
    )
