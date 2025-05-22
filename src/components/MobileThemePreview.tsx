
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Phone } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

/**
 * A component to preview how the theme looks on mobile devices
 */
const MobileThemePreview: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="border-4 border-border rounded-[32px] p-4 bg-background shadow-xl overflow-hidden">
        <div className="relative">
          {/* Phone notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-xl z-10"></div>
          
          <div className="pt-8 px-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">CarbonConstruct</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <div className="flex justify-between items-center mb-2">
                  <span>Current emissions</span>
                  <Badge variant="secondary" className="text-[10px]">Calculating</Badge>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-3/5 rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0 tCO₂e</span>
                    <span>Target: 120 tCO₂e</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" className="text-xs h-8">Materials</Button>
              <Button size="sm" variant="outline" className="text-xs h-8">Transport</Button>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Theme: {theme}</span>
              <Phone className="h-4 w-4 text-primary" />
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-center mt-2 text-muted-foreground">
        Mobile preview demonstrates how the theme appears on smaller screens
      </p>
    </div>
  );
};

export default MobileThemePreview;
