
import React, { useState } from 'react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import MaterialGridSkeleton from './MaterialGridSkeleton';
import MaterialEmptyState from './MaterialEmptyState';
import MaterialCard from './MaterialCard';
import MaterialDetailsDialog from './MaterialDetailsDialog';
import Pagination from '@/components/ui/pagination';

interface MaterialGridProps {
  materials: ExtendedMaterialData[];
  loading: boolean;
}

export const MaterialGrid: React.FC<MaterialGridProps> = ({ materials, loading }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<ExtendedMaterialData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Show 9 cards per page (3x3 grid)

  const handleViewDetails = (material: ExtendedMaterialData) => {
    setSelectedMaterial(material);
  };

  const handleCloseDetails = () => {
    setSelectedMaterial(null);
  };

  const handlePageChange = (page: number) => {
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(page);
  };

  if (loading) {
    return <MaterialGridSkeleton />;
  }

  if (!materials || materials.length === 0) {
    return <MaterialEmptyState />;
  }

  // Calculate pagination
  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMaterials = materials.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedMaterials.map((material) => (
          material && material.name ? (
            <MaterialCard 
              key={material.id} 
              material={material} 
              onViewDetails={handleViewDetails} 
            />
          ) : null
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            siblingCount={1}
            className="mt-4"
          />
        </div>
      )}

      {/* Material Details Dialog */}
      <MaterialDetailsDialog 
        material={selectedMaterial} 
        onClose={handleCloseDetails} 
      />
    </div>
  );
};

export default MaterialGrid;
