
import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const RESIDENTIAL_MATERIALS: Record<string, ExtendedMaterialData> = {
  timberFraming: {
    name: "Timber Wall Framing",
    factor: 0.42,
    unit: "kg",
    region: "Australia",
    notes: "Structural timber used for residential wall framing.",
    tags: [MATERIAL_TYPES.RESIDENTIAL, MATERIAL_TYPES.WOOD, "framing"]
  },
  metalRoof: {
    name: "Metal Roof Sheeting",
    factor: 2.54,
    unit: "kg",
    region: "Australia",
    notes: "Steel roof sheeting commonly used in residential construction.",
    tags: [MATERIAL_TYPES.RESIDENTIAL, MATERIAL_TYPES.ROOFING, MATERIAL_TYPES.METAL]
  },
  tileRoof: {
    name: "Ceramic Roof Tiles",
    factor: 0.52,
    unit: "kg",
    region: "Australia",
    notes: "Traditional clay or ceramic roof tiles for residential buildings.",
    tags: [MATERIAL_TYPES.RESIDENTIAL, MATERIAL_TYPES.ROOFING, "ceramic"]
  },
  floorboards: {
    name: "Hardwood Floorboards",
    factor: 0.57,
    unit: "kg",
    region: "Australia",
    notes: "Solid timber flooring for residential applications.",
    tags: [MATERIAL_TYPES.RESIDENTIAL, MATERIAL_TYPES.FLOORING, MATERIAL_TYPES.WOOD]
  },
  plasterboard: {
    name: "Plasterboard",
    factor: 0.38,
    unit: "kg",
    region: "Australia",
    notes: "Standard plasterboard/gypsum board for internal walls and ceilings.",
    tags: [MATERIAL_TYPES.RESIDENTIAL, "walls", "ceilings"]
  },
  kitchenCabinets: {
    name: "Kitchen Cabinetry",
    factor: 1.67,
    unit: "kg",
    region: "Australia",
    notes: "MDF or particleboard kitchen cabinets.",
    tags: [MATERIAL_TYPES.RESIDENTIAL, MATERIAL_TYPES.INTERIOR, "cabinetry"]
  },
  interiorDoor: {
    name: "Interior Door",
    factor: 1.33,
    unit: "kg",
    region: "Australia",
    notes: "Standard hollow-core interior doors for residential use.",
    tags: [MATERIAL_TYPES.RESIDENTIAL, MATERIAL_TYPES.INTERIOR, "door"]
  },
  windowGlazing: {
    name: "Double Glazed Windows",
    factor: 1.45,
    unit: "kg",
    region: "Australia",
    notes: "Energy efficient double glazed window units.",
    tags: [MATERIAL_TYPES.RESIDENTIAL, MATERIAL_TYPES.THERMAL, "window"]
  },
  bathroomTile: {
    name: "Ceramic Bathroom Tiles",
    factor: 0.78,
    unit: "kg",
    region: "Australia",
    notes: "Ceramic or porcelain tiles used for bathroom walls and floors.",
    tags: [MATERIAL_TYPES.RESIDENTIAL, "bathroom", "ceramic"]
  }
};
