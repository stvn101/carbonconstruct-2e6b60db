
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Info, Recycle } from 'lucide-react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

interface MaterialCardProps {
  material: ExtendedMaterialData;
  onViewDetails: (material: ExtendedMaterialData) => void;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onViewDetails }) => {
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
          onClick={() => onViewDetails(material)}
        >
          <Info className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function for sustainability score color
export function getSustainabilityColorClass(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 hover:bg-green-100';
  if (score >= 60) return 'bg-lime-100 text-lime-800 hover:bg-lime-100';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
  if (score >= 20) return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
  return 'bg-red-100 text-red-800 hover:bg-red-100';
}

// Helper function for recyclability badge
export function getRecyclabilityBadge(recyclability?: 'High' | 'Medium' | 'Low'): React.ReactNode {
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

export default MaterialCard;
