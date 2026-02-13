[← Back to Overview](../../overview.md)

# Auth Service Documentation

## Overview
The Auth Service handles user authentication, registration, and token management using JWT. It is responsible for securing access to the system.

## Key Features
- **User Registration**: Handles sign-up with email/phone verification.
- **Login**: Authenticates users and issues JWT tokens (Access & Refresh).
- **Token Integirty**: Handles token verification and refresh.
- **Password Management**: Handles password resets and changes.

## API Endpoints (Typical)
- `POST /api/auth/register/`: Register a new user.
- `POST /api/auth/login/`: Authenticate and get tokens.
- `POST /api/auth/token/refresh/`: Refresh an expired access token.
- `POST /api/auth/password/reset/`: Initiate password reset.

## Data Models
- **CustomUser**: Extends Django's AbstractUser. Includes fields like: base user info (email, phone).

## Dependencies
- **PostgreSQL**: Stores user credentials and profile data.
- **Redis**: Caches user sessions or tokens (if configured).
- **SMS Service (Optional)**: Used for OTP verification during registration/reset.

## Configuration
- `SECRET_KEY`: Used for signing JWTs.
- `ACCESS_TOKEN_LIFETIME`: Duration of access token validity.
- `REFRESH_TOKEN_LIFETIME`: Duration of refresh token validity.
