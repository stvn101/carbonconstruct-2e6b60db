
import NavbarLinks from "./NavbarLinks";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">CarbonConstruct</Link>
        
        <NavbarLinks />
      </div>
    </nav>
  );
};

export default Navbar;
