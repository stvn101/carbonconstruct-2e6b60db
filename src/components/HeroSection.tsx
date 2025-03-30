
import { Button } from "@/components/ui/button";
import { BarChart3, Building2, LeafyGreen } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight gradient-heading">
              Build Greener, <br />Measure Smarter
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-lg">
              Track, manage, and reduce your construction project's carbon footprint with the first SaaS platform designed specifically for construction sustainability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <a href="#demo">Get Started</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#learn-more" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('learn-more')?.scrollIntoView({ behavior: 'smooth' });
                }}>Learn More</a>
              </Button>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex items-center">
                <div className="bg-carbon-100 rounded-full p-2 mr-3">
                  <Building2 className="h-5 w-5 text-carbon-700" />
                </div>
                <p className="text-sm font-medium">For Construction Companies</p>
              </div>
              <div className="flex items-center">
                <div className="bg-carbon-100 rounded-full p-2 mr-3">
                  <LeafyGreen className="h-5 w-5 text-carbon-700" />
                </div>
                <p className="text-sm font-medium">Sustainable Building</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-carbon-200 to-carbon-50 rounded-2xl transform rotate-1"></div>
              <div className="relative bg-white border border-border rounded-2xl shadow-lg p-6 transform -rotate-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Project Carbon Dashboard</h3>
                  <BarChart3 className="h-5 w-5 text-carbon-500" />
                </div>
                <div className="space-y-4">
                  <div className="bg-secondary/50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Carbon Score</span>
                      <span className="text-sm font-bold text-carbon-600">78/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-carbon-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Materials</div>
                      <div className="text-xl font-bold text-carbon-600">42.3</div>
                      <div className="text-xs text-muted-foreground">tonnes CO₂e</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Transport</div>
                      <div className="text-xl font-bold text-carbon-600">28.7</div>
                      <div className="text-xs text-muted-foreground">tonnes CO₂e</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Energy</div>
                      <div className="text-xl font-bold text-carbon-600">15.2</div>
                      <div className="text-xs text-muted-foreground">tonnes CO₂e</div>
                    </div>
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-1">Total</div>
                      <div className="text-xl font-bold text-carbon-600">86.2</div>
                      <div className="text-xs text-muted-foreground">tonnes CO₂e</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
