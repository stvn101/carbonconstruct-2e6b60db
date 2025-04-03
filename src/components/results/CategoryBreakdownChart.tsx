
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult, Material, Transport, Energy, MATERIAL_FACTORS, TRANSPORT_FACTORS, ENERGY_FACTORS } from "@/lib/carbonCalculations";
import { Progress } from "@/components/ui/progress";

interface CategoryBreakdownChartProps {
  result: CalculationResult;
  category: 'material' | 'transport' | 'energy';
}

const CategoryBreakdownChart = ({ result, category }: CategoryBreakdownChartProps) => {
  let chartData = [];
  let categoryTitle = "";
  let categoryDescription = "";
  let fillColor = "";
  let totalCategoryEmissions = 0;

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
      totalCategoryEmissions = result.materialEmissions;
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
      totalCategoryEmissions = result.transportEmissions;
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
      totalCategoryEmissions = result.energyEmissions;
      break;
  }

  // Filter out any items with zero or extremely small values
  const filteredChartData = chartData.filter(item => item.value > 0.01);

  // Animation variants with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const CustomTooltip = ({active, payload, label}: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalCategoryEmissions) * 100).toFixed(1);
      return (
        <div className="bg-background border border-border rounded-md shadow-md p-3 text-sm">
          <p className="font-medium">{label}</p>
          <p className="text-carbon-600">
            {payload[0].value.toFixed(2)} kg CO2e ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card>
        <CardHeader>
          <CardTitle>{categoryTitle}</CardTitle>
          <CardDescription>
            {categoryDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredChartData.length > 0 ? (
            <>
              <motion.div className="h-72" variants={chartVariants}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis 
                      label={{ 
                        value: 'kg CO2e', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { textAnchor: 'middle', fontSize: 12 }
                      }}
                      tickFormatter={(value) => typeof value === 'number' ? `${value.toFixed(0)}` : value} 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="value" 
                      fill={fillColor} 
                      radius={[4, 4, 0, 0]}
                      animationBegin={0}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Add progress bars for each item */}
              <div className="mt-6 space-y-3">
                {filteredChartData.map((item, index) => {
                  const percentage = (item.value / totalCategoryEmissions) * 100;
                  return (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span>{item.value.toFixed(2)} kg CO2e ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2" 
                        indicatorClassName="bg-carbon-500"
                        style={{backgroundColor: "#e5e7eb"}}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-muted-foreground">No {category} emission data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryBreakdownChart;
