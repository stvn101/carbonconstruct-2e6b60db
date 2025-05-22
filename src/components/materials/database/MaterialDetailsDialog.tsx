
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Recycle } from 'lucide-react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { getSustainabilityColorClass } from './MaterialCard';

interface MaterialDetailsDialogProps {
  material: ExtendedMaterialData | null;
  onClose: () => void;
}

const MaterialDetailsDialog: React.FC<MaterialDetailsDialogProps> = ({ 
  material, 
  onClose 
}) => {
  if (!material) return null;

  return (
    <Dialog open={!!material} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{material.name}</DialogTitle>
          <DialogDescription>
            Detail information about this material
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Description</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {material.description || 'No description available.'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Carbon Footprint</h4>
              <p className="text-sm text-muted-foreground">
                {material.carbon_footprint_kgco2e_kg || material.factor || 0} kgCO₂e/{material.unit || 'kg'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Sustainability Score</h4>
              <p className="text-sm">
                <Badge className={getSustainabilityColorClass(material.sustainabilityScore || 0)}>
                  {material.sustainabilityScore || 'N/A'}
                </Badge>
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Category</h4>
              <p className="text-sm text-muted-foreground">{material.category || 'Uncategorized'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Recyclability</h4>
              <p className="text-sm flex items-center gap-1">
                <Recycle className="h-3 w-3" />
                {material.recyclability || 'Unknown'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Region</h4>
              <p className="text-sm text-muted-foreground">{material.region || 'Global'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Unit</h4>
              <p className="text-sm text-muted-foreground">{material.unit || 'kg'}</p>
            </div>
          </div>
          {material.tags && material.tags.length > 0 && (
            <div>
              <h4 className="text-sm font-medium">Tags</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {material.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          {material.alternativeTo && (
            <div>
              <h4 className="text-sm font-medium">Alternative To</h4>
              <p className="text-sm text-muted-foreground">{material.alternativeTo}</p>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" size="sm" className="w-full" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialDetailsDialog;
