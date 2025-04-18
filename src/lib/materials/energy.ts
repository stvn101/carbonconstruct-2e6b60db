import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const ENERGY_SYSTEMS: Record<string, ExtendedMaterialData> = {
  solarPVSystem: {
    name: "Solar PV System",
    factor: 30,
    unit: "m²",
    region: "Australia",
    notes: "Photovoltaic system for on-site renewable energy generation. Factor represents embodied carbon per m² of panel area.",
    tags: [MATERIAL_TYPES.RENEWABLE, MATERIAL_TYPES.ENERGY, "rooftop"]
  },
  batteryStorage: {
    name: "Battery Storage System",
    factor: 120,
    unit: "kWh",
    region: "Australia",
    notes: "Lithium-ion battery storage for solar energy. High embodied carbon but enables renewable energy use.",
    tags: [MATERIAL_TYPES.ENERGY, "storage", "battery"]
  },
};
