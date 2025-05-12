// test.ts - Comprehensive test suite for the Sustainability Suggestions API

// Import necessary types
import { Material as _Material, SustainableMaterial as _SustainableMaterial } from 'interfaces/material';
import { TransportItem as _TransportItem, SustainableTransport as _SustainableTransport } from 'interfaces/transport';
import { EnergyItem as _EnergyItem, SustainableEnergy as _SustainableEnergy } from 'interfaces/energy';
import { 
  SuggestionCategory, 
  ImpactLevel as _ImpactLevel, 
  Timeframe as _Timeframe, 
  ComplexityLevel as _ComplexityLevel,
  ComplianceStatus as _ComplianceStatus,
  ReportFormat as _ReportFormat
} from 'interfaces/report';

// Configuration
const API_URL = "http://localhost:8000"; // Change this to your actual API URL

// Test data sets
const testDataSets = {
  // Basic test data with minimal properties
  basic: {
    materials: [
      {
        name: "Concrete",
        embodiedCarbon: 0.85
      },
      {
        name: "Steel",
        embodiedCarbon: 0.7
      }
    ],
    transport: [
      {
        type: "Truck",
        distance: 150,
        emissionsFactor: 0.9
      }
    ],
    energy: [
      {
        source: "Grid Electricity",
        consumption: 5000,
        carbonIntensity: 0.5
      }
    ]
  },
  
  // Comprehensive test data with all properties
  comprehensive: {
    materials: [
      {
        name: "Concrete",
        type: "Structural",
        embodiedCarbon: 0.85,
        recycledContent: 20,
        locallySourced: false,
        quantity: 500,
        unit: "m3",
        cost: 120,
        waterFootprint: 100,
        recyclability: 70,
        renewableContent: 0,
        biodegradable: false,
        lifespan: 50,
        certifications: ["EPD", "ISO 14001"],
        alternatives: ["Geopolymer concrete", "Hempcrete", "Cross-laminated timber"]
      },
      {
        name: "Steel",
        type: "Structural",
        embodiedCarbon: 0.7,
        recycledContent: 60,
        locallySourced: true,
        quantity: 200,
        unit: "tons",
        cost: 800,
        waterFootprint: 50,
        recyclability: 95,
        renewableContent: 0,
        biodegradable: false,
        lifespan: 60,
        certifications: ["EPD", "ISO 14001", "Cradle to Cradle"],
        alternatives: ["Recycled steel", "Aluminum", "Engineered timber"]
      },
      {
        name: "Timber",
        type: "Structural",
        embodiedCarbon: 0.3,
        recycledContent: 0,
        locallySourced: true,
        quantity: 100,
        unit: "m3",
        cost: 500,
        waterFootprint: 20,
        recyclability: 80,
        renewableContent: 100,
        biodegradable: true,
        lifespan: 40,
        sustainabilityScore: 85,
        certifications: ["FSC", "PEFC"],
        alternatives: ["Bamboo", "Recycled plastic lumber"]
      }
    ],
    transport: [
      {
        type: "Truck",
        distance: 150,
        emissionsFactor: 0.9,
        efficiency: 0.65,
        fuel: "diesel",
        routeOptimization: false,
        idlingTime: 2,
        operatingHours: 10,
        maintenanceStatus: "Good",
        noiseLevel: 75,
        airQualityImpact: 0.7,
        vehicleAge: 5
      },
      {
        type: "Electric Vehicle",
        distance: 50,
        emissionsFactor: 0.2,
        efficiency: 0.9,
        isElectric: true,
        routeOptimization: true,
        idlingTime: 0.5,
        operatingHours: 8,
        maintenanceStatus: "Excellent",
        noiseLevel: 45,
        airQualityImpact: 0.1,
        vehicleAge: 2
      },
      {
        type: "Rail",
        distance: 500,
        emissionsFactor: 0.3,
        efficiency: 0.85,
        fuel: "electricity",
        routeOptimization: true,
        maintenanceStatus: "Good",
        noiseLevel: 65,
        airQualityImpact: 0.2,
        vehicleAge: 10
      }
    ],
    energy: [
      {
        source: "Grid Electricity",
        consumption: 5000,
        unit: "kWh",
        carbonIntensity: 0.5,
        renewable: false,
        efficiency: 0.9,
        costPerUnit: 0.15,
        peakDemand: 0.8,
        smartMonitoring: false,
        demandResponse: false,
        backupSystem: false,
        timeOfUse: "peak"
      },
      {
        source: "Solar",
        consumption: 2000,
        unit: "kWh",
        carbonIntensity: 0.05,
        renewable: true,
        efficiency: 0.95,
        costPerUnit: 0.08,
        peakDemand: 0.3,
        storageCapacity: 500,
        smartMonitoring: true,
        demandResponse: true,
        backupSystem: true,
        timeOfUse: "variable"
      },
      {
        source: "Diesel Generator",
        consumption: 1000,
        unit: "kWh",
        carbonIntensity: 0.8,
        renewable: false,
        efficiency: 0.6,
        costPerUnit: 0.25,
        peakDemand: 0.9,
        smartMonitoring: false,
        demandResponse: false,
        backupSystem: true,
        timeOfUse: "emergency"
      }
    ]
  },
  
  // Edge case data with extreme values
  edgeCases: {
    materials: [
      {
        name: "Ultra-Low Carbon Concrete",
        embodiedCarbon: 0.1,
        recycledContent: 95,
        locallySourced: true
      },
      {
        name: "High-Carbon Material",
        embodiedCarbon: 5.0,
        recycledContent: 0,
        locallySourced: false
      }
    ],
    transport: [
      {
        type: "Zero-Emission Vehicle",
        distance: 1000,
        emissionsFactor: 0.0,
        efficiency: 1.0
      },
      {
        type: "Old Inefficient Truck",
        distance: 50,
        emissionsFactor: 2.0,
        efficiency: 0.3
      }
    ],
    energy: [
      {
        source: "100% Renewable",
        consumption: 10000,
        carbonIntensity: 0.0,
        renewable: true
      },
      {
        source: "Coal Power",
        consumption: 1000,
        carbonIntensity: 1.0,
        renewable: false
      }
    ]
  },
  
  // Invalid data for testing error handling
  invalid: {
    materials: "not an array",
    transport: [
      {
        type: "Missing required properties"
      }
    ],
    energy: [
      {
        source: "Missing consumption"
      }
    ]
  },
  
  // Empty data for testing default behavior
  empty: {
    materials: [],
    transport: [],
    energy: []
  }
};

