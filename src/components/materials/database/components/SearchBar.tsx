
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  useAdvancedSearch: boolean;
  onToggleAdvancedSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  useAdvancedSearch,
  onToggleAdvancedSearch,
}) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      {!useAdvancedSearch && (
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-9"
          />
        </div>
      )}
      <Button
        variant={useAdvancedSearch ? "default" : "outline"}
        onClick={onToggleAdvancedSearch}
      >
        {useAdvancedSearch ? "Simple Search" : "Advanced Search"}
      </Button>
    </div>
  );
};

export default SearchBar;
