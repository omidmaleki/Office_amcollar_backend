FROM python:3.11-slim

WORKDIR /app

# ---------- requirements ----------
COPY ppg_service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ---------- shared ----------
COPY shared /app/shared
RUN pip install /app/shared

# ---------- ppg service code ----------
COPY ppg_service /app

ENV PYTHONPATH="/app"

CMD ["python", "-u", "/app/consumer.py"]
