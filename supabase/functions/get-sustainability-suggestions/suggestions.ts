// Define interfaces for the request data
interface Material {
  name: string;
  quantity?: number;
  type?: string;
  [key: string]: unknown;
}

interface TransportItem {
  type: string;
  distance?: number;
  fuel?: string;
  [key: string]: unknown;
}

interface EnergyItem {
  source: string;
  consumption?: number;
  [key: string]: unknown;
}

export function generateMaterialSuggestions({ materials }: { materials: Material[]; }): string[] {
    if (!materials || materials.length === 0) return [];
    return [
        "Consider replacing concrete with engineered wood products for appropriate applications.",
        "Look into low-carbon cement alternatives that can reduce emissions by up to 30%.",
        "Source locally produced materials to reduce transportation carbon footprint."
    ];
}

export function generateTransportSuggestions(transport: TransportItem[]): string[] {
    if (!transport || transport.length === 0) return [];
    return [
        "Optimize delivery routes to minimize fuel consumption.",
        "Consider using electric vehicles for short-distance material transport.",
        "Implement a just-in-time delivery system to reduce unnecessary trips."
    ];
}

export function generateEnergySuggestions(energy: EnergyItem[]): string[] {
    if (!energy || energy.length === 0) return [];
    return [
        "Install solar panels or wind turbines on-site to generate clean energy during construction.",
        "Use energy-efficient machinery and equipment during construction.",
        "Implement an energy management system to monitor and optimize energy usage."
    ];
}

export function generateGeneralSuggestions(): string[] {
    return [
        "Conduct a detailed life cycle assessment to identify further carbon reduction opportunities.",
        "Establish a carbon monitoring system for ongoing tracking and reporting.",
        "Train your workforce on sustainable construction practices to improve overall efficiency."
    ];
}
