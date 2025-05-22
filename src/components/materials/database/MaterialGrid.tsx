
import React, { useState } from 'react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import MaterialGridSkeleton from './MaterialGridSkeleton';
import MaterialEmptyState from './MaterialEmptyState';
import MaterialCard from './MaterialCard';
import MaterialDetailsDialog from './MaterialDetailsDialog';

interface MaterialGridProps {
  materials: ExtendedMaterialData[];
  loading: boolean;
}

export const MaterialGrid: React.FC<MaterialGridProps> = ({ materials, loading }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<ExtendedMaterialData | null>(null);

  const handleViewDetails = (material: ExtendedMaterialData) => {
    setSelectedMaterial(material);
  };

  const handleCloseDetails = () => {
    setSelectedMaterial(null);
  };

  if (loading) {
    return <MaterialGridSkeleton />;
  }

  if (!materials || materials.length === 0) {
    return <MaterialEmptyState />;
  }

  return (
    <div>
      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((material) => (
          material && material.name ? (
            <MaterialCard 
              key={material.id} 
              material={material} 
              onViewDetails={handleViewDetails} 
            />
          ) : null
        ))}
      </div>

      {/* Material Details Dialog */}
      <MaterialDetailsDialog 
        material={selectedMaterial} 
        onClose={handleCloseDetails} 
      />
    </div>
  );
};

export default MaterialGrid;
