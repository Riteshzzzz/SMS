import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'society_management.settings')

django_asgi_app = get_asgi_application()

from society_management.consumers import SocietyConsumer

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': URLRouter([
        path('ws/society/', SocietyConsumer.as_asgi()),
    ]),
})
