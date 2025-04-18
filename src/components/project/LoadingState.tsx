
import { motion } from "framer-motion";

const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
    </div>
  );
};

export default LoadingState;
