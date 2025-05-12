
#!/bin/bash
# Enhanced script to run the comprehensive API tests

echo "Running Sustainability Suggestions API tests..."
echo "Make sure the API server is running in another terminal window."
echo "If not, run './run-server.sh' in another terminal first."
echo ""

# Run the tests with the correct permissions
deno test --allow-net --allow-env --import-map=import_map.json test.ts

echo ""
echo "Tests completed."
