#!/bin/bash
# Enhanced script to run the comprehensive API tests

echo "Running Sustainability Suggestions API tests..."
echo "Make sure the API server is running in another terminal window."
echo "If not, run './run-server.sh' in another terminal first."
echo ""

# Run the basic API tests
echo "=== Running Basic API Tests ==="
deno run --allow-net --import-map=import_map.json test-api.ts

echo ""
echo "=== Running Comprehensive Test Suite ==="
# Run the comprehensive test suite
deno run --allow-net --import-map=import_map.json test.ts

echo ""
echo "Tests completed."
echo "To view the API demo in a browser, open api-demo.html in your browser."
