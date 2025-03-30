
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult, Material, Transport, Energy, MATERIAL_FACTORS, TRANSPORT_FACTORS, ENERGY_FACTORS } from "@/lib/carbonCalculations";

interface CategoryBreakdownChartProps {
  result: CalculationResult;
  category: 'material' | 'transport' | 'energy';
}

const CategoryBreakdownChart = ({ result, category }: CategoryBreakdownChartProps) => {
  let chartData = [];
  let categoryTitle = "";
  let categoryDescription = "";
  let fillColor = "";

  switch (category) {
    case 'material':
      chartData = Object.entries(result.breakdownByMaterial)
        .map(([key, value]) => ({
          name: MATERIAL_FACTORS[key as Material].name,
          value: Number(value.toFixed(2))
        }))
        .sort((a, b) => b.value - a.value);
      categoryTitle = "Material Emissions";
      categoryDescription = "Carbon footprint by material type";
      fillColor = "#3e9847";
      break;
    case 'transport':
      chartData = Object.entries(result.breakdownByTransport)
        .map(([key, value]) => ({
          name: TRANSPORT_FACTORS[key as Transport].name,
          value: Number(value.toFixed(2))
        }))
        .sort((a, b) => b.value - a.value);
      categoryTitle = "Transport Emissions";
      categoryDescription = "Carbon footprint by transport method";
      fillColor = "#25612d";
      break;
    case 'energy':
      chartData = Object.entries(result.breakdownByEnergy)
        .map(([key, value]) => ({
          name: ENERGY_FACTORS[key as Energy].name,
          value: Number(value.toFixed(2))
        }))
        .sort((a, b) => b.value - a.value);
      categoryTitle = "Energy Emissions";
      categoryDescription = "Carbon footprint by energy source";
      fillColor = "#214d28";
      break;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{categoryTitle}</CardTitle>
        <CardDescription>
          {categoryDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
              <Bar dataKey="value" fill={fillColor} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdownChart;
