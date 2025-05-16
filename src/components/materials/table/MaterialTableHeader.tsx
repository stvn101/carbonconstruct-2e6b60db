
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const MaterialTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[30%] md:w-[25%]">Material</TableHead>
        <TableHead className="hidden sm:table-cell w-[20%]">Category</TableHead>
        <TableHead className="w-[40%] md:w-[25%]">
          <div className="flex items-center">
            Carbon Footprint
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px] text-xs">
                  <p>Carbon footprint in kg CO2e per kg of material</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </TableHead>
        <TableHead className="hidden md:table-cell">Region</TableHead>
        <TableHead className="hidden lg:table-cell">Tags</TableHead>
      </TableRow>
    </TableHeader>
  );
};
