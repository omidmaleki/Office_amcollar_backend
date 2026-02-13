import json

with open("species_config.json", "r") as f:
    SPECIES_CONFIG = json.load(f)


def normalize_name(name: str) -> str:
    return name.lower().replace(" ", "_")


def get_factors(species: str, breed: str):
    species = normalize_name(species)
    breed = normalize_name(breed)

    species_data = SPECIES_CONFIG.get(species)

    # fallback امن
    if not species_data:
        return 1.0, 1.0

    species_factor = species_data.get("species_factor", 1.0)

    breeds = species_data.get("breeds", {})
    breed_factor = breeds.get(breed, breeds.get("default", 1.0))

    return species_factor, breed_factor
