
import React from 'react';
import { Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialFilters from './MaterialFilters';
import { MaterialOption } from '@/lib/materialTypes';
import { Skeleton } from '@/components/ui/skeleton';

interface DatabaseFilterCardProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedAlternative: string;
  setSelectedAlternative: (alternative: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  allTags: string[];
  baseOptions: MaterialOption[];
  categories?: string[];
  loading?: boolean;
}

const DatabaseFilterCard = ({
  searchTerm,
  setSearchTerm,
  selectedAlternative,
  setSelectedAlternative,
  selectedTag,
  setSelectedTag,
  allTags,
  baseOptions,
  categories = [],
  loading = false
}: DatabaseFilterCardProps) => {
  return (
    <Card className="mb-8 border-carbon-100">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Search and Filter
        </CardTitle>
        <CardDescription>
          Find specific materials or filter by alternatives, categories, and tags
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="w-full h-10" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
            </div>
            <Skeleton className="w-32 h-10 ml-auto" />
          </div>
        ) : (
          <MaterialFilters 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedAlternative={selectedAlternative}
            setSelectedAlternative={setSelectedAlternative}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            allTags={allTags}
            baseOptions={baseOptions}
            categories={categories}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseFilterCard;
