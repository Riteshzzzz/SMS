import json
from channels.generic.websocket import AsyncWebsocketConsumer


class SocietyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'society_updates'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': data.get('type', 'broadcast'),
                'data': data,
            }
        )

    async def visitor_arrival(self, event):
        await self.send(text_data=json.dumps({
            'type': 'visitor_arrival',
            'data': event['data']
        }))

    async def payment_confirmed(self, event):
        await self.send(text_data=json.dumps({
            'type': 'payment_confirmed',
            'data': event['data']
        }))

    async def emergency_alert(self, event):
        await self.send(text_data=json.dumps({
            'type': 'emergency_alert',
            'data': event['data']
        }))

    async def broadcast(self, event):
        await self.send(text_data=json.dumps({
            'type': 'broadcast',
            'data': event['data']
        }))
