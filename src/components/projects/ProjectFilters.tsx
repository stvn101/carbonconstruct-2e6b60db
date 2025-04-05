
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface ProjectFiltersProps {
  allTags: string[];
  selectedTag: string | null;
  onTagChange: (tag: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ProjectFilters = ({ 
  allTags, 
  selectedTag, 
  onTagChange, 
  searchQuery,
  onSearchChange 
}: ProjectFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2 flex-wrap">
        <Badge 
          variant={selectedTag === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onTagChange(null)}
        >
          All
        </Badge>
        {allTags.map(tag => (
          <Badge 
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onTagChange(tag === selectedTag ? null : tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
