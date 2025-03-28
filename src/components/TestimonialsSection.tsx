
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "CarbonConstruct has completely transformed how we approach sustainability in our projects. We've reduced our carbon footprint by 23% in just six months.",
    name: "Sarah Johnson",
    role: "Sustainability Director",
    company: "GreenBuild Construction"
  },
  {
    quote: "The material database is incredibly comprehensive. It's helped us make smarter choices and save costs while reducing our environmental impact.",
    name: "Michael Chen",
    role: "Project Manager",
    company: "Urban Development Group"
  },
  {
    quote: "Our clients are increasingly asking for sustainability metrics. CarbonConstruct helps us deliver detailed carbon footprint reports that impress our stakeholders.",
    name: "David Rodriguez",
    role: "CEO",
    company: "Rodriguez Builders"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 md:py-20 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground">
            Construction companies across the industry trust CarbonConstruct to help them build more sustainably.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 relative">
              <Quote className="absolute top-4 right-4 h-8 w-8 text-carbon-100" />
              <p className="mb-6 text-muted-foreground">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-carbon-100 rounded-full flex items-center justify-center text-carbon-600 font-semibold mr-3">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
