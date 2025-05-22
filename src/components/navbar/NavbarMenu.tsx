
import { NavLink } from "@/types/navigation";
import { Link } from "react-router-dom";

interface NavbarMenuProps {
  navLinks: NavLink[];
}

const NavbarMenu = ({ navLinks }: NavbarMenuProps) => {
  return (
    <nav className="flex space-x-4">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className="text-foreground hover:text-carbon-600 dark:hover:text-carbon-400 transition-colors py-2 text-sm lg:text-base"
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

export default NavbarMenu;
