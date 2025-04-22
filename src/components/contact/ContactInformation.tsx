
import { Mail, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ContactInformation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="h-full"
    >
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      
      <div className="space-y-6 mb-8">
        <div className="flex items-start group">
          <Mail className="h-6 w-6 text-carbon-500 mr-4 mt-1 group-hover:text-carbon-600 transition-colors" aria-hidden="true" />
          <div>
            <h3 className="font-medium">Email Us</h3>
            <a 
              href="mailto:info@carbonconstruct.net" 
              className="block text-foreground/70 hover:text-foreground transition-colors" 
              aria-label="Email info at carbon construct dot net"
            >
              info@carbonconstruct.net
            </a>
            <a 
              href="mailto:contact@carbonconstruct.net" 
              className="block text-foreground/70 hover:text-foreground transition-colors" 
              aria-label="Email contact at carbon construct dot net"
            >
              contact@carbonconstruct.net
            </a>
          </div>
        </div>
        
        <div className="flex items-start group">
          <Phone className="h-6 w-6 text-carbon-500 mr-4 mt-1 group-hover:text-carbon-600 transition-colors" aria-hidden="true" />
          <div>
            <h3 className="font-medium">Call Us</h3>
            <a 
              href="tel:+61406419834" 
              className="block text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Call us at zero four zero six four one nine eight three four"
            >
              0406 419 834
            </a>
            <p className="text-sm text-foreground/60">Monday-Friday, 9am-5pm AEST</p>
          </div>
        </div>
      </div>
      
      <Card className="bg-muted/50 h-auto">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">Looking for customer support?</h3>
          <p className="text-foreground/70 mb-4">
            If you're an existing customer with technical questions, please visit our support center.
          </p>
          <Button variant="outline" className="group" asChild>
            <Link to="/help">
              Support Center
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactInformation;

