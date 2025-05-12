/**
 * API server implementation for sustainability suggestions
 * 
 * This module handles HTTP requests, input validation, and response generation
 * for the sustainability suggestions API.
 */

import { serve } from 'std/http/server.ts';
import { Status } from 'std/http/http_status.ts';
import { handleCors, corsHeaders, createCache } from './utils.ts';

// Import report generation functions
import {
  generateBasicSustainabilityReport,
  generateDetailedSustainabilityReport,
  calculateDataCompleteness
} from './report-generation.ts';

// Import types
import type { Material, SustainableMaterial } from 'interfaces/material';
import type { TransportItem, SustainableTransport } from 'interfaces/transport';
import type { EnergyItem, SustainableEnergy } from 'interfaces/energy';
import type { 
  Suggestion, 
  SustainabilityMetrics, 
  SustainabilityReport,
  ReportRequestOptions,
  CircularEconomyRecommendation,
  LifecycleCostAnalysis
} from './Report.ts';
import { ReportFormat } from './Report.ts';

// API version
const API_VERSION = "1.1.0";

// Create a cache for material data and calculation results
const materialsCache = createCache<(Material | SustainableMaterial)[]>(60 * 5); // 5 minute cache
const calculationCache = createCache<SustainabilityReport>(60 * 15); // 15 minute cache

// Helper function to paginate arrays
function paginateArray<T>(array: T[], page: number, pageSize: number): { 
  data: T[], 
  total: number, 
  page: number, 
  pageSize: number, 
  totalPages: number 
} {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = array.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: array.length,
    page,
    pageSize,
    totalPages: Math.ceil(array.length / pageSize)
  };
}

// Helper function to generate a cache key
function generateCacheKey(data: Record<string, unknown>): string {
  // Create a simple hash from the stringified data
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 16);
}

