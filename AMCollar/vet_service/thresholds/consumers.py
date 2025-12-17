# thresholds/consumers.py
from channels.generic.websocket import AsyncJsonWebsocketConsumer

class ActivityConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.pet_id = self.scope['url_route']['kwargs']['pet_id']
        self.group_name = f"pet_{self.pet_id}"

        # اضافه شدن به گروه
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def activity_update(self, event):
        # event["message"] حاوی دیتای Activity است
        await self.send_json(event["message"])
