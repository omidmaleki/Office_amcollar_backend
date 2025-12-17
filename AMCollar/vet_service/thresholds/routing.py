from django.urls import re_path
from .consumers import ActivityConsumer

websocket_urlpatterns = [
    re_path(r"ws/activities/(?P<pet_id>\d+)/$", ActivityConsumer.as_asgi()),
]
