
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const MaterialEmptyState: React.FC = () => {
  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center gap-2 mb-4">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <h3 className="text-lg font-medium">No materials found</h3>
      </div>
      <p className="text-muted-foreground">
        Try adjusting your filters or search criteria to find materials.
      </p>
    </Card>
  );
};

export default MaterialEmptyState;
