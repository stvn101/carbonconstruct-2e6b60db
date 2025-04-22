
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { CalculationResult } from "@/lib/carbonCalculations";
import { useMemo } from "react";

interface EmissionsBreakdownChartProps {
  result: CalculationResult;
}

const EmissionsBreakdownChart = ({ result }: EmissionsBreakdownChartProps) => {
  // Memoize the data processing to avoid recalculation on every render
  const { dataWithPercentage, filteredData } = useMemo(() => {
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

    // Filter out zero values to prevent rendering issues
    const filtered = mainBreakdownData.filter(item => item.value > 0);

    // Calculate percentages for labels
    const total = filtered.reduce((acc, item) => acc + item.value, 0);
    const withPercentage = filtered.map(item => ({
      ...item,
      percentage: ((item.value / total) * 100).toFixed(1)
    }));

    return { dataWithPercentage: withPercentage, filteredData: filtered };
  }, [result.materialEmissions, result.transportEmissions, result.energyEmissions]);

  // Color palette for the charts - memoized to avoid recreation
  const COLORS = useMemo(() => 
    ['#3e9847', '#25612d', '#214d28', '#8acd91', '#b8e2bc'],
    []
  );

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-md shadow-md p-3 text-sm max-w-[90vw] overflow-hidden">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-carbon-600 dark:text-carbon-300">
            {payload[0].value.toFixed(2)} kg CO2e ({payload[0].payload.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is significant enough
    if (percent < 0.05) return null;

    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="500"
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={chartVariants}
    >
      <Card>
        <CardHeader className="sm:pt-6 pt-4">
          <CardTitle>Emissions Breakdown</CardTitle>
          <CardDescription>
            Distribution of carbon emissions by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataWithPercentage}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={renderCustomizedLabel}
                    animationBegin={200}
                    animationDuration={800}
                    animationEasing="ease-out"
                  >
                    {dataWithPercentage.map((entry, index) => (
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
                    formatter={(value, entry, index) => (
                      <span className="text-sm font-medium">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-muted-foreground">No emission data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmissionsBreakdownChart;
