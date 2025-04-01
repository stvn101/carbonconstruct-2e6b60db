
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
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

  // Animation variants
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: 0.2,
        ease: "easeOut"
      } 
    }
  };

  const config = {
    materials: { color: '#3e9847', label: 'Materials' },
    transport: { color: '#25612d', label: 'Transport' },
    energy: { color: '#214d28', label: 'Energy' },
  };

  const CustomTooltip = ({ active, payload }: any) => {
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
  };

  const renderCustomizedLabel = ({ name, percent }: any) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={chartVariants}
    >
      <Card>
        <CardHeader>
          <CardTitle>Emissions Breakdown</CardTitle>
          <CardDescription>
            Distribution of emissions by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ChartContainer config={config}>
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
                    label={renderCustomizedLabel}
                    animationBegin={200}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {mainBreakdownData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    wrapperStyle={{ 
                      paddingTop: "12px", 
                      fontSize: "12px" 
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmissionsBreakdownChart;
