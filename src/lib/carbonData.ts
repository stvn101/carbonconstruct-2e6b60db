
// Carbon emission factors (kg CO2e per unit)
export const MATERIAL_FACTORS = {
  // Basic construction materials
  concrete: {
    name: "Concrete",
    factor: 0.107, // kg CO2e per kg
    unit: "kg"
  },
  steel: {
    name: "Steel",
    factor: 1.46, // kg CO2e per kg
    unit: "kg"
  },
  timber: {
    name: "Timber",
    factor: 0.42, // kg CO2e per kg
    unit: "kg"
  },
  brick: {
    name: "Brick",
    factor: 0.24, // kg CO2e per kg
    unit: "kg"
  },
  aluminum: {
    name: "Aluminum",
    factor: 8.24, // kg CO2e per kg
    unit: "kg"
  },
  glass: {
    name: "Glass",
    factor: 0.85, // kg CO2e per kg
    unit: "kg"
  },
  insulation: {
    name: "Insulation",
    factor: 1.86, // kg CO2e per kg
    unit: "kg"
  },
  asphalt: {
    name: "Asphalt",
    factor: 0.19, // kg CO2e per kg
    unit: "kg"
  },
  
  // Australian specific structural materials
  bluesteelRebar: {
    name: "BlueSteel Rebar (Australian)",
    factor: 0.95, // kg CO2e per kg (lower carbon Australian rebar)
    unit: "kg"
  },
  recycledConcrete: {
    name: "Recycled Concrete Aggregate (AUS)",
    factor: 0.043, // kg CO2e per kg
    unit: "kg"
  },
  ausTimber: {
    name: "Australian Hardwood",
    factor: 0.35, // kg CO2e per kg
    unit: "kg"
  },
  ausSoftwood: {
    name: "Australian Softwood",
    factor: 0.31, // kg CO2e per kg
    unit: "kg"
  },
  ausBrick: {
    name: "Australian Clay Brick",
    factor: 0.22, // kg CO2e per kg
    unit: "kg"
  },
  greenConcrete: {
    name: "Green Concrete (Geopolymer)",
    factor: 0.062, // kg CO2e per kg
    unit: "kg"
  },
  bambooCladding: {
    name: "Bamboo Cladding",
    factor: 0.15, // kg CO2e per kg
    unit: "kg"
  },
  
  // Australian specific fuel and energy for construction machinery
  ausDiesel: {
    name: "Australian Diesel (Construction)",
    factor: 2.68, // kg CO2e per liter
    unit: "liter"
  },
  ausGasoline: {
    name: "Australian Gasoline (Construction)",
    factor: 2.31, // kg CO2e per liter
    unit: "liter"
  },
  biodieselAUS: {
    name: "Australian Biodiesel (B20)",
    factor: 2.14, // kg CO2e per liter
    unit: "liter"
  },
  ausLPG: {
    name: "Australian LPG (Construction)",
    factor: 1.51, // kg CO2e per kg
    unit: "kg"
  },
  
  // Australian specific plumbing materials
  ausPVCPipe: {
    name: "Australian PVC Pipes",
    factor: 2.5, // kg CO2e per kg
    unit: "kg"
  },
  ausPEXPipe: {
    name: "Australian PEX Pipes",
    factor: 2.1, // kg CO2e per kg
    unit: "kg"
  },
  ausCopper: {
    name: "Australian Copper Pipes",
    factor: 2.8, // kg CO2e per kg
    unit: "kg"
  },
  recycledCopper: {
    name: "Australian Recycled Copper",
    factor: 1.1, // kg CO2e per kg
    unit: "kg"
  },
  
  // Australian specific electrical materials
  ausWiring: {
    name: "Australian Electrical Wiring",
    factor: 3.1, // kg CO2e per kg
    unit: "kg"
  },
  ausSwitchgear: {
    name: "Australian Electrical Switchgear",
    factor: 4.3, // kg CO2e per kg
    unit: "kg"
  },
  ausLEDLighting: {
    name: "Australian LED Lighting Fixtures",
    factor: 7.2, // kg CO2e per kg
    unit: "kg"
  },
  ausSolarPanels: {
    name: "Australian Solar PV Panels",
    factor: 2.6, // kg CO2e per kg
    unit: "kg"
  },
  
  // Australian specific finishes & interiors
  ausCarpet: {
    name: "Australian Carpet",
    factor: 3.9, // kg CO2e per sqm
    unit: "sqm"
  },
  ausVinylFlooring: {
    name: "Australian Vinyl Flooring",
    factor: 2.8, // kg CO2e per sqm
    unit: "sqm"
  },
  ausTimberFlooring: {
    name: "Australian Timber Flooring",
    factor: 0.98, // kg CO2e per kg
    unit: "kg"
  },
  ausCeramicTile: {
    name: "Australian Ceramic Tiles",
    factor: 0.74, // kg CO2e per kg
    unit: "kg"
  },
  ausPorcelainTile: {
    name: "Australian Porcelain Tiles",
    factor: 0.87, // kg CO2e per kg
    unit: "kg"
  },
  ausGypsum: {
    name: "Australian Gypsum Board",
    factor: 0.39, // kg CO2e per kg
    unit: "kg"
  },
  ausLowVOCPaint: {
    name: "Australian Low-VOC Paint",
    factor: 1.89, // kg CO2e per liter
    unit: "liter"
  },
  
  // Australian specific landscaping materials
  ausCompost: {
    name: "Australian Compost",
    factor: 0.05, // kg CO2e per kg
    unit: "kg"
  },
  ausTopsoil: {
    name: "Australian Topsoil",
    factor: 0.01, // kg CO2e per kg
    unit: "kg"
  },
  ausGravel: {
    name: "Australian Landscaping Gravel",
    factor: 0.005, // kg CO2e per kg
    unit: "kg"
  },
  ausMulch: {
    name: "Australian Wood Mulch",
    factor: 0.03, // kg CO2e per kg
    unit: "kg"
  },
  
  // Australian specific insulation materials
  ausGlassWool: {
    name: "Australian Glass Wool Insulation",
    factor: 1.35, // kg CO2e per kg
    unit: "kg"
  },
  ausRockWool: {
    name: "Australian Rock Wool Insulation",
    factor: 1.12, // kg CO2e per kg
    unit: "kg"
  },
  ausPolystyrene: {
    name: "Australian EPS Insulation",
    factor: 3.75, // kg CO2e per kg
    unit: "kg"
  },
  ausPolyurethane: {
    name: "Australian Polyurethane Insulation",
    factor: 4.20, // kg CO2e per kg
    unit: "kg"
  },
  ausSheepWool: {
    name: "Australian Sheep Wool Insulation",
    factor: 0.55, // kg CO2e per kg
    unit: "kg"
  },
  
  // Australian specific waterproofing and roofing
  ausMembranes: {
    name: "Australian Waterproofing Membranes",
    factor: 1.95, // kg CO2e per kg
    unit: "kg"
  },
  ausCorrugatedMetal: {
    name: "Australian Corrugated Metal Roofing",
    factor: 1.75, // kg CO2e per kg
    unit: "kg"
  },
  ausTerracottaTiles: {
    name: "Australian Terracotta Roof Tiles",
    factor: 0.52, // kg CO2e per kg
    unit: "kg"
  },
  ausConcreteRoofTiles: {
    name: "Australian Concrete Roof Tiles",
    factor: 0.21, // kg CO2e per kg
    unit: "kg"
  },
  
  // Australian specific equipment (handover stage)
  ausHVAC: {
    name: "Australian HVAC Systems",
    factor: 4.85, // kg CO2e per kg
    unit: "kg"
  },
  ausWaterHeater: {
    name: "Australian Water Heaters",
    factor: 3.95, // kg CO2e per kg
    unit: "kg"
  },
  ausKitchenFixtures: {
    name: "Australian Kitchen Fixtures",
    factor: 2.65, // kg CO2e per kg
    unit: "kg"
  },
  ausBathroomFixtures: {
    name: "Australian Bathroom Fixtures",
    factor: 2.35, // kg CO2e per kg
    unit: "kg"
  },
  ausAppliancesEnergy: {
    name: "Australian Energy Star Appliances",
    factor: 5.65, // kg CO2e per kg
    unit: "kg"
  },
  ausStandardAppliances: {
    name: "Australian Standard Appliances",
    factor: 7.85, // kg CO2e per kg
    unit: "kg"
  },
  
  // Alternative sustainable materials in Australia
  rammed: {
    name: "Rammed Earth",
    factor: 0.025, // kg CO2e per kg
    unit: "kg"
  },
  hempcretePanels: {
    name: "Hempcrete Panels (AUS)",
    factor: 0.03, // kg CO2e per kg
    unit: "kg"
  },
  strawBale: {
    name: "Australian Straw Bale",
    factor: 0.01, // kg CO2e per kg
    unit: "kg"
  },
  ausRecycledSteel: {
    name: "Australian Recycled Steel",
    factor: 0.63, // kg CO2e per kg
    unit: "kg"
  },
  ausCrossLaminatedTimber: {
    name: "Australian Cross Laminated Timber (CLT)",
    factor: 0.41, // kg CO2e per kg
    unit: "kg"
  },
  ausGlulamBeams: {
    name: "Australian Glulam Beams",
    factor: 0.42, // kg CO2e per kg
    unit: "kg"
  },
  
  // Temporary works materials
  ausScaffolding: {
    name: "Australian Scaffolding (Steel)",
    factor: 1.45, // kg CO2e per kg
    unit: "kg"
  },
  ausFormwork: {
    name: "Australian Timber Formwork",
    factor: 0.40, // kg CO2e per use-kg (includes reuse)
    unit: "kg"
  },
  ausTemporaryFencing: {
    name: "Australian Temporary Fencing",
    factor: 1.15, // kg CO2e per meter
    unit: "meter"
  },
  
  // Site preparation materials
  ausCrushedRock: {
    name: "Australian Crushed Rock",
    factor: 0.006, // kg CO2e per kg
    unit: "kg"
  },
  ausSand: {
    name: "Australian Sand",
    factor: 0.004, // kg CO2e per kg
    unit: "kg"
  },
  ausRoadbase: {
    name: "Australian Road Base",
    factor: 0.008, // kg CO2e per kg
    unit: "kg"
  },
  
  // Materials from site to handover
  ausHandoverDocumentation: {
    name: "Australian Building Documentation",
    factor: 2.50, // kg CO2e per kg (paper/materials)
    unit: "kg"
  },
  ausCleaningProducts: {
    name: "Australian Construction Cleaning Products",
    factor: 1.20, // kg CO2e per liter
    unit: "liter"
  },
  ausProtectiveMaterials: {
    name: "Australian Protective Materials",
    factor: 1.80, // kg CO2e per kg
    unit: "kg"
  }
};

