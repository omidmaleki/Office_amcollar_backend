FROM docker.arvancloud.ir/python:3.11-slim

WORKDIR /app

# # نصب dependency های سیستمی برای C-extension ها
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libpq-dev \
#     libjpeg-dev \
#     zlib1g-dev \
#     && rm -rf /var/lib/apt/lists/*

# RUN pip config set global.index-url https://mirror-pypi.runflare.com


# فقط requirements
COPY requirements.txt .

# نصب پکیج ها با mirror آروان + fallback به PyPI اصلی
RUN pip install --no-cache-dir -r requirements.txt
#    --index-url https://mirror.arvancloud.ir/pypi/simple \
#    --extra-index-url https://pypi.org/simple \
#    -r requirements.txt

# کپی کل سورس
COPY . .

ENV PORT=8000
ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "gateway.wsgi:application", "--bind", "0.0.0.0:8000"]
