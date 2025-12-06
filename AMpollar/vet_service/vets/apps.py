from django.apps import AppConfig
import threading
import time

class VetsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vets'

    def ready(self):
        # import داخل ready() برای جلوگیری از circular import
        from .consumer import listen_order_events

        def start_consumer():
            time.sleep(5)  # صبر کوتاه برای آماده شدن DB
            listen_order_events()

        thread = threading.Thread(target=start_consumer, daemon=True)
        thread.start()
        print("Vet consumer thread started...")
