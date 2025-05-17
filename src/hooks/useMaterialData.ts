
import { useMemo } from "react";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import { MaterialOption, MaterialsByRegion } from "@/lib/materialTypes";

interface UseMaterialDataProps {
  searchTerm: string;
  selectedRegion: string;
  selectedAlternative: string;
  selectedTag: string;
  materials: ExtendedMaterialData[];
}

interface UseMaterialDataResult {
  filteredMaterials: ExtendedMaterialData[];
  materialsByRegion: MaterialsByRegion;
  allTags: string[];
  baseOptions: MaterialOption[];
  materialCount: number;
  allRegions: string[];
}

export function useMaterialData({
  searchTerm,
  selectedRegion,
  selectedAlternative,
  selectedTag,
  materials
}: UseMaterialDataProps): UseMaterialDataResult {
  // Get all regions from materials
  const allRegions = useMemo(() => {
    if (!materials) return ["Australia"];
    
    const regions = new Set<string>();
    materials.forEach(material => {
      if (material.region) {
        regions.add(material.region);
      } else {
        regions.add("Australia"); // Default
      }
    });
    return Array.from(regions).sort();
  }, [materials]);

  // Get all tags from materials
  const allTags = useMemo(() => {
    if (!materials) return [];

    const tags = new Set<string>();
    tags.add("all"); // Always include "all" option
    
    materials.forEach(material => {
      if (Array.isArray(material.tags)) {
        material.tags.forEach(tag => {
          if (tag) tags.add(tag);
        });
      }
      
      // Also add category as a tag if present
      if (material.category) {
        tags.add(material.category);
      }
    });
    
    return Array.from(tags).sort();
  }, [materials]);

  // Count materials by region
  const materialsByRegion = useMemo(() => {
    const regionCounts: MaterialsByRegion = {};
    
    if (!materials) return { Australia: 0 };

    materials.forEach(material => {
      const region = material.region || "Australia";
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });
    
    return regionCounts;
  }, [materials]);

  // Create base options for alternatives dropdown
  const baseOptions = useMemo(() => {
    const options = [{ id: "none", name: "All Materials" }];
    
    // Get materials that are listed as alternatives to something
    if (materials) {
      const alternativeTargets = new Set<string>();
      
      materials.forEach(material => {
        if (material.alternativeTo) {
          alternativeTargets.add(material.alternativeTo);
        }
      });
      
      if (alternativeTargets.size > 0) {
        options.push({ id: "only_alternatives", name: "Only Alternatives" });
        
        // Add specific material alternatives
        Array.from(alternativeTargets).sort().forEach(target => {
          options.push({
            id: `alt_to_${target}`,
            name: `Alternative to ${target}`
          });
        });
      }
    }
    
    return options;
  }, [materials]);

  // Filter materials based on search, region, alternative, and tag
  const filteredMaterials = useMemo(() => {
    if (!materials || !Array.isArray(materials)) return [];
    
    return materials.filter(material => {
      // Filter by search term if provided
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = material.name?.toLowerCase().includes(searchLower);
        const categoryMatch = material.category?.toLowerCase().includes(searchLower);
        const tagsMatch = Array.isArray(material.tags) && 
          material.tags.some(tag => tag?.toLowerCase().includes(searchLower));
        
        if (!(nameMatch || categoryMatch || tagsMatch)) {
          return false;
        }
      }
      
      // Filter by region if selected and not "all"
      if (selectedRegion !== "all" && material.region !== selectedRegion) {
        return false;
      }
      
      // Filter by alternatives
      if (selectedAlternative !== "none") {
        if (selectedAlternative === "only_alternatives") {
          // Show only materials that are alternatives
          if (!material.alternativeTo) {
            return false;
          }
        } else if (selectedAlternative.startsWith("alt_to_")) {
          // Show alternatives to a specific material
          const targetMaterial = selectedAlternative.replace("alt_to_", "");
          if (material.alternativeTo !== targetMaterial) {
            return false;
          }
        }
      }
      
      // Filter by tag if selected and not "all"
      if (selectedTag !== "all") {
        const hasCategoryMatch = material.category === selectedTag;
        const hasTagMatch = Array.isArray(material.tags) && 
          material.tags.some(tag => tag === selectedTag);
        
        if (!(hasCategoryMatch || hasTagMatch)) {
          return false;
        }
      }
      
      return true;
    });
  }, [materials, searchTerm, selectedRegion, selectedAlternative, selectedTag]);

  // Number of filtered materials
  const materialCount = filteredMaterials.length;

  return {
    filteredMaterials,
    materialsByRegion,
    allTags,
    baseOptions,
    materialCount,
    allRegions
  };
}
