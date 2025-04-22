
import React from "react";
import MaterialsBrowseFilters from "./MaterialsBrowseFilters";
import MaterialsBrowseTable from "./MaterialsBrowseTable";
import { EnrichedMaterial } from "@/utils/materialUtils";

interface MaterialsBrowseTabProps {
  allCategories: string[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  showAlternativesOnly: boolean;
  setShowAlternativesOnly: (value: boolean) => void;
  sortedMaterials: EnrichedMaterial[];
  sortField: keyof EnrichedMaterial;
  sortDirection: "asc" | "desc";
  handleSort: (field: keyof EnrichedMaterial) => void;
  totalMaterialCount: number;
}

const MaterialsBrowseTab: React.FC<MaterialsBrowseTabProps> = ({
  allCategories,
  searchTerm,
  setSearchTerm,
  selectedCategories,
  setSelectedCategories,
  showAlternativesOnly,
  setShowAlternativesOnly,
  sortedMaterials,
  sortField,
  sortDirection,
  handleSort,
  totalMaterialCount,
}) => {
  return (
    <>
      <MaterialsBrowseFilters
        allCategories={allCategories}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        showAlternativesOnly={showAlternativesOnly}
        setShowAlternativesOnly={setShowAlternativesOnly}
      />
      <MaterialsBrowseTable
        sortedMaterials={sortedMaterials}
        sortField={sortField}
        sortDirection={sortDirection}
        handleSort={handleSort}
        totalMaterialCount={totalMaterialCount}
      />
    </>
  );
};

export default MaterialsBrowseTab;
