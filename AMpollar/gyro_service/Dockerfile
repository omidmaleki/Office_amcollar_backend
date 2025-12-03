FROM python:3.11-slim

WORKDIR /app

COPY gyro_process.py /app/consumer.py

RUN pip install --no-cache-dir kafka-python

#CMD ["python", "tcp_server.py"]