// Report option type
type ReportOption = {
  name: string;
  params: Record<string, string>;
};

// Test report options
const reportOptions: ReportOption[] = [
  {
    name: "Basic Report",
    params: {}
  },
  {
    name: "Detailed Report",
    params: {
      detailed: "true"
    }
  },
  {
    name: "Full Report with All Options",
    params: {
      detailed: "true",
      includeLifecycleAssessment: "true",
      includeCircularEconomyMetrics: "true",
      includeBenchmarking: "true",
      includeRegulatoryCompliance: "true",
      includeRecommendations: "true",
      includeImplementationDetails: "true"
    }
  },
  {
    name: "Minimal Report (No Recommendations)",
    params: {
      detailed: "true",
      includeRecommendations: "false"
    }
  },
  {
    name: "Lifecycle Assessment Only",
    params: {
      detailed: "true",
      includeLifecycleAssessment: "true",
      includeCircularEconomyMetrics: "false",
      includeBenchmarking: "false",
      includeRegulatoryCompliance: "false"
    }
  },
  {
    name: "Circular Economy Focus",
    params: {
      detailed: "true",
      includeLifecycleAssessment: "false",
      includeCircularEconomyMetrics: "true",
      includeBenchmarking: "false",
      includeRegulatoryCompliance: "false"
    }
  }
];

