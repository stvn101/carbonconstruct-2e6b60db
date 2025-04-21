
import NavbarMenu from "@/components/navbar/NavbarMenu";
import RegionSelector from "@/components/RegionSelector";
import NavbarLinks from "@/components/navbar/NavbarLinks";
import { NavLink } from "@/types/navigation";

interface NavbarDesktopItemsProps {
  navLinks: NavLink[];
}

const NavbarDesktopItems = ({ navLinks }: NavbarDesktopItemsProps) => (
  <>
    <NavbarMenu navLinks={navLinks} />
    <div className="ml-2">
      <RegionSelector />
    </div>
    <NavbarLinks />
  </>
);

export default NavbarDesktopItems;
