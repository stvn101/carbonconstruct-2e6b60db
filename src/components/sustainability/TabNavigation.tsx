
import React from "react";
import { Button } from "@/components/ui/button";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, BarChart3, Shield, Recycle, TrendingUp, FileText } from "lucide-react";
import { TabNavigationProps } from "./types";

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab, navigateTab }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <TabsList>
        <TabsTrigger value="dashboard" className="flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Data</span>
        </TabsTrigger>
        <TabsTrigger value="compliance" className="flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Compliance</span>
          <span className="sm:hidden">Regs</span>
        </TabsTrigger>
        <TabsTrigger value="materials" className="flex items-center">
          <Recycle className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Alternatives</span>
          <span className="sm:hidden">Alt</span>
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Performance</span>
          <span className="sm:hidden">Perf</span>
        </TabsTrigger>
        <TabsTrigger value="report" className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Report</span>
          <span className="sm:hidden">Rep</span>
        </TabsTrigger>
      </TabsList>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigateTab("prev")}
          disabled={activeTab === "dashboard"}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigateTab("next")}
          disabled={activeTab === "report"}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TabNavigation;
