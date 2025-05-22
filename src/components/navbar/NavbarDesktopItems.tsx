
import NavbarMenu from "@/components/navbar/NavbarMenu";
import { NavLink } from "@/types/navigation";

interface NavbarDesktopItemsProps {
  navLinks: NavLink[];
}

const NavbarDesktopItems = ({ navLinks }: NavbarDesktopItemsProps) => (
  <NavbarMenu navLinks={navLinks} />
);

export default NavbarDesktopItems;
