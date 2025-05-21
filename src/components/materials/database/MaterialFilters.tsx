
/**
 * Material Filters component
 * Provides additional filtering options for materials database
 */
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MaterialFiltersProps {
  categoriesList: string[];
  materialsByRegion: Record<string, number>;
}

const MaterialFilters: React.FC<MaterialFiltersProps> = ({
  categoriesList,
  materialsByRegion
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="rounded-md border p-2"
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between p-1">
        <span className="text-sm font-medium">Advanced Filters</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      
      <CollapsibleContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Categories section */}
          <div>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="flex flex-wrap gap-1">
              {categoriesList.map((category) => (
                <Badge key={category} variant="outline" className="cursor-pointer">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Regions section */}
          <div>
            <h3 className="text-sm font-medium mb-2">Regions</h3>
            <div className="flex flex-wrap gap-1">
              {Object.entries(materialsByRegion).map(([region, count]) => (
                <Badge key={region} variant="outline" className="cursor-pointer">
                  {region} ({count})
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default MaterialFilters;
