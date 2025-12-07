from django.apps import AppConfig
import os

class ThresholdsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'thresholds'

    def ready(self):
        if os.environ.get("RUN_MAIN") != "true":
            return

        from .consumer import start_consumer_thread
        start_consumer_thread()
