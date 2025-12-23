from django.core.management.base import BaseCommand
from notification.order_events import start_sms_consumer

class Command(BaseCommand):
    help = "Run Kafka consumer for SMS Service"

    def handle(self, *args, **options):
        start_sms_consumer()
