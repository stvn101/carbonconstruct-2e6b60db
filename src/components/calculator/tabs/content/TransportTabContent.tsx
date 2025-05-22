
import React from 'react';
import { TabsContent } from "@/components/ui/tabs"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TransportInput } from '@/lib/carbonExports';
import { AlertTriangle, Plus } from 'lucide-react';
import TransportFormFields from '@/components/calculator/transport/TransportFormFields';

interface TransportTabContentProps {
  transport?: TransportInput[];
  onUpdateTransport?: (index: number, field: keyof TransportInput, value: any) => void;
  onAddTransport?: () => void;
  onRemoveTransport?: (index: number) => void;
  onCalculate?: () => void;
  onPrev?: () => void;
}

const TransportTabContent: React.FC<TransportTabContentProps> = ({
  transport = [],
  onUpdateTransport,
  onAddTransport,
  onRemoveTransport,
  onCalculate,
  onPrev
}) => {
  return (
    <TabsContent value="transport">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold">Transport Details</h2>
          <Button 
            onClick={onAddTransport} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Transport</span>
          </Button>
        </div>
        
        {transport.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center space-y-2">
                <AlertTriangle className="h-12 w-12 mx-auto text-yellow-400" />
                <h3 className="font-semibold text-lg">No Transport Items</h3>
                <p className="text-muted-foreground">
                  Add transport information to account for emissions from moving materials.
                </p>
                <Button 
                  onClick={onAddTransport} 
                  className="mt-4 bg-carbon-600 hover:bg-carbon-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Transport Item
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {transport.map((item, index) => (
              <TransportFormFields
                key={index}
                index={index}
                item={item}
                onUpdate={(field, value) => onUpdateTransport && onUpdateTransport(index, field as keyof TransportInput, value)}
                onRemove={() => onRemoveTransport && onRemoveTransport(index)}
              />
            ))}
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onPrev}>
            Previous Step
          </Button>
          <Button 
            onClick={onCalculate} 
            className="bg-carbon-600 hover:bg-carbon-700 text-white"
          >
            Next Step
          </Button>
        </div>
      </div>
    </TabsContent>
  );
};

export default TransportTabContent;
