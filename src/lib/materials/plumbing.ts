import { ExtendedMaterialData, MATERIAL_TYPES } from './types';

export const PLUMBING_MATERIALS: Record<string, ExtendedMaterialData> = {
  pvcPipe: {
    name: "PVC Pipes",
    factor: 0.24,
    unit: "kg",
    region: "Australia",
    notes: "Common plumbing material with moderate carbon footprint.",
    tags: [MATERIAL_TYPES.PLUMBING, "pipes"]
  },
  pprPipe: {
    name: "PP-R Pipes",
    factor: 0.18,
    unit: "kg",
    region: "Australia",
    alternativeTo: "pvcPipe",
    notes: "Lower carbon alternative to PVC piping systems used in plumbing.",
    tags: [MATERIAL_TYPES.PLUMBING, "pipes"]
  },
  copperPipe: {
    name: "Copper Pipes",
    factor: 2.1,
    unit: "kg",
    region: "Australia",
    notes: "Premium plumbing material with higher carbon footprint but excellent durability.",
    tags: [MATERIAL_TYPES.PLUMBING, "pipes", "durable"]
  },
  recycledCopperPipe: {
    name: "Recycled Copper Pipes",
    factor: 0.87,
    unit: "kg",
    region: "Australia",
    alternativeTo: "copperPipe",
    notes: "Recycled copper pipes that significantly reduce embodied carbon compared to virgin copper.",
    tags: [MATERIAL_TYPES.PLUMBING, "pipes", MATERIAL_TYPES.RECYCLED]
  },
};
