#!/bin/sh
echo "Waiting for database..."
sleep 5
echo "Making migrations..."
python manage.py makemigrations

echo "Applying migrations..."
python manage.py migrate

echo "Starting server..."
exec "$@"