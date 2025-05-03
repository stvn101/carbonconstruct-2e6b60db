
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface MaterialFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedAlternative: string;
  setSelectedAlternative: (value: string) => void;
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  allTags: string[];
  baseOptions: Array<{id: string, name: string}>;
  categories?: string[];
}

const MaterialFilters: React.FC<MaterialFiltersProps> = ({ 
  searchTerm, 
  setSearchTerm,
  selectedAlternative,
  setSelectedAlternative,
  selectedTag,
  setSelectedTag,
  allTags,
  baseOptions,
  categories = []
}) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Handle clearing search
  const handleClearSearch = () => {
    setSearchTerm("");
  };
  
  // Ensure we have valid arrays
  const safeTags = Array.isArray(allTags) ? allTags : [];
  const safeBaseOptions = Array.isArray(baseOptions) ? baseOptions : [];
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  // Count active filters
  const activeFilterCount = [
    selectedAlternative !== "none",
    selectedTag !== "all",
    activeTab !== "all"
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchTerm && (
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
      
      {/* Category tabs - only show if we have categories */}
      {safeCategories.length > 0 && (
        <div className="overflow-x-auto pb-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Categories</TabsTrigger>
              {safeCategories.slice(0, 10).map((category, index) => (
                <TabsTrigger key={`cat-${index}`} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Alternative To</label>
          <Select
            value={selectedAlternative}
            onValueChange={setSelectedAlternative}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Materials</SelectItem>
              {safeBaseOptions.map((option, index) => (
                <SelectItem key={`opt-${index}`} value={option.id || `opt-${index}`}>
                  {option.name || option.id || `Option ${index}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-medium">Tag</label>
          <Select
            value={selectedTag}
            onValueChange={setSelectedTag}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {safeTags.map((tag, index) => (
                <SelectItem 
                  key={`tag-${index}`}
                  value={tag}
                  className={tag === "australian" ? "text-carbon-600 font-medium" : ""}
                >
                  {tag === "australian" ? "🇦🇺 Australian" : tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        {activeFilterCount > 0 && (
          <Badge variant="outline" className="text-xs">
            {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
          </Badge>
        )}
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchTerm("");
            setSelectedAlternative("none");
            setSelectedTag("all");
            setActiveTab("all");
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default MaterialFilters;
