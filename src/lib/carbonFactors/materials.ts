
// Material emission factors (kg CO2e per unit)
export const MATERIAL_FACTORS = {
  // Basic construction materials
  concrete: {
    name: "Concrete",
    factor: 0.107,
    unit: "kg"
  },
  steel: {
    name: "Steel",
    factor: 1.46,
    unit: "kg"
  },
  timber: {
    name: "Timber",
    factor: 0.42,
    unit: "kg"
  },
  brick: {
    name: "Brick",
    factor: 0.24,
    unit: "kg"
  },
  aluminum: {
    name: "Aluminum",
    factor: 8.24,
    unit: "kg"
  },
  glass: {
    name: "Glass",
    factor: 0.85,
    unit: "kg"
  },
  insulation: {
    name: "Insulation",
    factor: 1.86,
    unit: "kg"
  },
  asphalt: {
    name: "Asphalt",
    factor: 0.19,
    unit: "kg"
  },
  // Additional basic materials
  copper: {
    name: "Copper",
    factor: 2.71,
    unit: "kg"
  },
  plastic: {
    name: "Plastic (PVC)",
    factor: 2.41,
    unit: "kg"
  },
  gypsum: {
    name: "Gypsum Board",
    factor: 0.276,
    unit: "kg"
  },
  plywood: {
    name: "Plywood",
    factor: 0.45,
    unit: "kg"
  },
  ceramic: {
    name: "Ceramic Tiles",
    factor: 0.78,
    unit: "kg"
  },
  marble: {
    name: "Marble",
    factor: 0.93,
    unit: "kg"
  },
  zinc: {
    name: "Zinc",
    factor: 3.41,
    unit: "kg"
  },
  carpet: {
    name: "Carpet",
    factor: 3.89,
    unit: "kg"
  },
  
  // Civil construction materials
  concreteReinforced: {
    name: "Reinforced Concrete",
    factor: 0.159,
    unit: "kg"
  },
  concretePrestressed: {
    name: "Prestressed Concrete",
    factor: 0.217,
    unit: "kg"
  },
  asphaltPavement: {
    name: "Asphalt Pavement",
    factor: 0.06,
    unit: "kg"
  },
  gabion: {
    name: "Gabion Stone",
    factor: 0.079,
    unit: "kg"
  },
  geotextile: {
    name: "Geotextile",
    factor: 4.26,
    unit: "kg"
  },
  steelRebar: {
    name: "Steel Rebar",
    factor: 1.99,
    unit: "kg"
  },
  bitumen: {
    name: "Bitumen",
    factor: 0.51,
    unit: "kg"
  },
  aggregates: {
    name: "Aggregates (Crushed Rock)",
    factor: 0.005,
    unit: "kg"
  },
  sand: {
    name: "Sand",
    factor: 0.003,
    unit: "kg"
  },
  cement: {
    name: "Portland Cement",
    factor: 0.83,
    unit: "kg"
  },
  
  // Commercial construction materials
  structuralSteel: {
    name: "Structural Steel",
    factor: 1.54,
    unit: "kg"
  },
  curtainWall: {
    name: "Glass Curtain Wall",
    factor: 1.86,
    unit: "kg"
  },
  raisedFloor: {
    name: "Raised Access Floor",
    factor: 2.67,
    unit: "kg"
  },
  suspendedCeiling: {
    name: "Suspended Ceiling",
    factor: 2.13,
    unit: "kg"
  },
  epdmMembrane: {
    name: "EPDM Membrane",
    factor: 3.4,
    unit: "kg"
  },
  terrazzo: {
    name: "Terrazzo Flooring",
    factor: 0.46,
    unit: "kg"
  },
  vinylFlooring: {
    name: "Vinyl Flooring",
    factor: 3.19,
    unit: "kg"
  },
  acousticPanel: {
    name: "Acoustic Panel",
    factor: 2.65,
    unit: "kg"
  },
  aluminumComposite: {
    name: "Aluminum Composite Panel",
    factor: 9.16,
    unit: "kg"
  },
  
  // Residential construction materials
  brickVeneer: {
    name: "Brick Veneer",
    factor: 0.27,
    unit: "kg"
  },
  cladding: {
    name: "Fiber Cement Cladding",
    factor: 1.09,
    unit: "kg"
  },
  roofTile: {
    name: "Concrete Roof Tile",
    factor: 0.19,
    unit: "kg"
  },
  weatherboard: {
    name: "Timber Weatherboard",
    factor: 0.45,
    unit: "kg"
  },
  insulation_batts: {
    name: "Insulation Batts",
    factor: 1.93,
    unit: "kg"
  },
  laminateFlooring: {
    name: "Laminate Flooring",
    factor: 2.1,
    unit: "kg"
  },
  engineeredTimber: {
    name: "Engineered Timber",
    factor: 0.49,
    unit: "kg"
  },
  paintInterior: {
    name: "Interior Paint",
    factor: 2.54,
    unit: "kg"
  },
  paintExterior: {
    name: "Exterior Paint",
    factor: 3.76,
    unit: "kg"
  },
  
  // Advanced/specialty materials
  titanium: {
    name: "Titanium",
    factor: 56.7,
    unit: "kg"
  },
  stainlessSteel316: {
    name: "Stainless Steel (316)",
    factor: 6.15,
    unit: "kg"
  },
  compositeFRP: {
    name: "Fiber Reinforced Polymer",
    factor: 8.1,
    unit: "kg"
  },
  polycarbonate: {
    name: "Polycarbonate",
    factor: 7.62,
    unit: "kg"
  },
  epoxy: {
    name: "Epoxy Resin",
    factor: 6.73,
    unit: "kg"
  },
  rubberEPDM: {
    name: "EPDM Rubber",
    factor: 3.41,
    unit: "kg"
  },
  cork: {
    name: "Cork",
    factor: 1.21,
    unit: "kg"
  },
  bambooFlooring: {
    name: "Bamboo Flooring",
    factor: 1.69,
    unit: "kg"
  },
  
  // Landscaping materials
  mulch: {
    name: "Mulch",
    factor: 0.15,
    unit: "kg"
  },
  compost: {
    name: "Compost",
    factor: 0.03,
    unit: "kg"
  },
  gravel: {
    name: "Gravel",
    factor: 0.004,
    unit: "kg"
  },
  timberDecking: {
    name: "Timber Decking",
    factor: 0.47,
    unit: "kg"
  },
  syntheticGrass: {
    name: "Synthetic Grass",
    factor: 6.31,
    unit: "kg"
  },
  
  // Specialized civil materials
  concretePipe: {
    name: "Concrete Pipe",
    factor: 0.18,
    unit: "kg"
  },
  precastManhole: {
    name: "Precast Concrete Manhole",
    factor: 0.21,
    unit: "kg"
  },
  roadMarking: {
    name: "Road Marking Paint",
    factor: 3.76,
    unit: "kg"
  },
  guardrail: {
    name: "Steel Guardrail",
    factor: 1.79,
    unit: "kg"
  },
  noiseBarrier: {
    name: "Acoustic Noise Barrier",
    factor: 4.12,
    unit: "kg"
  }
};
