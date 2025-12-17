#!/bin/sh
# entrypoint.sh
sleep 5

# مهاجرت‌ها
python manage.py makemigrations --no-input
python manage.py migrate --no-input

# اجرای consumer در پس‌زمینه
python -c "
from vets.consumer import start_consumer_thread
start_consumer_thread()
import time
while True:
    time.sleep(60)
" &

# اجرای Gunicorn (سرویس اصلی)
exec gunicorn vet_service.asgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --worker-class uvicorn.workers.UvicornWorker \
    --timeout 120
