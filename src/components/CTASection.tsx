
import { Button } from "@/components/ui/button";
import { Building, CalendarDays } from "lucide-react";

const CTASection = () => {
  return (
    <section id="demo" className="py-12 md:py-20 bg-carbon-600 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build a Greener Future?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Join construction companies across the world who are reducing their carbon footprint and meeting sustainability goals with CarbonConstruct.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Work Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="john@construction.com"
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                  <input 
                    type="text" 
                    id="company" 
                    placeholder="Construction Inc."
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    placeholder="(123) 456-7890"
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full bg-white text-carbon-600 hover:bg-white/90">
                Schedule a Free Demo
              </Button>
            </form>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 text-sm">
            <div className="flex items-center justify-center">
              <Building className="h-5 w-5 mr-2 opacity-70" />
              <span>Used by 200+ construction companies</span>
            </div>
            <div className="flex items-center justify-center">
              <CalendarDays className="h-5 w-5 mr-2 opacity-70" />
              <span>Get started in less than 30 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
