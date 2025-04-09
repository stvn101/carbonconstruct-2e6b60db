
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Chart } from "@/components/ui/chart";
import { LucideIcon } from "lucide-react";

interface ChartCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  chartData: any[];
  chartType: 'bar' | 'line' | 'pie' | 'area';
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  height?: string;
}

export const ChartCard = ({
  title,
  description,
  icon: Icon,
  chartData,
  chartType,
  categories,
  index,
  colors,
  valueFormatter,
  showLegend = true,
  height = "h-[240px]"
}: ChartCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Icon className="h-5 w-5 mr-2 text-carbon-600 dark:text-carbon-400" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 px-2">
        <div className={`${height} w-full`}>
          <Chart 
            type={chartType}
            data={chartData}
            categories={categories}
            index={index}
            colors={colors}
            valueFormatter={valueFormatter}
            showLegend={showLegend}
            className="max-w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};
