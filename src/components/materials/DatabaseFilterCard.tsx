
import React from 'react';
import { Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialFilters from './MaterialFilters';
import { MaterialOption } from '@/lib/materialTypes';

interface DatabaseFilterCardProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  selectedAlternative: string;
  setSelectedAlternative: (alternative: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  allTags: string[];
  allRegions: string[];
  baseOptions: MaterialOption[];
}

const DatabaseFilterCard = ({
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
}: DatabaseFilterCardProps) => {
  return (
    <Card className="mb-8 border-carbon-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Search and Filter
        </CardTitle>
        <CardDescription>
          Find specific materials or filter by region, alternatives and tags
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MaterialFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedAlternative={selectedAlternative}
          setSelectedAlternative={setSelectedAlternative}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          allTags={allTags}
          allRegions={allRegions}
          baseOptions={baseOptions}
        />
      </CardContent>
    </Card>
  );
};

export default DatabaseFilterCard;
