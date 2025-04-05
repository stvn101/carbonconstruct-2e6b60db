
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Leaf } from "lucide-react";

export const ReportsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>
          Generate and view carbon footprint reports
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-full">
                <FileText className="h-5 w-5 text-carbon-600" />
              </div>
              <span className="text-xs text-muted-foreground">Updated Weekly</span>
            </div>
            <h3 className="font-medium mb-1">Project Summary</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Overview of all your project emissions
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate Report
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-full">
                <BarChart3 className="h-5 w-5 text-carbon-600" />
              </div>
              <span className="text-xs text-muted-foreground">Updated Monthly</span>
            </div>
            <h3 className="font-medium mb-1">Emissions Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed analysis of your carbon footprint
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate Report
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-full">
                <Leaf className="h-5 w-5 text-carbon-600" />
              </div>
              <span className="text-xs text-muted-foreground">Updated Quarterly</span>
            </div>
            <h3 className="font-medium mb-1">Sustainability Report</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Comprehensive sustainability assessment
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
