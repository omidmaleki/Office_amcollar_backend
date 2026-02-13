# FROM docker.arvancloud.ir/python:3.11-slim

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# ENV PORT=8000

# CMD ["gunicorn", "collar_service.wsgi:application", "--bind", "0.0.0.0:8000"]

FROM docker.arvancloud.ir/python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000

CMD ["gunicorn", "collar_service.wsgi:application", "--bind", "0.0.0.0:8000"]

