# Sustainability Suggestions API

This API provides sustainability suggestions and metrics based on material, transport, and energy data for construction projects.

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) installed on your system
- Basic knowledge of REST APIs

### Running the Server

1. Make the run script executable:

   ```bash
   chmod +x run-server.sh
   ```

2. Run the server:

   ```bash
   ./run-server.sh
   ```

   Alternatively, you can run the server directly with Deno:

   ```bash
   deno run --allow-net --allow-env index.ts
   ```

3. The server will start on port 8000 by default.

### Testing the API

We've provided test scripts to verify that the API endpoints are working correctly:

1. In a new terminal window (while the server is running), run:

   ```bash
   ./run-tests.sh
   ```

   This will run both the basic API tests and the comprehensive test suite.

   Alternatively, you can run the tests individually:

   ```bash
   # Run basic API tests
   deno run --allow-net test-api.ts

   # Run comprehensive test suite
   deno run --allow-net test.ts
   ```

2. The test scripts will:
   - Test the main endpoint with sample data
   - Test error handling with invalid data
   - Test the materials endpoint
   - Test detailed reports with various options
   - Test edge cases and performance
   - Test caching functionality

## API Endpoints

### Main Endpoint (POST /)

The main endpoint accepts POST requests with JSON data containing materials, transport, and energy information.

#### Request Format

```json
{
  "materials": [
    {
      "name": "Concrete",
      "embodiedCarbon": 0.85,
      "recycledContent": 20,
      "locallySourced": false
    }
  ],
  "transport": [
    {
      "type": "Truck",
      "distance": 150,
      "emissionsFactor": 0.9,
      "efficiency": 0.65,
      "fuel": "diesel"
    }
  ],
  "energy": [
    {
      "source": "Grid Electricity",
      "consumption": 5000,
      "carbonIntensity": 0.5,
      "renewable": false
    }
  ]
}
```

#### Query Parameters for Materials Endpoint

- `detailed=true` - Return a detailed report
- `includeLifecycleAssessment=true` - Include lifecycle assessment data
- `includeCircularEconomyMetrics=true` - Include circular economy metrics
- `includeBenchmarking=true` - Include benchmarking data
- `includeRegulatoryCompliance=true` - Include regulatory compliance data
- `includeRecommendations=true` - Include recommendations (default: true)
- `includeImplementationDetails=true` - Include implementation details for recommendations

#### Response Format

The API returns a JSON response with sustainability suggestions and metrics:

```json
{
  "success": true,
  "suggestions": [...],
  "metrics": {
    "sustainabilityScore": 65.5,
    "estimatedCarbonSavings": 0.35,
    "improvementAreas": [...]
  },
  "summary": "...",
  "timestamp": "2023-05-10T12:34:56.789Z",
  "reportId": "...",
  "materialAnalysis": {...},
  "transportAnalysis": {...},
  "energyAnalysis": {...},
  "lifecycleAssessment": {...},
  "circularEconomyMetrics": {...},
  "metadata": {...}
}
```

### Materials Endpoint (GET /materials)

Returns a list of cached materials (if available).

#### Query Parameters

- `page=1` - Page number for pagination
- `pageSize=20` - Number of items per page

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 400 Bad Request - Invalid input data
- 404 Not Found - Resource not found
- 500 Internal Server Error - Server-side error

Error responses include:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (in development mode)",
  "metadata": {
    "version": "1.1.0",
    "timestamp": "2023-05-10T12:34:56.789Z",
    "requestId": "..."
  }
}
```

## Next Steps

After verifying that the API is working correctly, you can:

1. Develop a frontend application to interact with the API
2. Extend the API with additional endpoints or features
3. Implement authentication and authorization
4. Deploy the API to a production environment

## License

This project is licensed under the MIT License - see the LICENSE file for details.
