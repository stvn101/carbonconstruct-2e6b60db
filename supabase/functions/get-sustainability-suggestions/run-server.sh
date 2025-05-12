#!/bin/bash
# Simple script to run the sustainability suggestions API server

echo "Starting sustainability suggestions API server..."
echo "Press Ctrl+C to stop the server"

# Run the server using Deno
deno run --allow-net --allow-env --import-map=import_map.json index.ts

# Note: If you need to specify additional permissions or import maps, add them here
# Example: deno run --allow-net --allow-env --import-map=import_map.json index.ts
