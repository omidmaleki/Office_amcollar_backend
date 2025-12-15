FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN apt-get update && apt-get install -y \
    libjpeg-dev zlib1g-dev libpq-dev && \
    pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000

CMD ["gunicorn", "pet_service.wsgi:application", "--bind", "0.0.0.0:8000"]
