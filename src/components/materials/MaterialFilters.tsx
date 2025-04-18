
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface MaterialFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRegion: string;
  setSelectedRegion: (value: string) => void;
  selectedAlternative: string;
  setSelectedAlternative: (value: string) => void;
  selectedTag: string;
  setSelectedTag: (value: string) => void;
  allTags: string[];
  allRegions: readonly string[] | string[];
  baseOptions: Array<{id: string, name: string}>;
}

const MaterialFilters: React.FC<MaterialFiltersProps> = ({ 
  searchTerm, 
  setSearchTerm,
  selectedRegion,
  setSelectedRegion,
  selectedAlternative,
  setSelectedAlternative,
  selectedTag,
  setSelectedTag,
  allTags,
  allRegions,
  baseOptions
}) => {
  // Set Australia as default if no region is selected
  React.useEffect(() => {
    if (selectedRegion === "all") {
      setSelectedRegion("Australia");
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Region</label>
          <Select
            value={selectedRegion}
            onValueChange={setSelectedRegion}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {Array.from(allRegions).map((region) => (
                <SelectItem 
                  key={region} 
                  value={region}
                  className={region === "Australia" ? "text-carbon-600 font-medium" : ""}
                >
                  {region === "Australia" ? "🇦🇺 Australia" : region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
              {baseOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
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
              {allTags.map((tag) => (
                <SelectItem 
                  key={tag} 
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
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            setSearchTerm("");
            setSelectedRegion("all");
            setSelectedAlternative("none");
            setSelectedTag("all");
          }}
        >
          Clear Filters
        </Button>
      </div>
    </div>
  );
};

export default MaterialFilters;
