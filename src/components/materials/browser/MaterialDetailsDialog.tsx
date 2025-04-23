
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { EnrichedMaterial } from "@/utils/materialUtils";

interface MaterialDetailsDialogProps {
  material: EnrichedMaterial;
}

const MaterialDetailsDialog = ({ material }: MaterialDetailsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-carbon-100 hover:bg-carbon-200 border-carbon-300"
        >
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-background border-carbon-300 shadow-lg">
        <DialogHeader>
          <DialogTitle>{material.type}</DialogTitle>
          <DialogDescription>
            Detailed information about this material
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Category</label>
              <p>{material.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Emission Factor</label>
              <p>{material.factor} kg CO₂e/kg</p>
            </div>
            <div>
              <label className="text-sm font-medium">Sustainability Score</label>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-carbon-600 h-2.5 rounded-full" 
                    style={{ width: `${material.sustainabilityScore}%` }}
                  ></div>
                </div>
                <span>{material.sustainabilityScore}/100</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Sustainable Alternative</label>
              <p>{material.alternativeToStandard ? 'Yes' : 'No'}</p>
            </div>
            {material.alternativeToStandard && (
              <div>
                <label className="text-sm font-medium">Carbon Reduction</label>
                <p className="text-green-600 font-medium">{material.carbonReduction}% less CO₂</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Recyclability</label>
              <Badge 
                variant="outline"
                className={
                  material.recyclability === 'High' 
                    ? 'bg-green-100 text-green-800 border-green-300' 
                    : material.recyclability === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                }
              >
                {material.recyclability}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Locally Sourced Available</label>
              <p>{material.locallySourced ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-carbon-50 p-4 rounded-md mt-2 dark:bg-carbon-900">
          <h4 className="font-medium mb-1">Environmental Impact</h4>
          <p className="text-sm text-muted-foreground">
            {material.factor < 1 
              ? `This material has a relatively low environmental impact compared to others in its category.`
              : material.factor < 5
                ? `This material has a moderate environmental impact. Consider alternatives if available.`
                : `This material has a high environmental impact. Sustainable alternatives should be considered.`
            }
            {material.alternativeToStandard && 
              ` As a sustainable alternative, it offers significant carbon savings compared to conventional options.`
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDetailsDialog;
