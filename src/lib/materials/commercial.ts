
import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const COMMERCIAL_MATERIALS: Record<string, ExtendedMaterialData> = {
  carpetTile: {
    name: "Carpet Tiles",
    factor: 4.25,
    unit: "kg",
    region: "Australia",
    notes: "Modular carpet tiles commonly used in commercial spaces.",
    tags: [MATERIAL_TYPES.COMMERCIAL, MATERIAL_TYPES.FLOORING, MATERIAL_TYPES.INTERIOR]
  },
  ceilingTile: {
    name: "Acoustic Ceiling Tiles",
    factor: 1.38,
    unit: "kg",
    region: "Australia",
    notes: "Sound absorbing ceiling tiles for commercial buildings.",
    tags: [MATERIAL_TYPES.COMMERCIAL, MATERIAL_TYPES.CEILING, MATERIAL_TYPES.ACOUSTIC]
  },
  raisedAccessFloor: {
    name: "Raised Access Flooring",
    factor: 3.14,
    unit: "kg",
    region: "Australia",
    notes: "Modular flooring systems that allow access to underfloor services.",
    tags: [MATERIAL_TYPES.COMMERCIAL, MATERIAL_TYPES.FLOORING, "modular"]
  },
  glassPartition: {
    name: "Glass Office Partitions",
    factor: 1.27,
    unit: "kg",
    region: "Australia",
    notes: "Interior glass walls and partitions for commercial spaces.",
    tags: [MATERIAL_TYPES.COMMERCIAL, "partition", MATERIAL_TYPES.INTERIOR]
  },
  demountableWall: {
    name: "Demountable Partition System",
    factor: 2.84,
    unit: "kg",
    region: "Australia",
    notes: "Relocatable wall systems that can be reconfigured.",
    tags: [MATERIAL_TYPES.COMMERCIAL, "partition", "modular"]
  },
  metalStud: {
    name: "Metal Stud Framing",
    factor: 1.79,
    unit: "kg",
    region: "Australia",
    notes: "Galvanized steel studs used for interior wall framing.",
    tags: [MATERIAL_TYPES.COMMERCIAL, MATERIAL_TYPES.STEEL, "framing"]
  },
  fireRatedDoor: {
    name: "Fire-Rated Door Assembly",
    factor: 3.65,
    unit: "kg",
    region: "Australia",
    notes: "Door systems designed for fire protection in commercial buildings.",
    tags: [MATERIAL_TYPES.COMMERCIAL, MATERIAL_TYPES.FIRE_RESISTANT, "door"]
  },
  aluminumWindow: {
    name: "Commercial Aluminum Windows",
    factor: 8.76,
    unit: "kg",
    region: "Australia",
    notes: "High-performance aluminum window systems for commercial facades.",
    tags: [MATERIAL_TYPES.COMMERCIAL, MATERIAL_TYPES.EXTERIOR, "window"]
  },
  concreteBlock: {
    name: "Concrete Block",
    factor: 0.12,
    unit: "kg",
    region: "Australia",
    notes: "Concrete masonry units used in commercial construction.",
    tags: [MATERIAL_TYPES.COMMERCIAL, MATERIAL_TYPES.CONCRETE, "masonry"]
  }
};
