
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface NavbarMobileToggleProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const NavbarMobileToggle = ({ isMenuOpen, setIsMenuOpen }: NavbarMobileToggleProps) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={() => setIsMenuOpen(!isMenuOpen)}
    aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
    aria-expanded={isMenuOpen}
    aria-controls="mobile-menu"
    className="ml-2 mobile-menu-button"
  >
    {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
  </Button>
);

export default NavbarMobileToggle;
