
import { useState } from "react";
import { MaterialInput, EnergyInput } from "@/lib/carbonExports";
import { fetchNccComplianceCheck, fetchNabersComplianceCheck } from "@/hooks/sustainability/sustainabilityService";
import { toast } from "sonner";
import { ComplianceData } from "@/components/sustainability/types";

export const useComplianceChecks = () => {
  const [nccCompliance, setNccCompliance] = useState<ComplianceData | null>(null);
  const [nabersCompliance, setNabersCompliance] = useState<ComplianceData | null>(null);
  const [isLoadingCompliance, setIsLoadingCompliance] = useState(false);

  const runComplianceChecks = async (materials: MaterialInput[], energy: any) => {
    setIsLoadingCompliance(true);
    
    try {
      // Run NCC compliance check
      const nccResult = await fetchNccComplianceCheck(materials, { includeDetails: true });
      setNccCompliance(nccResult);
      
      // Run NABERS compliance check
      const nabersResult = await fetchNabersComplianceCheck(energy, { targetRating: 5 });
      setNabersCompliance(nabersResult);
      
      toast.success("Compliance check complete", {
        description: "Project analyzed against NCC 2025 and NABERS standards."
      });
    } catch (err) {
      console.error("Error running compliance checks:", err);
      toast.error("Compliance check failed", {
        description: "Could not analyze your project. Please try again later."
      });
    } finally {
      setIsLoadingCompliance(false);
    }
  };

  return {
    nccCompliance,
    nabersCompliance,
    isLoadingCompliance,
    runComplianceChecks
  };
};
