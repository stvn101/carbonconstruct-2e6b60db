
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-carbon-600 to-carbon-400 mr-2 flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-semibold">CarbonConstruct</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Track, manage, and reduce your construction project's carbon footprint with our innovative SaaS platform.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
              <li><Link to="/calculator" className="text-sm text-muted-foreground hover:text-foreground">Case Studies</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Resources</Link></li>
              <li><Link to="/#demo" className="text-sm text-muted-foreground hover:text-foreground">Demo</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
              <li><Link to="/about#careers" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
              <li><Link to="/about#partners" className="text-sm text-muted-foreground hover:text-foreground">Partners</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="text-sm text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
              <li><Link to="/data-processing" className="text-sm text-muted-foreground hover:text-foreground">Data Processing</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CarbonConstruct. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">
                Building a sustainable future, one project at a time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
