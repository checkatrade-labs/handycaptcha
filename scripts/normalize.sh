#!/bin/bash

# Create normalized directory if it doesn't exist
mkdir -p public/challenges/normalized

# Run the normalizer script
NODE_OPTIONS="--no-warnings" npx ts-node-script --transpile-only scripts/normalize-challenges.ts \
  via_project_18Feb2025_15h13m_csv.csv \
  public/challenges \
  public/challenges/normalized
