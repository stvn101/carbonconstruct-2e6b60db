
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';

// Import our new components
import SearchBox from './advanced-search/SearchBox';
import ActiveFilters from './advanced-search/ActiveFilters';
import CategoryFilter from './advanced-search/CategoryFilter';
import RegionFilter from './advanced-search/RegionFilter';
import TagFilter from './advanced-search/TagFilter';
import RangeFilter from './advanced-search/RangeFilter';
import RecyclabilityFilter from './advanced-search/RecyclabilityFilter';
import AlternativesFilter from './advanced-search/AlternativesFilter';
import SearchCollapsible from './advanced-search/SearchCollapsible';

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

interface AdvancedMaterialSearchProps {
  onSearch: (searchParams: SearchParams) => void;
  categories: string[];
  regions: string[];
  tags: string[];
  materialCount: number;
  onResetFilters: () => void;
  className?: string;
}

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
        <SearchBox 
          term={searchParams.term}
          onTermChange={handleSearchTermChange}
          onSearch={handleSearch}
        />
        
        {/* Active Filters */}
        <ActiveFilters 
          activeFilters={activeFilters}
          onRemoveFilter={removeFilter}
          onResetFilters={handleResetFilters}
        />

        {/* Advanced Filters */}
        <SearchCollapsible 
          isOpen={isOpen} 
          onOpenChange={setIsOpen}
          onSearch={handleSearch}
        >
          {/* Categories */}
          <CategoryFilter 
            categories={categories}
            selectedCategories={searchParams.categories}
            onToggleCategory={handleCategoryToggle}
          />
          
          {/* Regions */}
          <RegionFilter 
            regions={regions}
            selectedRegions={searchParams.regions}
            onToggleRegion={handleRegionToggle}
          />
          
          {/* Tags */}
          <TagFilter 
            tags={tags}
            selectedTags={searchParams.tags}
            onToggleTag={handleTagToggle}
          />
          
          {/* Carbon Range */}
          <RangeFilter 
            title="Carbon Footprint Range"
            description="kgCO2e"
            min={0}
            max={2000}
            step={50}
            value={searchParams.carbonRange}
            onChange={handleCarbonRangeChange}
          />
          
          {/* Sustainability Score */}
          <RangeFilter 
            title="Sustainability Score"
            min={0}
            max={100}
            step={5}
            value={searchParams.sustainabilityScore}
            onChange={handleSustainabilityScoreChange}
          />
          
          {/* Recyclability */}
          <RecyclabilityFilter 
            selectedLevels={searchParams.recyclability}
            onToggleLevel={handleRecyclabilityToggle}
          />
          
          {/* Alternatives Only */}
          <AlternativesFilter 
            checked={searchParams.showOnlyAlternatives}
            onToggle={handleAlternativesToggle}
          />
        </SearchCollapsible>
      </CardContent>
    </Card>
  );
};

export default AdvancedMaterialSearch;
