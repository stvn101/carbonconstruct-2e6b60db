
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NavbarLogo = () => {
  return (
    <Link to="/" className="flex items-center">
      <motion.div 
        className="h-8 w-8 rounded-full bg-gradient-to-tr from-carbon-600 to-carbon-400 mr-2 flex items-center justify-center"
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="h-3 w-3 bg-white rounded-full"></div>
      </motion.div>
      <span className="text-xl font-semibold">CarbonConstruct</span>
    </Link>
  );
};

export default NavbarLogo;
