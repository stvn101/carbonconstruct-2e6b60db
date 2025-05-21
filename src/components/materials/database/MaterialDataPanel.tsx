
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, Leaf, PackageCheck, Recycle, Landmark, ShieldCheck } from 'lucide-react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { cn } from '@/lib/utils';

interface MaterialDataPanelProps {
  material: ExtendedMaterialData;
  className?: string;
}

const MaterialDataPanel: React.FC<MaterialDataPanelProps> = ({ material, className }) => {
  if (!material) return null;
  
  // Determine sustainability level badge
  const getSustainabilityBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500">High</Badge>;
    if (score >= 60) return <Badge className="bg-green-300">Good</Badge>;
    if (score >= 40) return <Badge className="bg-amber-500">Medium</Badge>;
    return <Badge className="bg-red-500">Low</Badge>;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">{material.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {material.category} · {material.region}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Carbon Factor:</span>
            </div>
            <div className="font-medium text-right">
              {material.factor} kg CO₂e/kg
            </div>

            <div className="flex items-center gap-1">
              <Leaf className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Sustainability:</span>
            </div>
            <div className="font-medium text-right">
              {getSustainabilityBadge(material.sustainabilityScore || 0)}
            </div>
            
            <div className="flex items-center gap-1">
              <PackageCheck className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Unit:</span>
            </div>
            <div className="font-medium text-right">
              {material.unit || 'kg'}
            </div>
            
            <div className="flex items-center gap-1">
              <Recycle className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Recyclability:</span>
            </div>
            <div className="font-medium text-right">
              {material.recyclability || 'Medium'}
            </div>
          </div>
          
          {material.notes && (
            <div className="mt-3 text-sm text-muted-foreground">
              <p className="line-clamp-2">{material.notes}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-1 pb-3">
          <div className="w-full flex flex-wrap gap-1">
            {material.tags && material.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            
            {material.alternativeTo && (
              <Badge variant="secondary" className="text-xs ml-auto">
                Alternative
              </Badge>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MaterialDataPanel;
