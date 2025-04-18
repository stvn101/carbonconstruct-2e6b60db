
// Transport emission factors
export const TRANSPORT_FACTORS = {
  truck: {
    name: "Truck",
    factor: 0.1,
    unit: "tonne-km"
  },
  train: {
    name: "Train",
    factor: 0.03,
    unit: "tonne-km"
  },
  ship: {
    name: "Ship",
    factor: 0.015,
    unit: "tonne-km"
  },
  // Australian-specific transport
  ausTruck: {
    name: "Australian Truck (Diesel)",
    factor: 0.12,
    unit: "tonne-km"
  },
  ausElectricTruck: {
    name: "Australian Electric Truck",
    factor: 0.04,
    unit: "tonne-km"
  },
  ausTrain: {
    name: "Australian Rail Freight",
    factor: 0.025,
    unit: "tonne-km"
  },
  ausShip: {
    name: "Australian Coastal Shipping",
    factor: 0.014,
    unit: "tonne-km"
  },
  ausLightVehicle: {
    name: "Australian Light Commercial Vehicle",
    factor: 0.25,
    unit: "tonne-km"
  }
};
