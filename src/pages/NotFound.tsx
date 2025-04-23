
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    // Ensure body can scroll
    document.body.style.overflow = "auto";
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-carbon-50 dark:bg-carbon-900 p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-carbon-600 dark:text-carbon-300">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 dark:text-gray-400 mb-8">We couldn't find the page you were looking for.</p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 bg-carbon-600 text-white rounded-md hover:bg-carbon-700 transition-colors"
        >
          Return to Home
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center px-6 py-3 ml-4 border border-carbon-600 text-carbon-600 dark:text-carbon-300 dark:border-carbon-500 rounded-md hover:bg-carbon-50 dark:hover:bg-carbon-800 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
