
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
}

interface MaterialDetailsDialogProps {
  material: ExtendedMaterialData;
}

const MaterialDetails: React.FC<MaterialDetailsDialogProps> = ({ material }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{material.name}</DialogTitle>
          <DialogDescription>
            Material details and specifications
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Carbon Factor</h4>
              <p className="text-sm">{material.factor} kg CO₂e/{material.unit}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Region</h4>
              <p className="text-sm">{material.region || "Global"}</p>
            </div>
          </div>
          
          {material.alternativeTo && (
            <div>
              <h4 className="text-sm font-medium">Alternative For</h4>
              <p className="text-sm">{material.alternativeTo}</p>
            </div>
          )}
          
          {material.tags && material.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-1">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {material.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
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
