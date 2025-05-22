
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from './ThemeProvider';
import { validateAllThemeColors, themeColorPalette } from '@/utils/themeValidator';
import ThemeToggle from './ThemeToggle';

/**
 * This component is used for testing theme consistency.
 * It displays various UI elements to ensure they look consistent across themes.
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
    <div className="space-y-8 p-4 w-full max-w-4xl mx-auto">
      <section>
        <h2 className="text-xl font-bold mb-4">Theme Controls</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button onClick={() => setTheme('light')}>Light Mode</Button>
          <Button onClick={() => setTheme('dark')}>Dark Mode</Button>
          <Button onClick={() => setTheme('system')}>System Mode</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Theme Status</CardTitle>
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
          </CardContent>
        </Card>
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
          <h2 className="text-xl font-bold mb-4">Form Elements</h2>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="test-input">Input Label</Label>
              <Input type="text" id="test-input" placeholder="Input placeholder" />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="test-input-disabled">Disabled Input</Label>
              <Input type="text" id="test-input-disabled" disabled placeholder="Disabled input" />
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is regular card content with normal text styling.</p>
              <p className="text-muted-foreground mt-2">This text should be muted according to the theme.</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Submit</Button>
            </CardFooter>
          </Card>
          
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Styled Card</CardTitle>
              <CardDescription>With custom styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card has custom background and border styling.</p>
              <Badge className="mt-2">Badge</Badge>
            </CardContent>
          </Card>
        </div>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Typography</h2>
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">Heading 1</h1>
              <p className="text-muted-foreground">4xl - Extrabold</p>
            </div>
            
            <div>
              <h2 className="scroll-m-20 text-3xl font-bold tracking-tight">Heading 2</h2>
              <p className="text-muted-foreground">3xl - Bold</p>
            </div>
            
            <div>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Heading 3</h3>
              <p className="text-muted-foreground">2xl - Semibold</p>
            </div>
            
            <div>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">Heading 4</h4>
              <p className="text-muted-foreground">xl - Semibold</p>
            </div>
            
            <div>
              <p className="leading-7">This is a paragraph of text. Some of the text will be <strong>bold</strong>, some will be <em>italic</em>, and some will be <a href="#" className="font-medium text-primary underline underline-offset-4">links</a>. And all of it should respect the current theme.</p>
              <p className="text-sm text-muted-foreground mt-1">Regular paragraph - text-base</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">This is muted small text that should be consistent in both themes.</p>
              <p className="text-xs text-muted-foreground mt-1">Muted text - text-sm/text-xs</p>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section>
        <h2 className="text-xl font-bold mb-4">Theme Color Palette</h2>
        <div className="space-y-6">
          {themeColorPalette.map((category) => (
            <div key={category.name} className="space-y-2">
              <h4 className="font-medium">{category.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
      </section>
      
      <section className="pb-8">
        <h2 className="text-xl font-bold mb-4">Mobile Responsiveness</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Current viewport:</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                  <Badge variant="outline" className="block sm:hidden">xs (block on xs only)</Badge>
                  <Badge variant="outline" className="hidden sm:block md:hidden">sm (block on sm only)</Badge>
                  <Badge variant="outline" className="hidden md:block lg:hidden">md (block on md only)</Badge>
                  <Badge variant="outline" className="hidden lg:block xl:hidden">lg (block on lg only)</Badge>
                  <Badge variant="outline" className="hidden xl:block">xl (block on xl only)</Badge>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold">Responsive grid:</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-2">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <div key={num} className="bg-muted h-12 flex items-center justify-center rounded-md">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold">Touch target sizing:</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button className="min-h-[44px]">Touch-friendly</Button>
                  <div className="h-[44px] w-[44px] bg-primary flex items-center justify-center text-white rounded-md">44px</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ThemeTest;
