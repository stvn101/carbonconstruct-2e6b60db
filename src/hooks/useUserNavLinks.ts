
import { useAuth } from '@/contexts/auth';
import { NavLink } from "@/types/navigation";

export const useUserNavLinks = () => {
  const { profile } = useAuth();
  
  // Different nav links for free vs premium users
  const freeUserNavLinks: NavLink[] = [
    { title: "Home", path: "/" },
    { title: "Calculator", path: "/calculator" },
    { title: "Projects", path: "/projects" },
    { title: "Pricing", path: "/pricing" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
    { title: "Blog", path: "/blog" },
  ];
  
  const premiumUserNavLinks: NavLink[] = [
    { title: "Home", path: "/" },
    { title: "Dashboard", path: "/dashboard" },
    { title: "Calculator", path: "/calculator" },
    { title: "Projects", path: "/projects" },
    { title: "Material DB", path: "/materials", premium: true },
    { title: "Analytics", path: "/analytics", premium: true },
    { title: "About", path: "/about" },
    { title: "Blog", path: "/blog" },
  ];
  
  // Safely check if the user has a premium subscription
  const isPremiumUser = profile?.subscription_tier === 'premium';
  const navLinks = isPremiumUser ? premiumUserNavLinks : freeUserNavLinks;

  return { navLinks, isPremiumUser };
};
