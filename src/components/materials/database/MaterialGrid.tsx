
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ExternalLink, Info, Recycle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

interface MaterialGridProps {
  materials: ExtendedMaterialData[];
  loading: boolean;
}

export const MaterialGrid: React.FC<MaterialGridProps> = ({ materials, loading }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<ExtendedMaterialData | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={`skeleton-${i}`} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
          <h3 className="text-lg font-medium">No materials found</h3>
        </div>
        <p className="text-muted-foreground">
          Try adjusting your filters or search criteria to find materials.
        </p>
      </Card>
    );
  }

  return (
    <div>
      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => {
          // Skip materials without required properties
          if (!material || !material.name) return null;

          return (
            <Card key={material.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{material.name}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {material.category && (
                    <Badge variant="outline">{material.category}</Badge>
                  )}
                  {getRecyclabilityBadge(material.recyclability)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {material.description || 'No description available.'}
                </p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Carbon Factor</span>
                    <span className="font-medium">
                      {material.carbon_footprint_kgco2e_kg || material.factor || 0} kgCO₂e/{material.unit || 'kg'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sustainability Score</span>
                    <span className="font-medium">
                      <Badge className={getSustainabilityColorClass(material.sustainabilityScore || 0)}>
                        {material.sustainabilityScore || 'N/A'}
                      </Badge>
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedMaterial(material)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Material Details Dialog */}
      {selectedMaterial && (
        <Dialog open={!!selectedMaterial} onOpenChange={() => setSelectedMaterial(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedMaterial.name}</DialogTitle>
              <DialogDescription>
                Detail information about this material
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedMaterial.description || 'No description available.'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium">Carbon Footprint</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedMaterial.carbon_footprint_kgco2e_kg || selectedMaterial.factor || 0} kgCO₂e/{selectedMaterial.unit || 'kg'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Sustainability Score</h4>
                  <p className="text-sm">
                    <Badge className={getSustainabilityColorClass(selectedMaterial.sustainabilityScore || 0)}>
                      {selectedMaterial.sustainabilityScore || 'N/A'}
                    </Badge>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Category</h4>
                  <p className="text-sm text-muted-foreground">{selectedMaterial.category || 'Uncategorized'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Recyclability</h4>
                  <p className="text-sm flex items-center gap-1">
                    <Recycle className="h-3 w-3" />
                    {selectedMaterial.recyclability || 'Unknown'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Region</h4>
                  <p className="text-sm text-muted-foreground">{selectedMaterial.region || 'Global'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium">Unit</h4>
                  <p className="text-sm text-muted-foreground">{selectedMaterial.unit || 'kg'}</p>
                </div>
              </div>
              {selectedMaterial.tags && selectedMaterial.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedMaterial.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedMaterial.alternativeTo && (
                <div>
                  <h4 className="text-sm font-medium">Alternative To</h4>
                  <p className="text-sm text-muted-foreground">{selectedMaterial.alternativeTo}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedMaterial(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Helper function for sustainability score color
function getSustainabilityColorClass(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 hover:bg-green-100';
  if (score >= 60) return 'bg-lime-100 text-lime-800 hover:bg-lime-100';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
  if (score >= 20) return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
  return 'bg-red-100 text-red-800 hover:bg-red-100';
}

// Helper function for recyclability badge
function getRecyclabilityBadge(recyclability?: 'High' | 'Medium' | 'Low'): React.ReactNode {
  if (!recyclability) return null;
  
  let badgeClass = 'bg-gray-100 text-gray-800 hover:bg-gray-100';
  
  if (recyclability === 'High') {
    badgeClass = 'bg-green-100 text-green-800 hover:bg-green-100';
  } else if (recyclability === 'Medium') {
    badgeClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
  } else if (recyclability === 'Low') {
    badgeClass = 'bg-red-100 text-red-800 hover:bg-red-100';
  }
  
  return (
    <Badge className={badgeClass}>
      <Recycle className="h-3 w-3 mr-1" />
      {recyclability}
    </Badge>
  );
}

export default MaterialGrid;
