
import NavbarMenu from "@/components/navbar/NavbarMenu";
import NavbarLinks from "@/components/navbar/NavbarLinks";
import { NavLink } from "@/types/navigation";

interface NavbarDesktopItemsProps {
  navLinks: NavLink[];
}

const NavbarDesktopItems = ({ navLinks }: NavbarDesktopItemsProps) => (
  <>
    <NavbarMenu navLinks={navLinks} />
    <NavbarLinks />
  </>
);

export default NavbarDesktopItems;
