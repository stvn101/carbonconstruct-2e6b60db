
import React from "react";
import { 
  BarChart, 
  Bar, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie,
  TooltipProps
} from "recharts";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Leaf, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Material, 
  Transport, 
  Energy, 
  MATERIAL_FACTORS, 
  TRANSPORT_FACTORS, 
  ENERGY_FACTORS,
  CalculationResult,
  MaterialInput,
  TransportInput,
  EnergyInput
} from "@/lib/carbonCalculations";
import { useNavigate } from "react-router-dom";

interface CalculatorResultsProps {
  result: CalculationResult;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  suggestions?: string[];
  onRecalculate?: () => void;
}

// Custom tooltip formatting for charts
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const value = typeof payload[0].value === 'number' ? payload[0].value.toFixed(2) : payload[0].value;
    return (
      <div className="bg-background border border-border rounded-md shadow-md p-2 text-xs">
        <p className="font-medium">{`${label}`}</p>
        <p className="text-carbon-600">{`${value} kg CO2e`}</p>
      </div>
    );
  }
  return null;
};

const CalculatorResults: React.FC<CalculatorResultsProps> = ({ 
  result, 
  materials,
  transport,
  energy,
  suggestions = [
    "Consider using low-carbon alternatives for concrete and steel",
    "Source materials locally to reduce transportation emissions",
    "Implement renewable energy sources on-site during construction",
    "Optimize equipment usage to reduce idle time and fuel consumption",
    "Use recycled and reclaimed materials where possible"
  ],
  onRecalculate = () => {}
}) => {
  const navigate = useNavigate();
  
  // Transform data for material emissions chart
  const materialChartData = Object.entries(result.breakdownByMaterial)
    .map(([key, value]) => ({
      name: MATERIAL_FACTORS[key as Material].name,
      value: Number(value.toFixed(2))
    }))
    .sort((a, b) => b.value - a.value);

  // Transform data for transport emissions chart
  const transportChartData = Object.entries(result.breakdownByTransport)
    .map(([key, value]) => ({
      name: TRANSPORT_FACTORS[key as Transport].name,
      value: Number(value.toFixed(2))
    }))
    .sort((a, b) => b.value - a.value);

  // Transform data for energy emissions chart
  const energyChartData = Object.entries(result.breakdownByEnergy)
    .map(([key, value]) => ({
      name: ENERGY_FACTORS[key as Energy].name,
      value: Number(value.toFixed(2))
    }))
    .sort((a, b) => b.value - a.value);

  // Main emissions breakdown chart
  const mainBreakdownData = [
    { 
      name: 'Materials', 
      value: Number(result.materialEmissions.toFixed(2)) 
    },
    { 
      name: 'Transport', 
      value: Number(result.transportEmissions.toFixed(2)) 
    },
    { 
      name: 'Energy', 
      value: Number(result.energyEmissions.toFixed(2)) 
    }
  ];

  // Color palette for the charts
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF', '#8B5CF6'];
  
  // Calculate emission intensity category
  let intensityCategory = 'moderate';
  const emissionsPerUnit = result.totalEmissions;
  
  if (emissionsPerUnit < 100) {
    intensityCategory = 'low';
  } else if (emissionsPerUnit > 500) {
    intensityCategory = 'high';
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Carbon Footprint Results</h2>
        <p className="text-muted-foreground">
          Here's a breakdown of the carbon emissions for your construction project.
        </p>
      </div>
      
      {/* Summary Card */}
      <Card className="border-carbon-100">
        <CardHeader>
          <CardTitle>Total Carbon Footprint</CardTitle>
          <CardDescription>
            The overall environmental impact of your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <span className="text-5xl font-bold text-carbon-600">
              {result.totalEmissions.toFixed(2)}
            </span>
            <span className="text-lg ml-2">kg CO2e</span>
          </div>
          
          <Alert className={
            intensityCategory === 'low' 
              ? "border-green-500 bg-green-50 text-green-800" 
              : intensityCategory === 'high'
                ? "border-red-500 bg-red-50 text-red-800"
                : "border-yellow-500 bg-yellow-50 text-yellow-800"
          }>
            <div className="flex items-center gap-2">
              {intensityCategory === 'low' ? (
                <Leaf className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertTitle className="font-medium">
                {intensityCategory === 'low' 
                  ? 'Low Carbon Intensity' 
                  : intensityCategory === 'high'
                    ? 'High Carbon Intensity'
                    : 'Moderate Carbon Intensity'
                }
              </AlertTitle>
            </div>
            <AlertDescription className="mt-2 text-sm">
              {intensityCategory === 'low' 
                ? 'Great job! Your project has relatively low carbon emissions. Continue these sustainable practices in future projects.'
                : intensityCategory === 'high'
                  ? 'Your project has a significant carbon footprint. Consider implementing the suggested improvements to reduce emissions.'
                  : 'Your project has a moderate carbon footprint. There is room for improvement - check the suggestions below.'
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Main Breakdown Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Emissions Breakdown</CardTitle>
          <CardDescription>
            Distribution of emissions by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mainBreakdownData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {mainBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={({active, payload, label}) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-md shadow-md p-2 text-xs">
                        <p className="font-medium">{payload[0].name}</p>
                        <p className="text-carbon-600">
                          {typeof payload[0].value === 'number' ? 
                            `${payload[0].value.toFixed(2)} kg CO2e` : 
                            payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Materials Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Material Emissions</CardTitle>
          <CardDescription>
            Carbon footprint by material type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => typeof value === 'number' ? `${value.toFixed(0)}` : value} />
                <Tooltip content={({active, payload, label}) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-md shadow-md p-2 text-xs">
                        <p className="font-medium">{label}</p>
                        <p className="text-carbon-600">
                          {typeof payload[0].value === 'number' ? 
                            `${payload[0].value.toFixed(2)} kg CO2e` : 
                            payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="value" fill="#9b87f5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Transport Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Transport Emissions</CardTitle>
          <CardDescription>
            Carbon footprint by transport method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transportChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => typeof value === 'number' ? `${value.toFixed(0)}` : value} />
                <Tooltip content={({active, payload, label}) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-md shadow-md p-2 text-xs">
                        <p className="font-medium">{label}</p>
                        <p className="text-carbon-600">
                          {typeof payload[0].value === 'number' ? 
                            `${payload[0].value.toFixed(2)} kg CO2e` : 
                            payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="value" fill="#7E69AB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Energy Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Emissions</CardTitle>
          <CardDescription>
            Carbon footprint by energy source
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => typeof value === 'number' ? `${value.toFixed(0)}` : value} />
                <Tooltip content={({active, payload, label}) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-md shadow-md p-2 text-xs">
                        <p className="font-medium">{label}</p>
                        <p className="text-carbon-600">
                          {typeof payload[0].value === 'number' ? 
                            `${payload[0].value.toFixed(2)} kg CO2e` : 
                            payload[0].value}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="value" fill="#6E59A5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Improvement Suggestions</CardTitle>
          <CardDescription>
            Recommendations to reduce your project's carbon footprint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <Leaf className="h-5 w-5 text-carbon-500 mt-0.5 flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between flex-wrap gap-2">
          <Button onClick={onRecalculate} variant="outline">
            Recalculate
          </Button>
          <Button onClick={() => navigate("/calculator")}>
            New Calculation
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CalculatorResults;
