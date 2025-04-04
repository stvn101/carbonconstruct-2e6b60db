
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

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
  allRegions: string[];
  baseOptions: Array<{ id: string; name: string }>;
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
  baseOptions,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium">
          Search Materials
        </label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            type="text" 
            placeholder="Search by name..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="region" className="text-sm font-medium">
          Filter by Region
        </label>
        <Select
          value={selectedRegion}
          onValueChange={setSelectedRegion}
        >
          <SelectTrigger id="region">
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {allRegions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="alternative" className="text-sm font-medium">
          Show Alternatives For
        </label>
        <Select
          value={selectedAlternative}
          onValueChange={setSelectedAlternative}
        >
          <SelectTrigger id="alternative">
            <SelectValue placeholder="All Materials" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">All Materials</SelectItem>
            {baseOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="tag" className="text-sm font-medium">
          Filter by Tag
        </label>
        <Select
          value={selectedTag}
          onValueChange={setSelectedTag}
        >
          <SelectTrigger id="tag">
            <SelectValue placeholder="All Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MaterialFilters;
