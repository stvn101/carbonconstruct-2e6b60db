
/**
 * Materials Table component
 * Displays material data in a tabular format
 */
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

interface MaterialsTableProps {
  materials: ExtendedMaterialData[];
}

const MaterialsTable: React.FC<MaterialsTableProps> = ({ materials }) => {
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Region</TableHead>
            <TableHead className="text-right">Carbon Factor</TableHead>
            <TableHead className="text-right">Sustainability</TableHead>
            <TableHead>Tags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No materials found matching the current filters
              </TableCell>
            </TableRow>
          ) : (
            materials.map((material, index) => (
              <TableRow key={`${material.id || material.name}-${index}`}>
                <TableCell className="font-medium">
                  {material.name}
                  {material.alternativeTo && (
                    <div className="text-xs text-muted-foreground">
                      Alternative to: {material.alternativeTo}
                    </div>
                  )}
                </TableCell>
                <TableCell>{material.category || 'Uncategorized'}</TableCell>
                <TableCell>{material.region || 'Global'}</TableCell>
                <TableCell className="text-right">
                  {material.factor ? (
                    <span className={material.factor > 1 ? 'text-red-600' : 'text-green-600'}>
                      {material.factor.toFixed(2)} {material.unit || 'kg CO₂e/kg'}
                    </span>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <SustainabilityIndicator score={material.sustainabilityScore || 0} />
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {material.tags && material.tags.length > 0 ? (
                      material.tags.slice(0, 3).map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">No tags</span>
                    )}
                    {material.tags && material.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{material.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// Helper component for sustainability score visualization
const SustainabilityIndicator: React.FC<{ score: number }> = ({ score }) => {
  let color = 'bg-red-500';
  if (score >= 70) color = 'bg-green-500';
  else if (score >= 50) color = 'bg-yellow-500';
  else if (score >= 30) color = 'bg-orange-500';
  
  return (
    <div className="flex items-center justify-end gap-2">
      <span>{score}</span>
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color}`} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
};

export default MaterialsTable;
