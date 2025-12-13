FROM python:3.12-slim

# نصب ابزارهای لازم برای نصب پکیج‌های Python از سورس
RUN apt-get update && \
    apt-get install -y git build-essential libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

# نصب پکیج‌ها
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000

CMD ["gunicorn", "vet_service.wsgi:application", "--bind", "0.0.0.0:8000"]
