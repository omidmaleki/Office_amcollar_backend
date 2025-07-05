# system_thresholds/apps.py
from django.apps import AppConfig

class SystemThresholdsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'system_thresholds'

    def ready(self):
        import system_thresholds.signals
