
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import performanceMonitoringService from "@/services/performanceMonitoringService";
import errorTrackingService from "@/services/errorTrackingService";
import { useAuth } from "@/contexts/auth";

export const RouteChangeTracker = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Track route change with performance monitoring
    performanceMonitoringService.trackRouteChange(location.pathname);
    
    // If you're using error tracking and want to associate the user
    if (user?.id) {
      errorTrackingService.setUser(user.id, user.email || undefined);
    } else {
      errorTrackingService.clearUser();
    }
    
    // You could also track page views here for analytics
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname, user]);

  // This component doesn't render anything
  return null;
};

export default RouteChangeTracker;
