
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult } from "@/lib/carbonCalculations";

interface EmissionsBreakdownChartProps {
  result: CalculationResult;
}

const EmissionsBreakdownChart = ({ result }: EmissionsBreakdownChartProps) => {
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

  // Color palette for the charts - updated to use carbon/green theme colors
  const COLORS = ['#3e9847', '#25612d', '#214d28', '#8acd91', '#b8e2bc', '#5db166'];

  return (
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
  );
};

export default EmissionsBreakdownChart;