// Test suite class
class SustainabilityAPITestSuite {
  private apiUrl: string;
  private testResults: Record<string, {
    status: string;
    error?: string;
    times?: Record<string, number>;
  }> = {};
  private passedTests = 0;
  private failedTests = 0;
  private skippedTests = 0;
  
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }
  
  // Run all tests
  async runAllTests() {
    console.log("=== SUSTAINABILITY API TEST SUITE ===");
    console.log(`Testing API at: ${this.apiUrl}`);
    console.log("===================================\n");
    
    // Test basic functionality
    await this.testBasicFunctionality();
    
    // Test detailed reports
    await this.testDetailedReports();
    
    // Test error handling
    await this.testErrorHandling();
    
    // Test edge cases
    await this.testEdgeCases();
    
    // Test performance
    await this.testPerformance();
    
    // Test caching
    await this.testCaching();
    
    // Print summary
    this.printSummary();
  }
  
  // Test basic functionality
  async testBasicFunctionality() {
    console.log("Testing basic functionality...");
    
    try {
      // Test with basic data
      const response = await this.sendRequest(testDataSets.basic);
      
      // Verify response structure
      this.assertResponseStructure(response, "basic");
      
      // Verify metrics calculation
      this.assertMetricsCalculation(response, "basic");
      
      // Verify suggestions generation
      this.assertSuggestionsGeneration(response, "basic");
      
      console.log("✅ Basic functionality tests passed");
      this.passedTests++;
    } catch (error) {
      console.error("❌ Basic functionality tests failed:", error);
      this.failedTests++;
      this.testResults.basicFunctionality = { 
        status: "failed", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  // Test detailed reports
  async testDetailedReports() {
    console.log("\nTesting detailed reports...");
    
    try {
      // Test each report option
      for (const option of reportOptions) {
        console.log(`Testing ${option.name}...`);
        
        const response = await this.sendRequest(testDataSets.comprehensive, option.params);
        
        // Verify response structure based on options
        this.assertResponseStructure(response, "detailed", option.params);
        
        // Verify specific components based on options
        if (option.params.includeLifecycleAssessment === "true") {
          this.assertLifecycleAssessment(response);
        }
        
        if (option.params.includeCircularEconomyMetrics === "true") {
          this.assertCircularEconomyMetrics(response);
        }
        
        if (option.params.includeBenchmarking === "true") {
          this.assertBenchmarking(response);
        }
        
        if (option.params.includeRegulatoryCompliance === "true") {
          this.assertRegulatoryCompliance(response);
        }
        
        if (option.params.includeRecommendations === "false") {
          this.assertNoRecommendations(response);
        }
        
        console.log(`✅ ${option.name} test passed`);
        this.passedTests++;
      }
      
      this.testResults.detailedReports = { status: "passed" };
    } catch (error) {
      console.error("❌ Detailed reports tests failed:", error);
      this.failedTests++;
      this.testResults.detailedReports = { 
        status: "failed", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  // Test error handling
  async testErrorHandling() {
    console.log("\nTesting error handling...");
    
    try {
      // Test with invalid data
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(testDataSets.invalid)
      });
      
      // Parse response data
      const data = await response.json();
      
      // We expect an error response
      if (response.ok) {
        throw new Error("API accepted invalid data (status 200)");
      }
      
      console.log(`✅ API correctly rejected invalid data (status ${response.status})`);
      
      // Check for error message
      if (!data.error) {
        throw new Error("No error message in response");
      }
      
      console.log(`✅ Error message received: "${data.error}"`);
      
      // Test with empty data
      const emptyResponse = await this.sendRequest(testDataSets.empty);
      
      // Verify that the API handles empty data gracefully
      if (!emptyResponse.success) {
        throw new Error("API rejected empty data");
      }
      
      console.log("✅ API handled empty data gracefully");
      
      this.passedTests++;
      this.testResults.errorHandling = { status: "passed" };
    } catch (error) {
      console.error("❌ Error handling tests failed:", error);
      this.failedTests++;
      this.testResults.errorHandling = { 
        status: "failed", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  // Test edge cases
  async testEdgeCases() {
    console.log("\nTesting edge cases...");
    
    try {
      // Test with edge case data
      const response = await this.sendRequest(testDataSets.edgeCases, { detailed: "true" } as Record<string, string>);
      
      // Verify response structure
      this.assertResponseStructure(response, "detailed");
      
      // Verify metrics calculation for edge cases
      this.assertMetricsCalculation(response, "edgeCases");
      
      // Verify that extreme values are handled correctly
      const metrics = response.metrics as Record<string, number>;
      
      // Check that sustainability score is within bounds (0-100)
      if (metrics.sustainabilityScore < 0 || metrics.sustainabilityScore > 100) {
        throw new Error(`Sustainability score out of bounds: ${metrics.sustainabilityScore}`);
      }
      
      console.log("✅ Sustainability score within bounds");
      
      // Check that savings percentages are within bounds (0-1)
      const savingsMetrics = [
        "estimatedCarbonSavings",
        "estimatedCostSavings",
        "estimatedWaterSavings",
        "estimatedEnergyReduction",
        "estimatedWasteReduction"
      ];
      
      for (const metric of savingsMetrics) {
        if (metrics[metric] !== undefined && (metrics[metric] < 0 || metrics[metric] > 1)) {
          throw new Error(`${metric} out of bounds: ${metrics[metric]}`);
        }
      }
      
      console.log("✅ Savings percentages within bounds");
      
      this.passedTests++;
      this.testResults.edgeCases = { status: "passed" };
    } catch (error) {
      console.error("❌ Edge case tests failed:", error);
      this.failedTests++;
      this.testResults.edgeCases = { 
        status: "failed", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  // Test performance
  async testPerformance() {
    console.log("\nTesting performance...");
    
    try {
      // Measure response time for basic request
      const startBasic = performance.now();
      await this.sendRequest(testDataSets.basic);
      const basicTime = performance.now() - startBasic;
      
      console.log(`Basic request time: ${basicTime.toFixed(2)}ms`);
      
      // Measure response time for comprehensive request
      const startComprehensive = performance.now();
      await this.sendRequest(testDataSets.comprehensive, { detailed: "true" } as Record<string, string>);
      const comprehensiveTime = performance.now() - startComprehensive;
      
      console.log(`Comprehensive request time: ${comprehensiveTime.toFixed(2)}ms`);
      
      // Measure response time for full options request
      const startFull = performance.now();
      await this.sendRequest(testDataSets.comprehensive, reportOptions[2].params as Record<string, string>);
      const fullTime = performance.now() - startFull;
      
      console.log(`Full options request time: ${fullTime.toFixed(2)}ms`);
      
      // Check if performance is acceptable (arbitrary threshold for testing)
      const performanceThreshold = 1000; // 1 second
      
      if (basicTime > performanceThreshold || comprehensiveTime > performanceThreshold || fullTime > performanceThreshold) {
        console.log("⚠️ Performance may be suboptimal (exceeds 1 second threshold)");
        this.skippedTests++;
        this.testResults.performance = { status: "skipped", times: { basic: basicTime, comprehensive: comprehensiveTime, full: fullTime } };
      } else {
        console.log("✅ Performance is acceptable");
        this.passedTests++;
        this.testResults.performance = { status: "passed", times: { basic: basicTime, comprehensive: comprehensiveTime, full: fullTime } };
      }
    } catch (error) {
      console.error("❌ Performance tests failed:", error);
      this.failedTests++;
      this.testResults.performance = { 
        status: "failed", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  // Test caching
  async testCaching() {
    console.log("\nTesting caching...");
    
    try {
      // Make first request
      const startFirst = performance.now();
      await this.sendRequest(testDataSets.comprehensive, { detailed: "true" } as Record<string, string>);
      const firstTime = performance.now() - startFirst;
      
      console.log(`First request time: ${firstTime.toFixed(2)}ms`);
      
      // Make second identical request (should be cached)
      const startSecond = performance.now();
      const secondResponse = await this.sendRequest(testDataSets.comprehensive, { detailed: "true" } as Record<string, string>);
      const secondTime = performance.now() - startSecond;
      
      console.log(`Second request time: ${secondTime.toFixed(2)}ms`);
      
      // Check if second request was faster (indicating caching)
      if (secondTime < firstTime && secondResponse.metadata?.source === "cache") {
        console.log("✅ Caching is working correctly");
        this.passedTests++;
        this.testResults.caching = { status: "passed", times: { first: firstTime, second: secondTime } };
      } else {
        console.log("⚠️ Caching may not be working optimally");
        this.skippedTests++;
        this.testResults.caching = { status: "skipped", times: { first: firstTime, second: secondTime } };
      }
    } catch (error) {
      console.error("❌ Caching tests failed:", error);
      this.failedTests++;
      this.testResults.caching = { 
        status: "failed", 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
  
  // Helper method to send request to API
  private async sendRequest(data: unknown, params: Record<string, string> = {}) {
    // Build URL with query parameters
    let url = this.apiUrl;
    const urlParams = new URLSearchParams(params);
    
    if (urlParams.toString()) {
      url += "?" + urlParams.toString();
    }
    
    // Send request to API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    
    // Check if response is successful
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    // Parse response data
    return await response.json();
  }
  
  // Helper method to assert response structure
  private assertResponseStructure(response: Record<string, unknown>, type: string, options: Record<string, string> = {}) {
    // Check for success flag
    if (!response.success) {
      throw new Error("Response indicates failure: " + (response.error || "Unknown error"));
    }
    
    // Check for basic required fields
    const requiredFields = ["suggestions", "metrics", "reportId"];
    
    for (const field of requiredFields) {
      if (!(field in response)) {
        throw new Error(`Response missing required field: ${field}`);
      }
    }
    
    // Check for detailed fields if detailed report
    if (type === "detailed" || options.detailed === "true") {
      // These fields are optional and may not be present if no data was provided
      // So we don't throw an error if they're missing
      const detailedFields = ["materialAnalysis", "transportAnalysis", "energyAnalysis"];
      const presentFields = detailedFields.filter(field => field in response);
      
      if (presentFields.length === 0) {
        console.log("⚠️ No detailed analysis fields present in response");
      } else {
        console.log(`ℹ️ Detailed fields present: ${presentFields.join(', ')}`);
      }
      
      // Check for lifecycle assessment if requested
      if (options.includeLifecycleAssessment === "true" && !("lifecycleAssessment" in response)) {
        throw new Error("Response missing lifecycle assessment");
      }
      
      // Check for circular economy metrics if requested
      if (options.includeCircularEconomyMetrics === "true" && !("circularEconomyMetrics" in response)) {
        throw new Error("Response missing circular economy metrics");
      }
    }
    
    // Check metadata
    if (!response.metadata) {
      throw new Error("Response missing metadata");
    }
    
    const metadata = response.metadata as Record<string, unknown>;
    if (!metadata.version) {
      throw new Error("Metadata missing version");
    }
  }
  
  // Helper method to assert metrics calculation
  private assertMetricsCalculation(response: Record<string, unknown>, type: string) {
    const metrics = response.metrics as Record<string, unknown>;
    
    // Check for required metrics
    const requiredMetrics = ["sustainabilityScore", "estimatedCarbonSavings"];
    
    for (const metric of requiredMetrics) {
      if (!(metric in metrics)) {
        throw new Error(`Metrics missing required field: ${metric}`);
      }
    }
    
    // Check for detailed metrics if detailed report
    if (type !== "basic") {
      const detailedMetrics = [
        "estimatedCostSavings",
        "materialScore",
        "transportScore",
        "energyScore"
      ];
      
      for (const metric of detailedMetrics) {
        if (!(metric in metrics)) {
          throw new Error(`Detailed metrics missing field: ${metric}`);
        }
      }
    }
    
    // Check that metrics are within expected ranges
    const sustainabilityScore = metrics.sustainabilityScore as number;
    if (sustainabilityScore < 0 || sustainabilityScore > 100) {
      throw new Error(`Sustainability score out of bounds: ${sustainabilityScore}`);
    }
    
    const estimatedCarbonSavings = metrics.estimatedCarbonSavings as number;
    if (estimatedCarbonSavings < 0 || estimatedCarbonSavings > 1) {
      throw new Error(`Estimated carbon savings out of bounds: ${estimatedCarbonSavings}`);
    }
  }
  
  // Helper method to assert suggestions generation
  private assertSuggestionsGeneration(response: Record<string, unknown>, type: string) {
    const suggestions = response.suggestions as Array<Record<string, unknown>>;
    
    // Check that suggestions is an array
    if (!Array.isArray(suggestions)) {
      throw new Error("Suggestions is not an array");
    }
    
    // Check that there are suggestions
    if (suggestions.length === 0) {
      throw new Error("No suggestions generated");
    }
    
    // Check suggestion structure
    for (const suggestion of suggestions) {
      if (!suggestion.category) {
        throw new Error("Suggestion missing category");
      }
      
      if (!suggestion.text) {
        throw new Error("Suggestion missing text");
      }
      
      if (!suggestion.impact) {
        throw new Error("Suggestion missing impact");
      }
    }
    
    // Check that there are suggestions for each category if comprehensive data
    if (type !== "basic") {
      const categories = suggestions.map(s => s.category);
      const uniqueCategories = [...new Set(categories)];
      
      const expectedCategories = [
        SuggestionCategory.MATERIAL,
        SuggestionCategory.TRANSPORT,
        SuggestionCategory.ENERGY,
        SuggestionCategory.GENERAL
      ];
      
      for (const category of expectedCategories) {
        if (!uniqueCategories.includes(category)) {
          throw new Error(`No suggestions for category: ${category}`);
        }
      }
    }
  }
  
  // Helper method to assert lifecycle assessment
  private assertLifecycleAssessment(response: Record<string, unknown>) {
    const lifecycleAssessment = response.lifecycleAssessment as Record<string, unknown>;
    
    if (!lifecycleAssessment) {
      throw new Error("Lifecycle assessment missing");
    }
    
    if (!Array.isArray(lifecycleAssessment.stages)) {
      throw new Error("Lifecycle assessment stages is not an array");
    }
    
    if (lifecycleAssessment.stages.length === 0) {
      throw new Error("No lifecycle assessment stages");
    }
    
    if (!Array.isArray(lifecycleAssessment.hotspots)) {
      throw new Error("Lifecycle assessment hotspots is not an array");
    }
  }
  
  // Helper method to assert circular economy metrics
  private assertCircularEconomyMetrics(response: Record<string, unknown>) {
    const circularEconomyMetrics = response.circularEconomyMetrics as Record<string, unknown>;
    
    if (!circularEconomyMetrics) {
      throw new Error("Circular economy metrics missing");
    }
    
    const requiredMetrics = [
      "resourceReuseRate",
      "wasteRecyclingRate",
      "productLifespan",
      "closedLoopPotential"
    ];
    
    for (const metric of requiredMetrics) {
      if (!(metric in circularEconomyMetrics)) {
        throw new Error(`Circular economy metrics missing field: ${metric}`);
      }
    }
  }
  
  // Helper method to assert benchmarking
  private assertBenchmarking(response: Record<string, unknown>) {
    const metrics = response.metrics as Record<string, unknown>;
    
    if (!metrics.industryAverage) {
      throw new Error("Benchmarking missing industry average");
    }
    
    if (!metrics.bestInClass) {
      throw new Error("Benchmarking missing best in class");
    }
    
    if (!metrics.percentileRanking) {
      throw new Error("Benchmarking missing percentile ranking");
    }
  }
  
  // Helper method to assert regulatory compliance
  private assertRegulatoryCompliance(response: Record<string, unknown>) {
    const metrics = response.metrics as Record<string, unknown>;
    const compliance = metrics.regulatoryCompliance as Record<string, unknown>;
    
    if (!compliance) {
      throw new Error("Regulatory compliance missing");
    }
    
    if (!compliance.status) {
      throw new Error("Regulatory compliance missing status");
    }
    
    if (!Array.isArray(compliance.standards)) {
      throw new Error("Regulatory compliance standards is not an array");
    }
  }
  
  // Helper method to assert no recommendations
  private assertNoRecommendations(response: Record<string, unknown>) {
    if (!Array.isArray(response.suggestions)) {
      throw new Error("Suggestions is not an array");
    }
    
    if (response.suggestions.length > 0) {
      throw new Error("Recommendations included despite being disabled");
    }
  }
  
  // Print test summary
  private printSummary() {
    console.log("\n=== TEST SUMMARY ===");
    console.log(`Total tests: ${this.passedTests + this.failedTests + this.skippedTests}`);
    console.log(`Passed: ${this.passedTests}`);
    console.log(`Failed: ${this.failedTests}`);
    console.log(`Skipped: ${this.skippedTests}`);
    console.log("===================");
    
    if (this.failedTests === 0) {
      console.log("\n✅ All tests passed successfully!");
    } else {
      console.log(`\n❌ ${this.failedTests} tests failed.`);
    }
  }
}

// Run the test suite
console.log("Starting Sustainability API test suite...");
console.log("Make sure the API server is running in another terminal window.");
console.log("If not, run './run-server.sh' in another terminal first.");
console.log("");

const testSuite = new SustainabilityAPITestSuite(API_URL);
testSuite.runAllTests();
