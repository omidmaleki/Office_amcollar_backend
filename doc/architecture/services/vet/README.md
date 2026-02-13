[← Back to Overview](../../overview.md)

# Vet Service Documentation

## Overview
The Vet Service manages veterinary records and health data for pets. It defines health thresholds and alerts owners if a pet's vitals (monitored by the collar) exceed safe limits.

## Key Features
- **Health Records**: Store vaccination history, checkups, and medical notes.
- **Threshold Management**: Define safe ranges for heart rate, temperature, etc., based on breed/species.
- **Alert Generation**: Triggers warnings if telemetry data violates these thresholds.

## API Endpoints (Typical)
- `POST /api/vet/record/`: Add a medical record.
- `GET /api/vet/thresholds/{breed_id}/`: Get default health thresholds for a breed.
- `PUT /api/vet/thresholds/{pet_id}/`: Customize thresholds for a specific pet.

## Dependencies
- **PostgreSQL**: Stores records and thresholds.
- **Pet Service**: Links health data to specific pets.
- **Process Server**: Uses thresholds to evaluate incoming telemetry.
