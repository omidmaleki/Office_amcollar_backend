FROM python:3.11-slim

WORKDIR /app

# نصب dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# خواندن پورت از ENV
ENV PORT=8000

CMD ["gunicorn", "auth_service.wsgi:application", "--bind", "0.0.0.0:8000"]
