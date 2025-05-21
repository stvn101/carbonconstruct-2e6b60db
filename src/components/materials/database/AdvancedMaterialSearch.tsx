
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  X,
  RotateCcw
} from 'lucide-react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

interface AdvancedMaterialSearchProps {
  onSearch: (searchParams: SearchParams) => void;
  categories: string[];
  regions: string[];
  tags: string[];
  materialCount: number;
  onResetFilters: () => void;
  className?: string;
}

export interface SearchParams {
  term: string;
  categories: string[];
  regions: string[];
  tags: string[];
  carbonRange: [number, number];
  sustainabilityScore: [number, number];
  recyclability: ('High' | 'Medium' | 'Low')[];
  showOnlyAlternatives: boolean;
}

const defaultSearchParams: SearchParams = {
  term: '',
  categories: [],
  regions: [],
  tags: [],
  carbonRange: [0, 2000],
  sustainabilityScore: [0, 100],
  recyclability: [],
  showOnlyAlternatives: false
};

const AdvancedMaterialSearch: React.FC<AdvancedMaterialSearchProps> = ({
  onSearch,
  categories,
  regions,
  tags,
  materialCount,
  onResetFilters,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>(defaultSearchParams);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({ ...prev, term: e.target.value }));
  };
  
  const handleCategoryToggle = (category: string) => {
    setSearchParams(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
        
      updateActiveFilters('category', category, newCategories.includes(category));
      return { ...prev, categories: newCategories };
    });
  };
  
  const handleRegionToggle = (region: string) => {
    setSearchParams(prev => {
      const newRegions = prev.regions.includes(region)
        ? prev.regions.filter(r => r !== region)
        : [...prev.regions, region];
        
      updateActiveFilters('region', region, newRegions.includes(region));
      return { ...prev, regions: newRegions };
    });
  };
  
  const handleTagToggle = (tag: string) => {
    setSearchParams(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
        
      updateActiveFilters('tag', tag, newTags.includes(tag));
      return { ...prev, tags: newTags };
    });
  };
  
  const handleRecyclabilityToggle = (level: 'High' | 'Medium' | 'Low') => {
    setSearchParams(prev => {
      const newRecyclability = prev.recyclability.includes(level)
        ? prev.recyclability.filter(r => r !== level)
        : [...prev.recyclability, level];
        
      updateActiveFilters('recyclability', level, newRecyclability.includes(level));
      return { ...prev, recyclability: newRecyclability };
    });
  };
  
  const handleCarbonRangeChange = (values: number[]) => {
    setSearchParams(prev => ({ 
      ...prev, 
      carbonRange: [values[0], values[1]] 
    }));
    
    updateActiveFilters(
      'carbonRange', 
      `Carbon: ${values[0]}-${values[1]} kgCO2e`, 
      true, 
      'carbonRange'
    );
  };
  
  const handleSustainabilityScoreChange = (values: number[]) => {
    setSearchParams(prev => ({ 
      ...prev, 
      sustainabilityScore: [values[0], values[1]] 
    }));
    
    updateActiveFilters(
      'sustainabilityScore', 
      `Score: ${values[0]}-${values[1]}`, 
      true,
      'sustainabilityScore'
    );
  };
  
  const handleAlternativesToggle = (checked: boolean) => {
    setSearchParams(prev => ({ 
      ...prev, 
      showOnlyAlternatives: checked 
    }));
    
    updateActiveFilters('alternatives', 'Alternatives Only', checked);
  };
  
  const updateActiveFilters = (
    type: string, 
    value: string, 
    isActive: boolean,
    replaceKey?: string
  ) => {
    setActiveFilters(prev => {
      // If we're replacing a filter type (like range sliders)
      if (replaceKey) {
        const filtered = prev.filter(filter => !filter.startsWith(`${replaceKey}:`));
        return isActive ? [...filtered, `${replaceKey}:${value}`] : filtered;
      }
      
      // Regular toggle behavior
      const filterValue = `${type}:${value}`;
      if (isActive && !prev.includes(filterValue)) {
        return [...prev, filterValue];
      } else if (!isActive) {
        return prev.filter(filter => filter !== filterValue);
      }
      
      return prev;
    });
  };
  
  const handleSearch = () => {
    onSearch(searchParams);
  };
  
  const handleResetFilters = () => {
    setSearchParams(defaultSearchParams);
    setActiveFilters([]);
    onResetFilters();
  };
  
  const removeFilter = (filter: string) => {
    const [type, value] = filter.split(':');
    
    if (type === 'category') {
      handleCategoryToggle(value);
    } else if (type === 'region') {
      handleRegionToggle(value);
    } else if (type === 'tag') {
      handleTagToggle(value);
    } else if (type === 'recyclability') {
      handleRecyclabilityToggle(value as any);
    } else if (type === 'alternatives') {
      handleAlternativesToggle(false);
    } else if (type === 'carbonRange' || type === 'sustainabilityScore') {
      // Reset the respective range to default
      if (type === 'carbonRange') {
        setSearchParams(prev => ({ ...prev, carbonRange: defaultSearchParams.carbonRange }));
      } else {
        setSearchParams(prev => ({ ...prev, sustainabilityScore: defaultSearchParams.sustainabilityScore }));
      }
      
      setActiveFilters(prev => prev.filter(f => !f.startsWith(`${type}:`)));
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Search className="h-5 w-5 mr-2 text-carbon-600" />
            <span>Advanced Search</span>
          </div>
          <Badge variant="outline">{materialCount} Materials</Badge>
        </CardTitle>
        <CardDescription>
          Search and filter materials by various properties
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Box */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchParams.term}
              onChange={handleSearchTermChange}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>
        
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {activeFilters.map(filter => {
              const [type, ...valueParts] = filter.split(':');
              const value = valueParts.join(':'); // Rejoin in case value contained colons
              
              return (
                <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                  {value}
                  <button 
                    onClick={() => removeFilter(filter)} 
                    className="ml-1 rounded-full hover:bg-muted"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {value} filter</span>
                  </button>
                </Badge>
              );
            })}
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetFilters} 
              className="h-6 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        )}

        {/* Advanced Filters */}
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className="flex w-full items-center justify-between p-1 text-sm font-medium">
            <span className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-2 space-y-4">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium mb-2">Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category}`}
                      checked={searchParams.categories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label 
                      htmlFor={`category-${category}`}
                      className="text-sm cursor-pointer"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Regions */}
            <div>
              <h3 className="text-sm font-medium mb-2">Regions</h3>
              <div className="flex flex-wrap gap-2">
                {regions.map((region) => (
                  <Badge
                    key={region}
                    variant={searchParams.regions.includes(region) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleRegionToggle(region)}
                  >
                    {region}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="text-sm font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 15).map((tag) => (
                  <Badge
                    key={tag}
                    variant={searchParams.tags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Carbon Range */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Carbon Footprint Range (kgCO2e)</h3>
                <span className="text-xs text-muted-foreground">
                  {searchParams.carbonRange[0]} - {searchParams.carbonRange[1]}
                </span>
              </div>
              <Slider
                defaultValue={searchParams.carbonRange}
                min={0}
                max={2000}
                step={50}
                value={searchParams.carbonRange}
                onValueChange={handleCarbonRangeChange}
              />
            </div>
            
            {/* Sustainability Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Sustainability Score</h3>
                <span className="text-xs text-muted-foreground">
                  {searchParams.sustainabilityScore[0]} - {searchParams.sustainabilityScore[1]}
                </span>
              </div>
              <Slider
                defaultValue={searchParams.sustainabilityScore}
                min={0}
                max={100}
                step={5}
                value={searchParams.sustainabilityScore}
                onValueChange={handleSustainabilityScoreChange}
              />
            </div>
            
            {/* Recyclability */}
            <div>
              <h3 className="text-sm font-medium mb-2">Recyclability</h3>
              <div className="flex gap-2">
                {(['High', 'Medium', 'Low'] as const).map((level) => (
                  <Badge
                    key={level}
                    variant={searchParams.recyclability.includes(level) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleRecyclabilityToggle(level)}
                  >
                    {level}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Alternatives Only */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="alternatives-only"
                checked={searchParams.showOnlyAlternatives}
                onCheckedChange={(checked) => handleAlternativesToggle(!!checked)}
              />
              <Label 
                htmlFor="alternatives-only"
                className="text-sm cursor-pointer"
              >
                Show only alternative materials
              </Label>
            </div>
            
            {/* Search Button */}
            <Button onClick={handleSearch} className="w-full">Apply Filters</Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default AdvancedMaterialSearch;
