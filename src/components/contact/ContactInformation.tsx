
import { Mail, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ContactInformation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
      
      <div className="space-y-6 mb-8">
        <div className="flex items-start">
          <Mail className="h-6 w-6 text-carbon-500 mr-4 mt-1" />
          <div>
            <h3 className="font-medium">Email Us</h3>
            <p className="text-foreground/70">contact@carbonconstruct.net</p>
            <p className="text-foreground/70">info@carbonconstruct.net</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <Phone className="h-6 w-6 text-carbon-500 mr-4 mt-1" />
          <div>
            <h3 className="font-medium">Call Us</h3>
            <p className="text-foreground/70">(07) 3746 8765</p>
            <p className="text-sm text-foreground/60">Monday-Friday, 9am-5pm AEST</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <MapPin className="h-6 w-6 text-carbon-500 mr-4 mt-1" />
          <div>
            <h3 className="font-medium">Visit Us</h3>
            <p className="text-foreground/70">
              Level 5, 410 Queen Street<br />
              Brisbane, QLD 4000<br />
              Australia
            </p>
          </div>
        </div>
      </div>
      
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">Looking for customer support?</h3>
          <p className="text-foreground/70 mb-4">
            If you're an existing customer with technical questions, please visit our support center.
          </p>
          <Button variant="outline" className="group">
            Support Center
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactInformation;
