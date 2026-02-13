# FROM docker.arvancloud.ir/python:3.11-slim

# WORKDIR /app

# COPY requirements.txt .
# RUN apt-get update && apt-get install -y \
#     libjpeg-dev zlib1g-dev libpq-dev && \
#     pip install --no-cache-dir -r requirements.txt

# COPY . .

# ENV PORT=8000

# CMD ["gunicorn", "pet_service.wsgi:application", "--bind", "0.0.0.0:8000"]
FROM docker.arvancloud.ir/python:3.11-slim

WORKDIR /app

# تغییر mirror apt (Debian Bookworm)
# RUN sed -i 's|deb.debian.org|mirror.arvancloud.ir|g' /etc/apt/sources.list.d/debian.sources && \
#     sed -i 's|security.debian.org|mirror.arvancloud.ir|g' /etc/apt/sources.list.d/debian.sources

# نصب dependencyهای سیستمی
# RUN apt-get update && \
#     apt-get install -y \
#         libjpeg-dev \
#         zlib1g-dev \
#         libpq-dev \
#     && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# pip با mirror + fallback
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000

CMD ["gunicorn", "pet_service.wsgi:application", "--bind", "0.0.0.0:8000"]
