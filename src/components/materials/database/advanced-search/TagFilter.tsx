
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onToggleTag
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.slice(0, 15).map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onToggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
