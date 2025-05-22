
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategories,
  onToggleCategory
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox 
              id={`category-${category}`}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => onToggleCategory(category)}
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
  );
};

export default CategoryFilter;
