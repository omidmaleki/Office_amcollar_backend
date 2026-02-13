[← Back to Overview](../../overview.md)

# Frontend Service (Web) Documentation

## Overview
The Frontend Service (`amcollar-landing`) is the web-based user interface for AmCollar. It allows pet owners to manage their account, view pet data, and purchase products.

## Key Features
- **User Dashboard**: View pet stats, manage profile.
- **E-commerce Store**: Browse and buy products.
- **Administration**: Admin panel for managing users/orders (if applicable).

## Tech Stack
- **Framework**: Next.js (React).
- **Styling**: Tailwind CSS.
- **Rendering**: Server-Side Rendering (SSR) & Static Site Generation (SSG).

## Integration
- **API**: Consumes the `Gateway` API (`/api/...`).
- **Images**: Served from Nginx/S3.
