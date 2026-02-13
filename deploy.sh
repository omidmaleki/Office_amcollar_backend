#!/bin/bash

# Get current git branch
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
# Sanitize branch name (replace / with -)
GIT_BRANCH=${GIT_BRANCH//\//-}
# Lowercase branch name
GIT_BRANCH=$(echo "$GIT_BRANCH" | tr '[:upper:]' '[:lower:]')

# Get current commit hash (short)
GIT_COMMIT=$(git rev-parse --short HEAD)

# Construct tag
export IMAGE_TAG=$(echo "${GIT_BRANCH}-${GIT_COMMIT}" | tr '[:upper:]' '[:lower:]')

echo "Deploying with IMAGE_TAG=${IMAGE_TAG}"

# Build and deploy
docker compose -f docker-compose-prd.yml build
docker compose -f docker-compose-prd.yml pull
# docker compose -f docker-compose-prd.yml push
# docker compose -f docker-compose-prd.yml up -d