// Transport emission factors
export const TRANSPORT_FACTORS = {
  truck: {
    name: "Truck",
    factor: 0.1, // kg CO2e per tonne-km
    unit: "tonne-km"
  },
  train: {
    name: "Train",
    factor: 0.03, // kg CO2e per tonne-km
    unit: "tonne-km"
  },
  ship: {
    name: "Ship",
    factor: 0.015, // kg CO2e per tonne-km
    unit: "tonne-km"
  },
  // Australian-specific transport
  ausTruck: {
    name: "Australian Truck (Diesel)",
    factor: 0.12, // kg CO2e per tonne-km
    unit: "tonne-km"
  },
  ausElectricTruck: {
    name: "Australian Electric Truck",
    factor: 0.04, // kg CO2e per tonne-km
    unit: "tonne-km" 
  },
  ausTrain: {
    name: "Australian Rail Freight",
    factor: 0.025, // kg CO2e per tonne-km
    unit: "tonne-km"
  },
  ausShip: {
    name: "Australian Coastal Shipping",
    factor: 0.014, // kg CO2e per tonne-km
    unit: "tonne-km"
  },
  ausLightVehicle: {
    name: "Australian Light Commercial Vehicle",
    factor: 0.25, // kg CO2e per tonne-km
    unit: "tonne-km"
  }
};

