
import { useAuth } from '@/contexts/auth';
import { NavLink } from "@/types/navigation";
import { Home, Calculator, Database, Brain, Book, BarChart2, DollarSign, Info, Mail, FileText } from "lucide-react";

export function useUserNavLinks() {
  const { profile, user } = useAuth();
  
  const isPremium = profile?.subscription_tier === 'premium';
  
  const navLinks: NavLink[] = [
    {
      title: "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />
    },
    {
      title: "Calculator",
      path: "/calculator",
      icon: <Calculator className="h-5 w-5" />
    },
    {
      title: "Projects",
      path: "/projects",
      icon: <Database className="h-5 w-5" />
    },
    {
      title: "Pricing",
      path: "/pricing",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "About",
      path: "/about",
      icon: <Info className="h-5 w-5" />
    },
    {
      title: "Contact",
      path: "/contact",
      icon: <Mail className="h-5 w-5" />
    },
    {
      title: "Resources",
      path: "/resources",
      icon: <Book className="h-5 w-5" />
    },
    {
      title: "Grok AI",
      path: "/grok-ai",
      icon: <Brain className="h-5 w-5" />
    },
    {
      title: "Material Database",
      path: "/materials",
      icon: <Database className="h-5 w-5" />
    },
    {
      title: "Blog",
      path: "/blog",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Benchmarking",
      path: "/benchmarking",
      icon: <BarChart2 className="h-5 w-5" />,
      premium: true
    }
  ];

  // Filter links based on user's premium status
  const filteredNavLinks = isPremium 
    ? navLinks 
    : navLinks.filter(link => !link.premium);
  
  return { navLinks: filteredNavLinks };
}

export default useUserNavLinks;
