# FROM docker.arvancloud.ir/python:3.11-slim

# WORKDIR /app

# # نصب dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# # خواندن پورت از ENV
# ENV PORT=8000

# CMD ["gunicorn", "auth_service.wsgi:application", "--bind", "0.0.0.0:8000"]

FROM docker.arvancloud.ir/python:3.11-slim

WORKDIR /app

# نصب dependency های سیستمی برای C-extension ها
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# فقط requirements
COPY requirements.txt .

# نصب پکیج ها با mirror آروان + fallback PyPI
RUN pip install --no-cache-dir \
    --timeout 120 \
    --index-url https://mirror.arvancloud.ir/pypi/simple \
    --extra-index-url https://pypi.org/simple \
    -r requirements.txt

# سپس کپی کل سورس
COPY . .

ENV PORT=8000
ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "auth_service.wsgi:application", "--bind", "0.0.0.0:8000"]
