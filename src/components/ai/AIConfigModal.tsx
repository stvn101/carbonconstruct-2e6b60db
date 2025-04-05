
import { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAIService } from './AIServiceProvider';
import { Sparkles, Lock, CheckCircle } from 'lucide-react';
import { toast } from "sonner";

interface AIConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIConfigModal({ open, onOpenChange }: AIConfigModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isConfigured, configureAI } = useAIService();
  
  // Pre-populate the input field
  useEffect(() => {
    if (isConfigured && !apiKey) {
      setApiKey('170cf47d2b04210ea8c8b68cc390487c');
    }
  }, [isConfigured, open]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate validation
    setTimeout(() => {
      configureAI(apiKey);
      toast.success("AI services successfully configured");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 500);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-carbon-500" />
            Configure AI Services
          </DialogTitle>
          <DialogDescription>
            Connect to DistributeAI's services to enable advanced features.
          </DialogDescription>
        </DialogHeader>
        
        {isConfigured ? (
          <div className="py-6">
            <div className="flex items-center justify-center mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-400">
              <CheckCircle className="h-8 w-8 mr-3" />
              <div className="text-left">
                <h4 className="font-medium">AI Services Connected</h4>
                <p className="text-sm opacity-80">Your AI services are properly configured and ready to use.</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Your API key has been automatically configured.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="api-key">DistributeAI API Key</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="pr-10"
                  />
                  <Lock className="h-4 w-4 absolute right-3 top-3 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Your API key will be stored securely in your browser's local storage.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Configuring..." : "Connect AI Services"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default AIConfigModal;
