FROM python:3.11-slim

WORKDIR /app


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# کپی shared
COPY process_server/shared /app/shared

# نصب به عنوان پکیج
RUN pip install /app/shared


COPY . .
