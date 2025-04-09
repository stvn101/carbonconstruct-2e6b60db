
import { BarChart3 } from "lucide-react";
import { ChartCard } from "./ChartCard";

export const EmissionsCharts = () => {
  // Mock data for charts
  const emissionsData = [
    { name: "Jan", total: 2400 },
    { name: "Feb", total: 1398 },
    { name: "Mar", total: 9800 },
    { name: "Apr", total: 3908 },
    { name: "May", total: 4800 },
    { name: "Jun", total: 3800 },
  ];
  
  const categoryData = [
    { name: "Materials", value: 65 },
    { name: "Transport", value: 15 },
    { name: "Energy", value: 20 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-6">
      <ChartCard
        title="Emissions Trend"
        description="Your carbon emissions over the past 6 months"
        icon={BarChart3}
        chartData={emissionsData}
        chartType="bar"
        categories={["total"]}
        index="name"
        colors={["#16a34a"]}
        valueFormatter={(value) => `${value} kg CO₂e`}
        showLegend={false}
        height="h-[220px]"
      />
      <ChartCard
        title="Emissions by Category"
        description="Breakdown of your carbon footprint"
        icon={BarChart3}
        chartData={categoryData}
        chartType="pie"
        categories={["value"]}
        index="name"
        colors={["#16a34a", "#2563eb", "#ea580c"]}
        valueFormatter={(value) => `${value}%`}
        height="h-[220px]"
      />
    </div>
  );
};
