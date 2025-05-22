
import React from 'react';
import { WifiOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSimpleOfflineMode } from '@/hooks/useSimpleOfflineMode';
import { Button } from '@/components/ui/button';

/**
 * Component that displays information about using Grok AI in offline mode
 * @returns React component
 */
const OfflineUsage: React.FC = () => {
  const { isOffline, checkConnection } = useSimpleOfflineMode();
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <WifiOff className="h-5 w-5 mr-2" />
          Using Grok AI in Offline Mode
        </CardTitle>
        <CardDescription>
          Understanding the capabilities and limitations when working offline
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Status */}
        <Alert variant={isOffline ? "warning" : "default"}>
          <div className="flex items-center">
            {isOffline ? (
              <WifiOff className="h-4 w-4 mr-2 text-amber-600" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
            )}
            <div>
              <AlertTitle>
                {isOffline ? "Currently Offline" : "Currently Online"}
              </AlertTitle>
              <AlertDescription>
                {isOffline 
                  ? "You're currently in offline mode. Some Grok AI features will be limited."
                  : "You're online with full access to all Grok AI features."
                }
              </AlertDescription>
            </div>
          </div>
          
          {isOffline && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkConnection} 
              className="mt-2"
            >
              <RefreshCw className="h-3 w-3 mr-2" />
              Check Connection
            </Button>
          )}
        </Alert>
        
        {/* What works offline */}
        <div>
          <h3 className="text-lg font-medium mb-2">Features Available Offline</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Viewing previously loaded chat messages</li>
            <li>Viewing cached compliance analyses</li>
            <li>Accessing previously generated insights</li>
          </ul>
        </div>
        
        {/* What doesn't work offline */}
        <div>
          <h3 className="text-lg font-medium mb-2">Features Unavailable Offline</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Sending new messages to Grok AI</li>
            <li>Generating new compliance analyses</li>
            <li>Material recommendations and analysis</li>
          </ul>
        </div>
        
        {/* Tips for offline usage */}
        <div>
          <h3 className="flex items-center text-lg font-medium mb-2">
            <AlertCircle className="h-4 w-4 mr-2 text-amber-600" />
            Tips for Working Offline
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li>Pre-generate important analyses before going offline</li>
            <li>Save key AI-generated content for offline reference</li>
            <li>The app will automatically reconnect when internet access is available</li>
            <li>Your session will be maintained even if you temporarily lose connection</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfflineUsage;
