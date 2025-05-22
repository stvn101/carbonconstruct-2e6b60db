
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBoxProps {
  term: string;
  onTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  term,
  onTermChange,
  onSearch
}) => {
  return (
    <div className="flex space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search materials..."
          value={term}
          onChange={onTermChange}
          className="pl-9"
        />
      </div>
      <Button onClick={onSearch}>Search</Button>
    </div>
  );
};

export default SearchBox;
