[← Back to Overview](../../overview.md)

# Collar Service Documentation

## Overview
The Collar Service manages the lifecycle of the smart collar devices. It handles adding new collars, associating them with pets, and managing device settings.

## Key Features
- **Device Management**: Register new collars by ID/Serial Number.
- **Pet Association**: Link a collar to a specific pet.
- **Settings**: Manage device configuration (e.g., LED color, reporting frequency).
- **Status Monitoring**: Tracks online/offline status and battery level (often updated by `Process Server`).

## API Endpoints (Typical)
- `POST /api/collar/register/`: Register a new device.
- `GET /api/collar/`: List all collars owned by the user.
- `PUT /api/collar/{id}/settings/`: Update device settings.
- `POST /api/collar/{id}/link-pet/`: Associate collar with a pet.

## Data Models
- **Collar**: Core model storing device ID, serial number, firmware version, and linked `pet_id`.
- **CollarSettings**: Configuration parameters for the device.

## Dependencies
- **PostgreSQL**: Stores device registry and settings.
- **Pet Service**: Verifies pet existence for linkage.
- **Process Server**: Updates device status based on incoming telemetry.
