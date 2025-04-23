
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";

interface MaterialDetailsProps {
  material: ExtendedMaterialData;
}

const MaterialDetails: React.FC<MaterialDetailsProps> = ({ material }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-carbon-400 hover:bg-carbon-500 border-carbon-500 dark:bg-carbon-600 dark:hover:bg-carbon-500 dark:border-carbon-500 dark:text-white transition-colors duration-200"
        >
          <Info className="h-4 w-4 mr-1" />
          Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 border border-carbon-300 dark:border-gray-700 shadow-xl">
        <DialogHeader>
          <DialogTitle>{material.name}</DialogTitle>
          <DialogDescription>
            Carbon coefficient and material details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <h4 className="text-sm font-medium">Carbon Factor</h4>
            <p className="text-lg font-semibold">
              {material.factor} kg CO₂e/{material.unit}
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Region</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {material.region?.split(", ").map((region) => (
                <Badge 
                  key={region}
                  variant={region === "Australia" ? "secondary" : "outline"} 
                >
                  {region}
                </Badge>
              ))}
            </div>
          </div>
          
          {material.alternativeTo && (
            <div>
              <h4 className="text-sm font-medium">Alternative To</h4>
              <p>{material.alternativeTo}</p>
            </div>
          )}
          
          {material.tags && material.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">Tags</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {material.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {material.sustainabilityScore && (
            <div>
              <h4 className="text-sm font-medium">Sustainability Score</h4>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-carbon-600 h-2.5 rounded-full" 
                    style={{ width: `${material.sustainabilityScore}%` }}
                  ></div>
                </div>
                <span className="font-medium">{material.sustainabilityScore}/100</span>
              </div>
            </div>
          )}
          
          {material.recyclability && (
            <div>
              <h4 className="text-sm font-medium">Recyclability</h4>
              <Badge 
                variant={
                  material.recyclability === "High" ? "default" :
                  material.recyclability === "Medium" ? "secondary" : "outline"
                }
                className={
                  material.recyclability === "High" ? "bg-green-500" : ""
                }
              >
                {material.recyclability}
              </Badge>
            </div>
          )}
          
          {material.notes && (
            <div>
              <h4 className="text-sm font-medium">Notes</h4>
              <p className="text-sm text-muted-foreground">{material.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDetails;
