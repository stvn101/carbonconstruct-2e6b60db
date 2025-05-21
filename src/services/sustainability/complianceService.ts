
/**
 * Compliance Services
 * Handles sustainability compliance checks for standards like NCC and NABERS
 */
import { supabase } from "@/integrations/supabase/client";
import { MaterialInput, EnergyInput } from "@/lib/carbonExports";

/**
 * Gets sustainability compliance status for a project
 */
export async function checkSustainabilityCompliance(projectId: string): Promise<{
  ncc: { compliant: boolean; details?: any };
  nabers: { rating: number; compliant: boolean; details?: any };
}> {
  try {
    // Get the project details
    const { data: project, error } = await supabase
      .from('projects')
      .select('materials, energy, transport')
      .eq('id', projectId)
      .single();
      
    if (error) throw error;
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Call the sustainability service functions
    const { fetchNccComplianceCheck, fetchNabersComplianceCheck } = await import(
      '@/hooks/sustainability/sustainabilityService'
    );
    
    // Properly cast JSON data to expected types
    const materials = project.materials ? (project.materials as unknown as MaterialInput[]) : [];
    const energy = project.energy ? (project.energy as unknown as EnergyInput[]) : [];
    
    // Run the compliance checks with properly typed data
    const nccCompliance = await fetchNccComplianceCheck(materials, { includeDetails: true });
    const nabersCompliance = await fetchNabersComplianceCheck(energy, { targetRating: 5 });
    
    return {
      ncc: nccCompliance,
      nabers: nabersCompliance
    };
  } catch (error) {
    console.error('Error checking sustainability compliance:', error);
    return {
      ncc: { compliant: false },
      nabers: { rating: 0, compliant: false }
    };
  }
}
