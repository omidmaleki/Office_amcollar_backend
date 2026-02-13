import os
from celery import Celery
from decouple import config

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "vet_service.settings")

app = Celery("vet_service")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
