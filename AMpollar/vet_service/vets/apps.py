from django.apps import AppConfig


class VetsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vets'

    def ready(self):
        from .consumer import start_consumer_thread
        start_consumer_thread()
