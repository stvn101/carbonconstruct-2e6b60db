
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Database, HelpCircle } from "lucide-react";
import { EnrichedMaterial } from "@/utils/materialUtils";
import MaterialDetailsDialog from "./MaterialDetailsDialog";
import SortIndicator from "./SortIndicator";

interface MaterialsBrowseTabProps {
  allCategories: string[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  showAlternativesOnly: boolean;
  setShowAlternativesOnly: (value: boolean) => void;
  sortedMaterials: EnrichedMaterial[];
  sortField: keyof EnrichedMaterial;
  sortDirection: "asc" | "desc";
  handleSort: (field: keyof EnrichedMaterial) => void;
  totalMaterialCount: number;
}

const MaterialsBrowseTab: React.FC<MaterialsBrowseTabProps> = ({
  allCategories,
  searchTerm,
  setSearchTerm,
  selectedCategories,
  setSelectedCategories,
  showAlternativesOnly,
  setShowAlternativesOnly,
  sortedMaterials,
  sortField,
  sortDirection,
  handleSort,
  totalMaterialCount
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-1">Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {allCategories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={(checked) => {
                            setSelectedCategories(
                              checked 
                                ? [...selectedCategories, category]
                                : selectedCategories.filter(c => c !== category)
                            );
                          }}
                        />
                        <label 
                          htmlFor={`category-${category}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-alternatives"
                    checked={showAlternativesOnly}
                    onCheckedChange={(checked) => {
                      setShowAlternativesOnly(!!checked);
                    }}
                  />
                  <label 
                    htmlFor="show-alternatives"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show sustainable alternatives only
                  </label>
                </div>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => {
                    setSelectedCategories([]);
                    setShowAlternativesOnly(false);
                    setSearchTerm("");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("factor")}>
                <div className="flex items-center">
                  Emission Factor
                  <SortIndicator 
                    active={sortField === "factor"} 
                    direction={sortDirection} 
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60">Emissions per kg of material (kg CO₂e/kg)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort("sustainabilityScore")}>
                <div className="flex items-center">
                  Sustainability
                  <SortIndicator 
                    active={sortField === "sustainabilityScore"} 
                    direction={sortDirection} 
                  />
                </div>
              </TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMaterials.map((material) => (
              <TableRow key={material.type}>
                <TableCell>
                  <div>
                    {material.type}
                    {material.alternativeToStandard && (
                      <Badge className="ml-2 bg-green-600">Eco</Badge>
                    )}
                  </div>
                  <div className="md:hidden text-xs text-muted-foreground mt-1">
                    {material.category}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{material.category}</TableCell>
                <TableCell>
                  {material.factor} kg CO₂e/kg
                  {material.carbonReduction > 0 && (
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {material.carbonReduction}% less CO₂
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className="bg-carbon-600 h-2.5 rounded-full" 
                        style={{ width: `${material.sustainabilityScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{material.sustainabilityScore}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <MaterialDetailsDialog material={material} />
                </TableCell>
              </TableRow>
            ))}
            {sortedMaterials.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Database className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p>No materials found matching your filters</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        Showing {sortedMaterials.length} of {totalMaterialCount} materials
      </p>
    </>
  );
};

export default MaterialsBrowseTab;
