[← Back to Overview](../../overview.md)

# Sale Service Documentation

## Overview
The Sale Service handles all financial transactions, including purchasing products (collars, accessories) and managing subscriptions for premium features. It interfaces with payment gateways.

## Key Features
- **Order Management**: Create and track orders.
- **Payment Processing**: Handle payments via third-party gateways (e.g., Stripe, PayPal, or local providers).
- **Subscriptions**: Manage recurring billing for service plans (e.g., GPS tracking data).
- **Invoicing**: Generate and retrieve invoices.

## API Endpoints (Typical)
- `POST /api/sale/order/`: Create a new purchase order.
- `GET /api/sale/orders/`: List user's order history.
- `POST /api/sale/payment/initiate/`: Start a payment transaction.
- `GET /api/sale/subscription/`: Check subscription status.

## Data Models
- **Order**: Records a purchase (items, total, status).
- **Transaction**: Records a payment attempt and its result.
- **Subscription**: Tracks active plans and expiry dates.

## Dependencies
- **PostgreSQL**: Stores financial records.
- **Auth Service**: identifying the payer.
- **Shopping Service**: Validating product details and prices.
