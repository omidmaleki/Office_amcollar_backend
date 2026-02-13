[← Back to Overview](../../overview.md)

# Shopping Service Documentation

## Overview
The Shopping Service powers the e-commerce aspect of the platform. It manages product catalogs, inventory, and categories for collars and accessories.

## Key Features
- **Product Catalog**: List items for sale (Collars, Toys, Food).
- **Inventory Management**: Track stock levels.
- **Categories**: Organize products hierarchically.

## API Endpoints (Typical)
- `GET /api/shopping/products/`: List all products.
- `GET /api/shopping/product/{id}/`: Get product details.
- `GET /api/shopping/categories/`: List product categories.

## Dependencies
- **PostgreSQL**: Stores product data.
- **Sale Service**: References products for order creation.
