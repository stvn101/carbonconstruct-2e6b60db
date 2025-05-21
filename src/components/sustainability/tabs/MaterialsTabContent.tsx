
import React from "react";
import MaterialAlternatives from "../MaterialAlternatives";
import { MaterialAnalysisResult } from "@/lib/materialCategories";
import { MaterialInput } from "@/lib/carbonExports";

interface MaterialsTabContentProps {
  materialAnalysis: MaterialAnalysisResult | null;
  materials: MaterialInput[];
}

const MaterialsTabContent: React.FC<MaterialsTabContentProps> = ({
  materialAnalysis,
  materials
}) => {
  return (
    <div className="mt-4">
      <MaterialAlternatives
        materialAnalysis={materialAnalysis}
        materials={materials}
      />
    </div>
  );
};

export default MaterialsTabContent;
