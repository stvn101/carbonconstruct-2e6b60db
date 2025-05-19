
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Material } from "./Material.ts";
import { TransportItem } from "./Transport.ts";
import { EnergyItem } from "./Energy.ts";
import { 
  generateBasicSustainabilityReport, 
  generateDetailedSustainabilityReport, 
  calculateDataCompleteness 
} from "./report-generation.ts";
import { ReportRequestOptions, SustainabilityReport, ReportFormat } from "./Report.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main server handler
export function startServer() {
  serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const { materials, transport, energy, options } = await req.json();
      console.log("Received sustainability suggestions request");
      
      // Validate data
      const materialData = validateMaterials(materials || []);
      const transportData = validateTransport(transport || []);
      const energyData = validateEnergy(energy || []);
      
      // Check if we have enough data to generate a report
      const completenessScore = calculateDataCompleteness(
        materialData, 
        transportData, 
        energyData
      );
      
      if (completenessScore < 30) {
        return new Response(
          JSON.stringify({ 
            error: "Insufficient data to generate meaningful sustainability suggestions",
            completenessScore,
            suggestionsCount: 0
          }), 
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400 
          }
        );
      }
      
      // Generate the appropriate report based on options
      let report: SustainabilityReport;
      const reportOptions: ReportRequestOptions = {
        format: (options?.format as ReportFormat) || ReportFormat.BASIC,
        includeLifecycleAnalysis: options?.includeLifecycleAnalysis || false,
        includeCircularEconomy: options?.includeCircularEconomy || false,
        includeComplianceDetails: options?.includeComplianceDetails || false,
        includeImplementationRoadmap: options?.includeImplementationRoadmap || false
      };
      
      if (reportOptions.format === ReportFormat.BASIC) {
        report = generateBasicSustainabilityReport(materialData, transportData, energyData);
      } else {
        report = generateDetailedSustainabilityReport(materialData, transportData, energyData, reportOptions);
      }
      
      // Add project info if provided
      if (options?.projectId) {
        report.projectId = options.projectId;
      }
      
      if (options?.projectName) {
        report.projectName = options.projectName;
      }
      
      console.log(`Generated report with ${report.suggestions.length} suggestions`);
      
      return new Response(
        JSON.stringify({ 
          report,
          completenessScore,
          suggestionsCount: report.suggestions.length
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (error) {
      console.error("Error generating sustainability suggestions:", error);
      
      return new Response(
        JSON.stringify({ 
          error: error.message || "Failed to generate sustainability suggestions",
          completenessScore: 0,
          suggestionsCount: 0
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }
  });
}

// Validate and convert material data
function validateMaterials(materials: any[]): Material[] {
  if (!Array.isArray(materials)) return [];
  
  return materials
    .filter(m => m && typeof m === 'object' && m.name)
    .map((m, index) => ({
      id: m.id || `material-${index}`,
      name: String(m.name),
      category: m.category || 'other',
      carbonFootprint: parseFloat(m.carbonFootprint) || parseFloat(m.factor) || 1,
      unit: m.unit || 'kg',
      recyclable: Boolean(m.recyclable),
      recycledContent: m.recycledContent ? parseFloat(m.recycledContent) : undefined,
      locallySourced: m.locallySourced ? Boolean(m.locallySourced) : undefined,
      quantity: m.quantity ? parseFloat(m.quantity) : 1
    }));
}

// Validate and convert transport data
function validateTransport(transport: any[]): TransportItem[] {
  if (!Array.isArray(transport)) return [];
  
  return transport
    .filter(t => t && typeof t === 'object' && t.distance)
    .map((t, index) => ({
      id: t.id || `transport-${index}`,
      type: t.type || 'road',
      distance: parseFloat(t.distance),
      weight: parseFloat(t.weight) || 1,
      fuelType: t.fuelType || 'diesel',
      emissionsFactor: parseFloat(t.emissionsFactor) || 0.1
    }));
}

// Validate and convert energy data
function validateEnergy(energy: any[]): EnergyItem[] {
  if (!Array.isArray(energy)) return [];
  
  return energy
    .filter(e => e && typeof e === 'object' && e.quantity)
    .map((e, index) => ({
      id: e.id || `energy-${index}`,
      source: e.source || 'grid',
      quantity: parseFloat(e.quantity),
      unit: e.unit || 'kwh',
      emissionsFactor: parseFloat(e.emissionsFactor) || 0.5
    }));
}
