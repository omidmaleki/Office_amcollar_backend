[← Back to Overview](../../overview.md)

# Pet Service Documentation

## Overview
The Pet Service is responsible for managing all data related to pets. It stores pet profiles, breed information, and links pets to their owners.

## Key Features
- **Pet Profiles**: Create, update, delete, and list pets.
- **Breed Management**: Curated list of breeds for different species (Dog, Cat, etc.).
- **Owner Association**: Links pets to `Owner Service` profiles.

## API Endpoints (Typical)
- `GET /api/pet/`: List all pets for the authenticated user.
- `POST /api/pet/`: Add a new pet.
- `GET /api/pet/{id}/`: Get details of a specific pet.
- `GET /api/pet/breeds/`: List available breeds.

## Data Models
- **Pet**: Stores pet details (name, age, species, breed, weight, gender).
- **Breed**: Lookup table for pet breeds.

## Dependencies
- **PostgreSQL**: Stores pet and breed data.
- **Owner Service**: Verifies owner existence (often via API or implicit ID).
