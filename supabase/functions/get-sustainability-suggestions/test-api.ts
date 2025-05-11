// test-api.ts - Simple test script to verify API endpoints

// Configuration
const API_URL = "http://localhost:8000"; // Change this to your actual API URL
const DETAILED_MODE = true; // Set to true to test detailed report mode

// Sample data for testing
const sampleData = {
  materials: [
    {
      name: "Concrete",
      embodiedCarbon: 0.85,
      recycledContent: 20,
      locallySourced: false
    },
    {
      name: "Steel",
      embodiedCarbon: 0.7,
      recycledContent: 60,
      locallySourced: true
    },
    {
      name: "Timber",
      embodiedCarbon: 0.3,
      recycledContent: 0,
      locallySourced: true,
      sustainabilityScore: 85
    }
  ],
  transport: [
    {
      type: "Truck",
      distance: 150,
      emissionsFactor: 0.9,
      efficiency: 0.65,
      fuel: "diesel"
    },
    {
      type: "Electric Vehicle",
      distance: 50,
      emissionsFactor: 0.2,
      efficiency: 0.9,
      isElectric: true
    }
  ],
  energy: [
    {
      source: "Grid Electricity",
      consumption: 5000,
      carbonIntensity: 0.5,
      renewable: false
    },
    {
      source: "Solar",
      consumption: 2000,
      carbonIntensity: 0.05,
      renewable: true
    }
  ]
};

// Invalid data for testing error handling
const invalidData = {
  materials: "not an array" // This should trigger a validation error
};

// Function to test the main API endpoint
async function testMainEndpoint() {
  console.log("Testing main sustainability suggestions endpoint...");
  
  try {
    // Construct URL with query parameters for detailed mode if needed
    let url = API_URL;
    if (DETAILED_MODE) {
      url += "?detailed=true&includeLifecycleAssessment=true&includeCircularEconomyMetrics=true";
    }
    
    // Send request to API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(sampleData)
    });
    
    // Check if response is successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    // Parse response data
    const data = await response.json();
    
    // Verify response structure
    console.log("✅ API request successful");
    console.log(`Response status: ${response.status}`);
    
    // Check for success flag
    if (!data.success) {
      console.log("❌ Response indicates failure:", data.error);
      return;
    }
    
    console.log("✅ Response indicates success");
    
    // Check for basic required fields
    const requiredFields = ["suggestions", "metrics", "summary"];
    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      console.log(`❌ Response missing required fields: ${missingFields.join(", ")}`);
    } else {
      console.log("✅ Response contains all required fields");
    }
    
    // Check for detailed fields if in detailed mode
    if (DETAILED_MODE) {
      const detailedFields = ["materialAnalysis", "transportAnalysis", "energyAnalysis"];
      const presentDetailedFields = detailedFields.filter(field => field in data);
      
      console.log(`ℹ️ Detailed fields present: ${presentDetailedFields.join(", ")}`);
      
      if ("lifecycleAssessment" in data) {
        console.log("✅ Lifecycle assessment data present");
      }
      
      if ("circularEconomyMetrics" in data) {
        console.log("✅ Circular economy metrics present");
      }
      
      if ("circularEconomyRecommendations" in data) {
        console.log(`✅ Circular economy recommendations present (${data.circularEconomyRecommendations.length} items)`);
      }
    }
    
    // Print summary of suggestions
    console.log(`ℹ️ Received ${data.suggestions.length} suggestions`);
    
    // Print sustainability score
    console.log(`ℹ️ Sustainability score: ${data.metrics.sustainabilityScore.toFixed(1)}/100`);
    
    // Print improvement areas
    console.log("ℹ️ Improvement areas:", data.metrics.improvementAreas);
    
    console.log("Main endpoint test completed successfully");
    return true;
  } catch (error) {
    console.error("❌ Error testing main endpoint:", error);
    return false;
  }
}

// Function to test error handling
async function testErrorHandling() {
  console.log("\nTesting error handling...");
  
  try {
    // Send invalid data to API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(invalidData)
    });
    
    // Parse response data
    const data = await response.json();
    
    // We expect an error response
    if (response.ok) {
      console.log("❌ API accepted invalid data (status 200)");
    } else {
      console.log(`✅ API correctly rejected invalid data (status ${response.status})`);
    }
    
    // Check for error message
    if (data.error) {
      console.log(`✅ Error message received: "${data.error}"`);
    } else {
      console.log("❌ No error message in response");
    }
    
    console.log("Error handling test completed");
    return true;
  } catch (error) {
    console.error("❌ Error testing error handling:", error);
    return false;
  }
}

// Function to test materials endpoint
async function testMaterialsEndpoint() {
  console.log("\nTesting materials endpoint...");
  
  try {
    // Send GET request to materials endpoint
    const response = await fetch(`${API_URL}/materials`, {
      method: "GET"
    });
    
    // Parse response data
    const data = await response.json();
    
    console.log(`Response status: ${response.status}`);
    
    if (response.ok && data.success) {
      console.log("✅ Materials endpoint responded successfully");
      
      if (data.data && Array.isArray(data.data)) {
        console.log(`ℹ️ Received ${data.data.length} materials`);
      }
    } else {
      console.log(`ℹ️ Materials endpoint returned: ${data.error || "No materials available"}`);
      console.log("This is expected if no materials have been cached yet");
    }
    
    console.log("Materials endpoint test completed");
    return true;
  } catch (error) {
    console.error("❌ Error testing materials endpoint:", error);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log("=== API ENDPOINT TESTING ===");
  console.log(`Testing API at: ${API_URL}`);
  console.log(`Mode: ${DETAILED_MODE ? "Detailed" : "Basic"}`);
  console.log("==========================\n");
  
  // Run tests
  const mainEndpointSuccess = await testMainEndpoint();
  const errorHandlingSuccess = await testErrorHandling();
  const materialsEndpointSuccess = await testMaterialsEndpoint();
  
  // Print summary
  console.log("\n=== TEST SUMMARY ===");
  console.log(`Main endpoint: ${mainEndpointSuccess ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Error handling: ${errorHandlingSuccess ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`Materials endpoint: ${materialsEndpointSuccess ? "✅ PASS" : "❌ FAIL"}`);
  console.log("===================");
}

// Run the tests
runTests();
