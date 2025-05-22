
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { SavedProject } from "@/contexts/ProjectContext";
import { MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";

interface ProjectDetailsTabProps {
  project: SavedProject;
  onExportPDF: (project: SavedProject) => void;
  onExportCSV: (project: SavedProject) => void;
}

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ 
  project, 
  onExportPDF, 
  onExportCSV 
}) => {
  // Material, transport, and energy data for display
  const materialList = (project.materials || []).map((m: MaterialInput) => ({
    name: m.name,
    quantity: m.quantity,
    unit: m.unit
  }));
  
  const energyList = (project.energy || []).map((e: EnergyInput) => ({
    name: e.type,
    amount: e.amount,
    unit: e.unit
  }));

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            A summary of the materials, transport, and energy used in this project.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Materials</h3>
            <ul className="list-disc pl-5">
              {materialList.map((material, index) => (
                <li key={index}>
                  {material.name}: {material.quantity} {material.unit}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Transport</h3>
            <ul className="list-disc pl-5">
              {(project.transport || []).map((transport: TransportInput, index) => (
                <li key={index}>
                  {transport.mode}: {transport.distance} km, {transport.weight} kg
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Energy</h3>
            <ul className="list-disc pl-5">
              {energyList.map((energy, index) => (
                <li key={index}>
                  {energy.name}: {energy.amount} {energy.unit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      {/* Export Options */}
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" onClick={() => onExportPDF(project)}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </Button>
        <Button variant="outline" onClick={() => onExportCSV(project)}>
          <FileText className="h-4 w-4 mr-2" />
          Export as CSV
        </Button>
      </div>
    </>
  );
};

export default ProjectDetailsTab;
