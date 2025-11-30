FROM python:3.10-slim

WORKDIR /app

# نصب dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# کپی پروژه
COPY . .

# entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

# دستور پیشفرض
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
