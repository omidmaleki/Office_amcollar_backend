FROM docker.arvancloud.ir/python:3.11-slim

WORKDIR /app

# نصب dependencyهای سیستمی برای C-extensions
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libpq-dev \
#     libjpeg-dev \
#     zlib1g-dev \
#     && rm -rf /var/lib/apt/lists/*

# فقط requirements
COPY requirements.txt .

# نصب pip packages با mirror آروان + fallback PyPI
RUN pip install --no-cache-dir -r requirements.txt

# سپس کپی کل سورس
COPY . .

# فایل env
COPY .env .env

ENV PORT=8000
ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "pet_service.wsgi:application", "--bind", "0.0.0.0:8000"]
