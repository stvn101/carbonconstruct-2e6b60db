
#!/bin/bash
# Simple script to run the sustainability suggestions API server

echo "Starting sustainability suggestions API server..."
echo "Press Ctrl+C to stop the server"

# Run the server using Deno
deno run --allow-net --allow-env --import-map=import_map.json index.ts