// Main server function
export function startServer() {
  return serve(async (req): Promise<Response> => {
    // Handle CORS preflight requests
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Handle GET request for materials (with pagination)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const path = url.pathname;
      
      if (path === '/materials') {
        try {
          // Check if we have cached materials
          const cachedMaterials = materialsCache.get('all_materials');
          if (cachedMaterials) {
            // Parse pagination parameters
            const page = parseInt(url.searchParams.get('page') || '1');
            const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
            
            // Paginate the cached materials
            const paginatedResult = paginateArray(cachedMaterials, page, pageSize);
            
            return new Response(
              JSON.stringify({
                success: true,
                ...paginatedResult,
                metadata: {
                  version: API_VERSION,
                  source: 'cache',
                  timestamp: new Date().toISOString()
                }
              }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: Status.OK
              }
            );
          }
          
          // If not in cache, return an empty response for now
          // In a real implementation, you would load materials from a database
          return new Response(
            JSON.stringify({
              success: false,
              error: "Materials not available",
              metadata: {
                version: API_VERSION,
                timestamp: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: Status.NotFound
            }
          );
        } catch (error) {
          console.error("Error fetching materials:", error);
          return new Response(
            JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : "Unknown error occurred",
              metadata: {
                version: API_VERSION,
                timestamp: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: Status.InternalServerError
            }
          );
        }
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: "Endpoint not found",
          metadata: {
            version: API_VERSION,
            timestamp: new Date().toISOString()
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: Status.NotFound
        }
      );
    }

    try {
      // Parse request body for POST requests
      let body;
      try {
        body = await req.json();
      } catch (parseError) {
        console.error("Error parsing request body:", parseError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid JSON in request body",
            details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
            metadata: {
              version: API_VERSION,
              timestamp: new Date().toISOString()
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: Status.BadRequest
          }
        );
      }
      
      const { materials, transport, energy } = body;

      // Enhanced input validation
      if (!materials && !transport && !energy) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Request must include at least one of: materials, transport, or energy data",
            metadata: {
              version: API_VERSION,
              timestamp: new Date().toISOString()
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: Status.BadRequest
          }
        );
      }
      
      // Validate materials data structure if provided
      if (materials) {
        if (!Array.isArray(materials)) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Materials data must be an array",
              metadata: {
                version: API_VERSION,
                timestamp: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: Status.BadRequest
            }
          );
        }
        
        // Check if materials have required properties
        for (let i = 0; i < materials.length; i++) {
          const material = materials[i];
          if (!material.name || typeof material.name !== 'string') {
            return new Response(
              JSON.stringify({
                success: false,
                error: `Material at index ${i} is missing required 'name' property or it's not a string`,
                metadata: {
                  version: API_VERSION,
                  timestamp: new Date().toISOString()
                }
              }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: Status.BadRequest
              }
            );
          }
        }
      }
      
      // Validate transport data structure if provided
      if (transport) {
        if (!Array.isArray(transport)) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Transport data must be an array",
              metadata: {
                version: API_VERSION,
                timestamp: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: Status.BadRequest
            }
          );
        }
      }
      
      // Validate energy data structure if provided
      if (energy) {
        if (!Array.isArray(energy)) {
          return new Response(
            JSON.stringify({
              success: false,
              error: "Energy data must be an array",
              metadata: {
                version: API_VERSION,
                timestamp: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: Status.BadRequest
            }
          );
        }
      }

      console.log('Request received:', { 
        materialsCount: materials?.length || 0,
        transportCount: transport?.length || 0,
        energyCount: energy?.length || 0
      });

      // Check report format options
      const url = new URL(req.url);
      const detailed = url.searchParams.get('detailed') === 'true';
      const format = url.searchParams.get('format') as ReportFormat || 
                    (detailed ? ReportFormat.DETAILED : ReportFormat.BASIC);
      
      // Parse additional report options
      const reportOptions: ReportRequestOptions = {
        format,
        includeLifecycleAssessment: url.searchParams.get('includeLifecycleAssessment') === 'true',
        includeCircularEconomyMetrics: url.searchParams.get('includeCircularEconomyMetrics') === 'true',
        includeBenchmarking: url.searchParams.get('includeBenchmarking') === 'true',
        includeRegulatoryCompliance: url.searchParams.get('includeRegulatoryCompliance') === 'true',
        includeRecommendations: url.searchParams.get('includeRecommendations') !== 'false', // Default to true
        includeImplementationDetails: url.searchParams.get('includeImplementationDetails') === 'true'
      };
      
      // Generate a cache key based on the request data and options
      const cacheKey = generateCacheKey({ materials, transport, energy, reportOptions });
      
      // Check if we have a cached result
      const cachedResult = calculationCache.get(cacheKey);
      if (cachedResult) {
        console.log('Returning cached result for key:', cacheKey);
        return new Response(
          JSON.stringify({
            ...cachedResult,
            metadata: {
              ...cachedResult.metadata,
              source: 'cache',
              timestamp: new Date().toISOString()
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: Status.OK
          }
        );
      }
      
      // Start timing for performance measurement
      const startTime = performance.now();
      
      // Process in smaller batches if there are many materials
      const processMaterials = (materials && materials.length > 50) 
        ? async () => {
            const batchSize = 50;
            const batches = Math.ceil(materials.length / batchSize);
            let processedMaterials: (Material | SustainableMaterial)[] = [];
            
            for (let i = 0; i < batches; i++) {
              const start = i * batchSize;
              const end = Math.min(start + batchSize, materials.length);
              const batch = materials.slice(start, end);
              
              // Process this batch
              const batchResults = await Promise.all(batch.map((material) => {
                // Perform any heavy calculations on individual materials here
                return material;
              }));
              
              processedMaterials = [...processedMaterials, ...batchResults];
            }
            
            return processedMaterials;
          }
        : () => materials;
      
      // Process materials in batches
      const processedMaterials = await processMaterials();
      
      // Generate the appropriate report based on the format
      let report: SustainabilityReport;
      
      if (detailed || format !== ReportFormat.BASIC) {
        // Generate detailed sustainability report
        report = generateDetailedSustainabilityReport(
          {
            materials: processedMaterials,
            transport,
            energy
          },
          reportOptions
        );
        
        // Add metadata to the report
        report.metadata = {
          version: API_VERSION,
          requestId: crypto.randomUUID(),
          processingTime: performance.now() - startTime,
          requestType: 'detailed',
          reportFormat: format,
          reportOptions,
          dataQuality: {
            completeness: calculateDataCompleteness({ materials: processedMaterials, transport, energy }),
            accuracy: 0.85,
            consistency: 0.9
          },
          calculationModels: [
            "Material Carbon Footprint",
            "Transport Emissions",
            "Energy Consumption",
            "Lifecycle Assessment",
            "Circular Economy Metrics"
          ],
          generatedAt: new Date().toISOString()
        };
      } else {
        // Generate basic sustainability report
        report = generateBasicSustainabilityReport({
          materials: processedMaterials,
          transport,
          energy
        });
        
        // Add metadata to the report
        report.metadata = {
          version: API_VERSION,
          requestId: crypto.randomUUID(),
          processingTime: performance.now() - startTime,
          requestType: 'basic',
          generatedAt: new Date().toISOString()
        };
      }
      
      // Cache the result
      calculationCache.set(cacheKey, report);
      
      // Return the response
      return new Response(
        JSON.stringify(report),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: Status.OK
        }
      );
    } catch (error) {
      console.error("Error generating sustainability suggestions:", error);
      
      // Determine the appropriate status code based on the error
      let statusCode = Status.InternalServerError;
      let errorMessage = "An unexpected error occurred while processing your request";
      let errorDetails: string | null = null;
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check for specific error types to provide better responses
        if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
          statusCode = Status.TooManyRequests;
          errorMessage = "Rate limit exceeded. Please try again later.";
        } else if (errorMessage.includes("permission") || errorMessage.includes("access")) {
          statusCode = Status.Forbidden;
          errorMessage = "You don't have permission to access this resource";
        } else if (errorMessage.includes("not found") || errorMessage.includes("missing")) {
          statusCode = Status.NotFound;
          errorMessage = "The requested resource was not found";
        } else if (errorMessage.includes("invalid") || errorMessage.includes("malformed")) {
          statusCode = Status.BadRequest;
          errorMessage = "Invalid request parameters";
        }
        
        // Include stack trace in development environments
        if (Deno.env.get("ENVIRONMENT") === "development" && error.stack) {
          errorDetails = error.stack;
        }
      }
      
      return new Response(
        JSON.stringify({
          success: false,
          error: errorMessage,
          details: errorDetails,
          metadata: {
            version: API_VERSION,
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID()
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: statusCode
        }
      );
    }
  });
}
