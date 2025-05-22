
import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Building2, Calendar, CircleCheck, CircleAlert } from 'lucide-react';
import { useDevice } from '@/hooks/use-device';

const MobileThemePreview = () => {
  const { isMobile } = useDevice();
  
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className={`relative overflow-hidden border border-border rounded-3xl bg-background shadow-lg ${isMobile ? 'w-full' : 'w-[320px] h-[640px]'}`}>
        {/* Status bar */}
        <div className="bg-background border-b border-border p-2 text-center relative z-10 sticky top-0">
          <span className="font-medium text-sm">CarbonConstruct</span>
          <div className="absolute right-2 top-2.5">
            <div className="flex items-center gap-1">
              <span className="block w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-xs font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-auto" style={!isMobile ? {height: '580px'} : {}}>
          <h1 className="text-xl font-bold">Project Dashboard</h1>
          
          <div className="space-y-2">
            <label htmlFor="search" className="block text-sm">Search Projects</label>
            <div className="relative">
              <Input id="search" placeholder="Type to search..." className="pl-9" />
              <div className="absolute left-2.5 top-2.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mt-4">
            <h2 className="text-lg font-medium">Recent Projects</h2>
            
            <Card className="p-4 space-y-2.5">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Commercial Tower A</h3>
                </div>
                <Badge variant="success">On Track</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Carbon footprint reduced by 24%</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Updated 2 days ago</span>
              </div>
              <div className="pt-1">
                <progress value="65" max="100" className="w-full h-2 rounded-full bg-secondary overflow-hidden appearance-none 
                  [&::-webkit-progress-value]:bg-primary [&::-webkit-progress-bar]:bg-secondary [&::-moz-progress-bar]:bg-primary">65%</progress>
              </div>
            </Card>
            
            <Card className="p-4 space-y-2.5">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Residential Complex B</h3>
                </div>
                <Badge variant="warning">At Risk</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Carbon footprint 8% above target</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span>Updated yesterday</span>
              </div>
              <div className="pt-1">
                <progress value="42" max="100" className="w-full h-2 rounded-full bg-secondary overflow-hidden appearance-none 
                  [&::-webkit-progress-value]:bg-amber-500 [&::-webkit-progress-bar]:bg-secondary [&::-moz-progress-bar]:bg-amber-500">42%</progress>
              </div>
            </Card>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h2 className="text-lg font-medium">Compliance Status</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 flex flex-col items-center space-y-1.5">
                <CircleCheck className="h-8 w-8 text-green-500" />
                <div className="text-center">
                  <h4 className="font-medium text-sm">NCC 2025</h4>
                  <p className="text-xs text-muted-foreground">Compliant</p>
                </div>
              </Card>
              
              <Card className="p-3 flex flex-col items-center space-y-1.5">
                <CircleAlert className="h-8 w-8 text-amber-500" />
                <div className="text-center">
                  <h4 className="font-medium text-sm">NABERS</h4>
                  <p className="text-xs text-muted-foreground">Needs Review</p>
                </div>
              </Card>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button fullWidth>Create New Project</Button>
            <Button variant="outline" fullWidth>View All Projects</Button>
          </div>
        </div>
        
        {/* Navigation bar */}
        <div className="bg-background border-t border-border py-2 px-4 grid grid-cols-5 gap-1 sticky bottom-0">
          {['Home', 'Projects', 'Calculate', 'Materials', 'More'].map((item, i) => (
            <button key={i} className={`flex flex-col items-center justify-center p-1 rounded-md ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className="w-5 h-5 mb-1 flex items-center justify-center">
                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
              </div>
              <span className="text-[10px]">{item}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileThemePreview;
