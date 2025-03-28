
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Leaf, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalculationResult,
  MaterialInput,
  TransportInput,
  EnergyInput,
  generateSuggestions,
  MATERIAL_FACTORS,
  TRANSPORT_FACTORS,
  ENERGY_FACTORS
} from "@/lib/carbonCalculations";

const COLORS = ["#2DD4BF", "#0EA5E9", "#8B5CF6", "#EC4899", "#F97316", "#10B981", "#6366F1", "#ef4444"];

interface CalculatorResultsProps {
  result: CalculationResult;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
}

const CalculatorResults = ({ result, materials, transport, energy }: CalculatorResultsProps) => {
  // Prepare data for the summary pie chart
  const summaryData = [
    { name: "Materials", value: result.materialEmissions },
    { name: "Transport", value: result.transportEmissions },
    { name: "Energy", value: result.energyEmissions }
  ];

  // Prepare data for the materials bar chart
  const materialsData = Object.entries(result.breakdownByMaterial).map(([key, value]) => ({
    name: MATERIAL_FACTORS[key as keyof typeof MATERIAL_FACTORS].name,
    emissions: value
  }));

  // Prepare data for the transport bar chart
  const transportData = Object.entries(result.breakdownByTransport).map(([key, value]) => ({
    name: TRANSPORT_FACTORS[key as keyof typeof TRANSPORT_FACTORS].name,
    emissions: value
  }));

  // Prepare data for the energy bar chart
  const energyData = Object.entries(result.breakdownByEnergy).map(([key, value]) => ({
    name: ENERGY_FACTORS[key as keyof typeof ENERGY_FACTORS].name,
    emissions: value
  }));

  // Generate improvement suggestions
  const suggestions = generateSuggestions(result);

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Carbon Footprint Results</CardTitle>
            <CardDescription>
              Your project's estimated carbon footprint based on the inputs provided
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-carbon-50">
                <div className="text-sm text-muted-foreground mb-2">Total Emissions</div>
                <div className="text-3xl font-bold text-carbon-800">
                  {result.totalEmissions.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO<sub>2</sub>e
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-carbon-50">
                <div className="text-sm text-muted-foreground mb-2">Equivalent To</div>
                <div className="text-xl font-medium text-carbon-800">
                  {(result.totalEmissions / 120).toLocaleString(undefined, { maximumFractionDigits: 1 })} trees needed for 1 year
                </div>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-carbon-50">
                <div className="text-sm text-muted-foreground mb-2">Per Square Meter</div>
                <div className="text-xl font-medium text-carbon-800">
                  {(result.totalEmissions / 100).toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO<sub>2</sub>e/m²
                </div>
                <div className="text-xs text-muted-foreground mt-1">(Based on 100m² estimate)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Emission Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Emission Breakdown</CardTitle>
            <CardDescription>
              See how different aspects of your project contribute to its carbon footprint
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col h-[300px]">
                <h4 className="text-sm font-medium text-center mb-4">Emissions by Category</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summaryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {summaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value.toFixed(2)} kg CO₂e`, 'Emissions']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Materials</span>
                    <span className="font-medium">{result.materialEmissions.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO₂e</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${(result.materialEmissions / result.totalEmissions) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Transport</span>
                    <span className="font-medium">{result.transportEmissions.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO₂e</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(result.transportEmissions / result.totalEmissions) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Energy</span>
                    <span className="font-medium">{result.energyEmissions.toLocaleString(undefined, { maximumFractionDigits: 2 })} kg CO₂e</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(result.energyEmissions / result.totalEmissions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Breakdowns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Materials Breakdown */}
        {materialsData.length > 0 && (
          <Card className="col-span-1 md:col-span-3 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Materials Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={materialsData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(2)} kg CO₂e`, 'Emissions']}
                    />
                    <Bar dataKey="emissions" fill="#2DD4BF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transport Breakdown */}
        {transportData.length > 0 && (
          <Card className="col-span-1 md:col-span-3 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Transport Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transportData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(2)} kg CO₂e`, 'Emissions']}
                    />
                    <Bar dataKey="emissions" fill="#0EA5E9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Energy Breakdown */}
        {energyData.length > 0 && (
          <Card className="col-span-1 md:col-span-3 lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Energy Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyData} layout="vertical">
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(2)} kg CO₂e`, 'Emissions']}
                    />
                    <Bar dataKey="emissions" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-500" />
              <CardTitle>Improvement Suggestions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Based on your project's carbon footprint, here are some suggestions to reduce emissions:
              </AlertDescription>
            </Alert>
            <ul className="mt-4 space-y-2">
              {suggestions.map((suggestion, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                >
                  <div className="mr-2 mt-1">
                    <Leaf className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span>{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CalculatorResults;
