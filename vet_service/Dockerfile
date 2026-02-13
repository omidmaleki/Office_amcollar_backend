FROM docker.arvancloud.ir/python:3.11-slim

WORKDIR /app

# system deps برای Pillow و psycopg
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libpq-dev \
#     libjpeg-dev \
#     zlib1g-dev \
#     curl \
#     && rm -rf /var/lib/apt/lists/*

# RUN apt update && apt install -y postgresql-client

COPY requirements.txt .
RUN apt update && apt install -y postgresql-client

RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY .env .env

ENV PORT=8000
ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "pet_service.wsgi:application", "--bind", "0.0.0.0:8000"]
