[← Back to Overview](../../overview.md)

# Owner Service Documentation

## Overview
The Owner Service manages the profiles of pet owners. It links users (from Auth Service) to their personal details and serves as the central point for owner-centric operations.

## Key Features
- **Profile Management**: Create, update, and retrieve owner profiles.
- **Address Management**: Store and manage owner addresses.
- **User Association**: Links to the `Auth Service` user ID.

## API Endpoints (Typical)
- `GET /api/owner/profile/`: Get current owner's profile.
- `PUT /api/owner/profile/`: Update profile details.
- `POST /api/owner/address/`: Add a new address.

## Dependencies
- **PostgreSQL**: Stores owner profiles and addresses.
- **Auth Service**: Validates user identity via JWT.

## Data Models
- **Owner**: Key model linking `user_id` to profile data (name, avatar, etc.).
- **Address**: Stores address details for shipping/billing.
