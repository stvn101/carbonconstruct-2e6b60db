
import { Award, BadgeCheck, Building, Building2, DollarSign, GlobeCheck, Handshake, TrendingUp } from "lucide-react";

const BenefitCard = ({ icon: Icon, title, description }: { icon: React.ComponentType<any>, title: string, description: string }) => {
  return (
    <div className="stat-card flex items-start">
      <div className="mr-4 bg-carbon-100 p-3 rounded-full">
        <Icon className="h-6 w-6 text-carbon-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CarbonConstruct?</h2>
          <p className="text-lg text-muted-foreground">
            Our platform helps construction companies meet sustainability goals, comply with regulations, and build a greener future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <BenefitCard 
            icon={BadgeCheck} 
            title="Meet Regulatory Requirements" 
            description="Stay compliant with evolving carbon regulations and sustainability standards in the construction industry."
          />
          
          <BenefitCard 
            icon={DollarSign} 
            title="Reduce Costs" 
            description="Identify opportunities to reduce material waste and energy consumption, leading to significant cost savings."
          />
          
          <BenefitCard 
            icon={TrendingUp} 
            title="Competitive Advantage" 
            description="Differentiate your company by demonstrating your commitment to sustainable construction practices."
          />
          
          <BenefitCard 
            icon={GlobeCheck} 
            title="Environmental Impact" 
            description="Make a measurable difference in reducing carbon emissions and fighting climate change through better building practices."
          />
          
          <BenefitCard 
            icon={Building2} 
            title="Enhanced Project Marketing" 
            description="Showcase your project's sustainability metrics to clients, investors, and stakeholders who value green building."
          />
          
          <BenefitCard 
            icon={Handshake} 
            title="Client Satisfaction" 
            description="Meet the growing demand from clients for environmentally responsible construction projects."
          />
        </div>
        
        <div className="mt-16 bg-carbon-50 border border-carbon-100 rounded-xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-3/5 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">The Construction Industry's Carbon Challenge</h3>
              <p className="text-lg mb-6 text-muted-foreground">
                The building and construction industry accounts for 39% of global carbon emissions. As regulations tighten and client expectations evolve, managing your carbon footprint isn't just good practice—it's becoming essential for business.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-carbon-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">39%</div>
                    <div className="text-sm text-muted-foreground">of global carbon emissions</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-carbon-500 mr-3" />
                  <div>
                    <div className="text-2xl font-bold">70%</div>
                    <div className="text-sm text-muted-foreground">of clients prioritize sustainability</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-2/5">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-carbon-200 to-carbon-50 rounded-xl transform rotate-2"></div>
                <div className="relative bg-white rounded-xl shadow-md p-6 transform -rotate-2">
                  <h4 className="text-xl font-semibold mb-4">CarbonConstruct Makes a Difference</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-carbon-500">✓</div>
                      <span className="text-sm">Reduce project carbon footprint by up to 25%</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-carbon-500">✓</div>
                      <span className="text-sm">Identify the most impactful materials to replace</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-carbon-500">✓</div>
                      <span className="text-sm">Easily document compliance with regulations</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 text-carbon-500">✓</div>
                      <span className="text-sm">Demonstrate sustainability leadership to clients</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
