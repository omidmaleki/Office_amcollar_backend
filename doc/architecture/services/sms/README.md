[← Back to Overview](../../overview.md)

# SMS Service Documentation

## Overview
The SMS Service is a utility service responsible for sending SMS notifications. It abstracts the provider-specific logic, allowing other services to send messages without knowing the implementation details.

## Key Features
- **Send SMS**: Send text messages to specified phone numbers.
- **Template Management**: (Optional) Manage message templates for common notifications (OTP, alerts).
- **Log Management**: Track sent messages and delivery status.

## API Endpoints (Typical)
- `POST /api/sms/send/`: Send a single SMS.
    - Payload: `{ "phone_number": "+123456789", "message": "Your OTP is 1234" }`

## Data Models
- **SMSLog**: Records sent messages, timestamps, and status (sent, failed, delivered).

## Dependencies
- **PostgreSQL**: Stores logs.
- **Celery/Redis**: Often uses a task queue to send messages asynchronously to avoid blocking the caller.
- **Third-Party Provider**: External API (e.g., Twilio, KavehNegar, SMS.ir) for actual delivery.
