
import React from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

interface SearchCollapsibleProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSearch: () => void;
  children: React.ReactNode;
}

const SearchCollapsible: React.FC<SearchCollapsibleProps> = ({
  isOpen,
  onOpenChange,
  onSearch,
  children
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="flex w-full items-center justify-between p-1 text-sm font-medium">
        <span className="flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-2 space-y-4">
        {children}
        
        {/* Search Button */}
        <Button onClick={onSearch} className="w-full">Apply Filters</Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SearchCollapsible;
