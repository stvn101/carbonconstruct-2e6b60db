
import { Quote, Star } from "lucide-react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "CarbonConstruct has completely transformed how we approach sustainability in our projects. We've reduced our carbon footprint by 23% in just six months.",
    name: "Sarah Johnson",
    role: "Sustainability Director",
    company: "GreenBuild Construction",
    rating: 5
  },
  {
    quote: "The material database is incredibly comprehensive. It's helped us make smarter choices and save costs while reducing our environmental impact.",
    name: "Michael Chen",
    role: "Project Manager",
    company: "Urban Development Group",
    rating: 5
  },
  {
    quote: "Our clients are increasingly asking for sustainability metrics. CarbonConstruct helps us deliver detailed carbon footprint reports that impress our stakeholders.",
    name: "David Rodriguez",
    role: "CEO",
    company: "Rodriguez Builders",
    rating: 4
  },
  {
    quote: "We've been able to win more government contracts since implementing CarbonConstruct. Their emissions tracking meets all regulatory requirements.",
    name: "Emily Taylor",
    role: "Operations Manager",
    company: "Taylor Construction Group",
    rating: 5
  },
  {
    quote: "The customer support team is as impressive as the product itself. They've helped us customize the platform to match our specific workflow.",
    name: "Robert Chang",
    role: "Technical Director",
    company: "ChangBuild Associates",
    rating: 4
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

        <div className="relative px-10 max-w-5xl mx-auto">
          <Carousel 
            opts={{
              align: "center",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-1">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-carbon-900 rounded-xl shadow-md p-6 h-full flex flex-col relative"
                  >
                    <Quote className="absolute top-4 right-4 h-8 w-8 text-carbon-100" />
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="mb-6 text-muted-foreground flex-grow">{testimonial.quote}</p>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-carbon-100 rounded-full flex items-center justify-center text-carbon-600 font-semibold mr-3">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
          
          <div className="mt-10 flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full bg-carbon-200"
                whileHover={{ scale: 1.5, backgroundColor: "#6E59A5" }}
                // Indicator dots (future enhancement could make these functional)
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
