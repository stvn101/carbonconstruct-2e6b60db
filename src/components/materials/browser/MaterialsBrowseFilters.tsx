
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SlidersHorizontal } from "lucide-react";

interface MaterialsBrowseFiltersProps {
  allCategories: string[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  showAlternativesOnly: boolean;
  setShowAlternativesOnly: (value: boolean) => void;
}

const MaterialsBrowseFilters: React.FC<MaterialsBrowseFiltersProps> = ({
  allCategories,
  searchTerm,
  setSearchTerm,
  selectedCategories,
  setSelectedCategories,
  showAlternativesOnly,
  setShowAlternativesOnly,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search materials..."
          className="pl-9"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
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
                        onCheckedChange={checked => {
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
                  onCheckedChange={checked => setShowAlternativesOnly(!!checked)}
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
  );
};

export default MaterialsBrowseFilters;
