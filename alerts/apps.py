# alerts/app.py
from django.apps import AppConfig

class AlertsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'alerts'

    def ready(self):
        print("alerts.signals module imported!")
        import alerts.signals