// Energy emission factors
export const ENERGY_FACTORS = {
  electricity: {
    name: "Electricity",
    factor: 0.5, // kg CO2e per kWh
    unit: "kWh"
  },
  diesel: {
    name: "Diesel",
    factor: 2.68, // kg CO2e per liter
    unit: "liter"
  },
  naturalGas: {
    name: "Natural Gas",
    factor: 0.18, // kg CO2e per kWh
    unit: "kWh"
  },
  solar: {
    name: "Solar Power",
    factor: 0.05, // kg CO2e per kWh
    unit: "kWh"
  },
  // Australian-specific energy sources
  ausElectricity: {
    name: "Australian Grid Electricity",
    factor: 0.79, // kg CO2e per kWh (varies by state)
    unit: "kWh"
  },
  ausNSWElectricity: {
    name: "NSW Electricity",
    factor: 0.81, // kg CO2e per kWh
    unit: "kWh"
  },
  ausVICElectricity: {
    name: "Victoria Electricity",
    factor: 0.98, // kg CO2e per kWh
    unit: "kWh"
  },
  ausQLDElectricity: {
    name: "Queensland Electricity",
    factor: 0.81, // kg CO2e per kWh
    unit: "kWh"
  },
  ausSAElectricity: {
    name: "South Australia Electricity",
    factor: 0.44, // kg CO2e per kWh
    unit: "kWh"
  },
  ausWAElectricity: {
    name: "Western Australia Electricity",
    factor: 0.70, // kg CO2e per kWh
    unit: "kWh"
  },
  ausTASElectricity: {
    name: "Tasmania Electricity",
    factor: 0.19, // kg CO2e per kWh
    unit: "kWh"
  },
  ausNTElectricity: {
    name: "Northern Territory Electricity",
    factor: 0.64, // kg CO2e per kWh
    unit: "kWh"
  },
  ausNaturalGas: {
    name: "Australian Natural Gas",
    factor: 0.185, // kg CO2e per kWh
    unit: "kWh"
  },
  ausLPG: {
    name: "Australian LPG",
    factor: 1.51, // kg CO2e per kg
    unit: "kg"
  },
  ausDiesel: {
    name: "Australian Diesel Generator",
    factor: 2.68, // kg CO2e per liter
    unit: "liter"
  },
  ausBiodiesel: {
    name: "Australian Biodiesel",
    factor: 0.89, // kg CO2e per liter
    unit: "liter"
  },
  ausSolarPV: {
    name: "Australian Solar PV",
    factor: 0.04, // kg CO2e per kWh
    unit: "kWh"
  },
  ausTemporaryPower: {
    name: "Australian Temporary Power",
    factor: 1.05, // kg CO2e per kWh (including generator inefficiencies)
    unit: "kWh"
  }
};
