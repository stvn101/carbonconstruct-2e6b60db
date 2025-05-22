
import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import MobileThemePreview from './MobileThemePreview';
import { validateAllThemeColors } from '@/utils/themeValidator';
import ThemeToggle from './ThemeToggle';

/**
 * An enhanced version of ThemeTest with more comprehensive testing capabilities
 */
const ThemeTestEnhanced: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [validationResults, setValidationResults] = useState<{isValid: boolean, issues: string[]}>({
    isValid: true,
    issues: []
  });
  
  // Run validation on mount and theme change
  React.useEffect(() => {
    // Delay validation to allow theme to apply
    const timer = setTimeout(() => {
      setValidationResults(validateAllThemeColors());
    }, 500);
    
    return () => clearTimeout(timer);
  }, [theme]);
  
  return (
    <Tabs defaultValue="components" className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Theme Testing Lab</h1>
          <p className="text-muted-foreground">
            Comprehensive tools to ensure theme consistency across the application
          </p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <TabsList>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
          </TabsList>
          <ThemeToggle />
        </div>
      </div>
      
      <TabsContent value="components" className="space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-4">Dialog Component</h2>
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Theme Test Dialog</DialogTitle>
                  <DialogDescription>
                    This dialog demonstrates theme consistency in overlays and modals.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p>The dialog background should use the card color, with card-foreground text.</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Button size="sm">Primary Button</Button>
                    <Button size="sm" variant="outline">Outline Button</Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Button Variants</h2>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Cards</h2>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description text</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is regular card content with normal text styling.</p>
                  <p className="text-muted-foreground mt-2">This text should be muted.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </TabsContent>
      
      <TabsContent value="colors">
        <Card>
          <CardHeader>
            <CardTitle>Theme Validation</CardTitle>
            <CardDescription>
              Current theme: <span className="font-semibold">{theme}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={validationResults.isValid ? "success" : "destructive"} className="mb-2">
              {validationResults.isValid ? "Theme is consistent" : "Theme inconsistencies detected"}
            </Badge>
            
            {validationResults.issues.length > 0 && (
              <div className="bg-destructive/10 p-4 rounded-md mt-2">
                <h4 className="font-medium text-destructive mb-2">Issues Found:</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {validationResults.issues.map((issue, i) => (
                    <li key={i} className="text-destructive">{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
              {['background', 'foreground', 'card', 'card-foreground', 'primary', 'primary-foreground', 
                'muted', 'muted-foreground', 'border'].map(color => (
                <div key={color} className="border rounded overflow-hidden">
                  <div 
                    className="h-12 w-full" 
                    style={{backgroundColor: `hsl(var(--${color}))`}}
                  ></div>
                  <div className="p-2">
                    <p className="text-sm font-medium">{color}</p>
                    <p className="text-xs text-muted-foreground">
                      {`var(--${color})`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="mobile">
        <Card>
          <CardHeader>
            <CardTitle>Mobile Preview</CardTitle>
            <CardDescription>See how the theme looks on mobile devices</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <MobileThemePreview />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ThemeTestEnhanced;
