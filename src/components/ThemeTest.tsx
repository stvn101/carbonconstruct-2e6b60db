
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from './ThemeProvider';
import { validateAllThemeColors, themeColorPalette } from '@/utils/themeValidator';

/**
 * This component is used for testing theme consistency.
 * It should only be used during development, not in production.
 */
const ThemeTest: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [validationResults, setValidationResults] = useState<{isValid: boolean, issues: string[]}>({
    isValid: true,
    issues: []
  });
  
  // Run validation on mount and theme change
  useEffect(() => {
    // Delay validation to allow theme to apply
    const timer = setTimeout(() => {
      setValidationResults(validateAllThemeColors());
    }, 500);
    
    return () => clearTimeout(timer);
  }, [theme]);
  
  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme Consistency Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setTheme('light')}>Light Mode</Button>
            <Button onClick={() => setTheme('dark')}>Dark Mode</Button>
            <Button onClick={() => setTheme('system')}>System Mode</Button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Current Theme: <span className="text-primary">{theme}</span></h3>
            <Badge variant={validationResults.isValid ? "success" : "destructive"}>
              {validationResults.isValid ? "Theme is consistent" : "Theme inconsistencies detected"}
            </Badge>
          </div>
          
          {validationResults.issues.length > 0 && (
            <div className="bg-destructive/10 p-4 rounded-md">
              <h4 className="font-medium text-destructive">Issues Found:</h4>
              <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                {validationResults.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Theme Color Palette Display */}
          <div className="space-y-6 mt-6">
            <h3 className="font-medium text-lg">Theme Color Palette</h3>
            
            {themeColorPalette.map((category) => (
              <div key={category.name} className="space-y-2">
                <h4 className="font-medium">{category.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.colors.map((color) => (
                    <div key={color.name} className="border rounded-md overflow-hidden">
                      <div className="grid grid-cols-2">
                        <div 
                          className="h-20" 
                          style={{backgroundColor: theme === 'dark' ? color.night : color.day}}
                        />
                        <div className="p-2">
                          <p className="font-medium text-sm">{color.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {theme === 'dark' ? color.night : color.day}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{color.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Component Examples */}
          <div className="space-y-4 mt-6">
            <h3 className="font-medium text-lg">Component Examples</h3>
            
            <div className="space-y-4">
              <h4 className="font-medium">Buttons</h4>
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>This is a sample card for testing theme consistency.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Text & Typography</h4>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">Heading 1</h1>
                <h2 className="text-2xl font-bold">Heading 2</h2>
                <h3 className="text-xl font-bold">Heading 3</h3>
                <p className="text-base">Normal paragraph text</p>
                <p className="text-sm text-muted-foreground">Muted text</p>
                <p className="text-xs">Small text</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeTest;
