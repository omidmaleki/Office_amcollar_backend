FROM python:3.11-slim

WORKDIR /app

COPY tcp_server.py /app/tcp_server.py

RUN pip install --no-cache-dir kafka-python

#CMD ["python", "tcp_server.py"]
