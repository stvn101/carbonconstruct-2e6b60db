
import { BenchmarkData, Project, YearlyTrend, ImprovementRecommendation } from "./types";

export const INDUSTRY_BENCHMARKS: Record<string, BenchmarkData> = {
  residential: {
    name: "Residential",
    average: 320,
    low: 180,
    high: 450,
    unit: "kg CO2e/m²"
  },
  commercial: {
    name: "Commercial",
    average: 580,
    low: 350,
    high: 850,
    unit: "kg CO2e/m²"
  },
  industrial: {
    name: "Industrial",
    average: 720,
    low: 480,
    high: 1200,
    unit: "kg CO2e/m²"
  },
  institutional: {
    name: "Institutional",
    average: 500,
    low: 320,
    high: 720,
    unit: "kg CO2e/m²"
  }
};

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 1,
    name: "Riverside Apartments",
    type: "residential",
    location: "Portland, OR",
    emissions: 260,
    area: 15000,
    materialsScore: 72,
    transportScore: 85,
    energyScore: 68,
    wasteScore: 76,
    waterScore: 80
  },
  {
    id: 2,
    name: "Metro Office Tower",
    type: "commercial",
    location: "Seattle, WA",
    emissions: 490,
    area: 35000,
    materialsScore: 65,
    transportScore: 55,
    energyScore: 80,
    wasteScore: 70,
    waterScore: 60
  },
  {
    id: 3,
    name: "Green Valley Hospital",
    type: "institutional",
    location: "Denver, CO",
    emissions: 310,
    area: 42000,
    materialsScore: 85,
    transportScore: 60,
    energyScore: 90,
    wasteScore: 78,
    waterScore: 82
  },
  {
    id: 4,
    name: "Eastside Manufacturing",
    type: "industrial",
    location: "Detroit, MI",
    emissions: 680,
    area: 50000,
    materialsScore: 40,
    transportScore: 35,
    energyScore: 50,
    wasteScore: 45,
    waterScore: 38
  },
  {
    id: 5,
    name: "Current Project",
    type: "residential",
    location: "Your Location",
    emissions: 220,
    area: 12000,
    materialsScore: 78,
    transportScore: 73,
    energyScore: 82,
    wasteScore: 70,
    waterScore: 75,
    isCurrent: true
  }
];

export const INDUSTRY_TRENDS: YearlyTrend[] = [
  { year: 2018, residential: 380, commercial: 650, industrial: 850, institutional: 570 },
  { year: 2019, residential: 360, commercial: 630, industrial: 820, institutional: 550 },
  { year: 2020, residential: 350, commercial: 610, industrial: 790, institutional: 530 },
  { year: 2021, residential: 335, commercial: 595, industrial: 760, institutional: 520 },
  { year: 2022, residential: 325, commercial: 585, industrial: 740, institutional: 510 },
  { year: 2023, residential: 320, commercial: 580, industrial: 720, institutional: 500 }
];

export const IMPROVEMENT_RECOMMENDATIONS: ImprovementRecommendation[] = [
  { 
    id: 1, 
    category: "Materials", 
    recommendation: "Switch to low-carbon concrete alternatives",
    impact: "high",
    potentialReduction: "15-20%",
    complexity: "medium"
  },
  { 
    id: 2, 
    category: "Transport", 
    recommendation: "Source materials locally (within 100 miles)",
    impact: "medium",
    potentialReduction: "8-12%",
    complexity: "low"
  },
  { 
    id: 3, 
    category: "Energy", 
    recommendation: "Implement on-site renewable energy generation",
    impact: "high",
    potentialReduction: "20-30%",
    complexity: "high"
  },
  { 
    id: 4, 
    category: "Materials", 
    recommendation: "Increase use of recycled and reclaimed materials",
    impact: "medium",
    potentialReduction: "10-15%",
    complexity: "low"
  },
  { 
    id: 5, 
    category: "Energy", 
    recommendation: "Improve equipment efficiency and reduce idle time",
    impact: "medium",
    potentialReduction: "5-10%",
    complexity: "low"
  }
];
