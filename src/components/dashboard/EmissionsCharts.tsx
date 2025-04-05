
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { BarChart3 } from "lucide-react";

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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-carbon-600" />
            Emissions Trend
          </CardTitle>
          <CardDescription>
            Your carbon emissions over the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[240px]">
            <Chart 
              type="bar"
              data={emissionsData}
              categories={["total"]}
              index="name"
              colors={["#16a34a"]}
              valueFormatter={(value) => `${value} kg CO₂e`}
              showLegend={false}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-carbon-600" />
            Emissions by Category
          </CardTitle>
          <CardDescription>
            Breakdown of your carbon footprint
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[240px]">
            <Chart 
              type="pie"
              data={categoryData}
              categories={["value"]}
              index="name"
              colors={["#16a34a", "#2563eb", "#ea580c"]}
              valueFormatter={(value) => `${value}%`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
