FROM python:3.11-slim

WORKDIR /app

# فقط requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# سپس کپی کل سورس
COPY . .

# فایل env
COPY .env .env

ENV PORT=8000
ENV PYTHONUNBUFFERED=1
