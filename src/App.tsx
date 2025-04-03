
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Calculator from "./pages/Calculator";
import NotFound from "./pages/NotFound";
import { HelmetProvider } from "react-helmet-async";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import DataProcessing from "./pages/DataProcessing";
import CaseStudies from "./pages/CaseStudies";
import Resources from "./pages/Resources";
import Demo from "./pages/Demo";
import Careers from "./pages/Careers";
import Partners from "./pages/Partners";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <ThemeProvider defaultTheme="light">
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/data-processing" element={<DataProcessing />} />
                {/* New routes for footer links */}
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/demo" element={<Demo />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/partners" element={<Partners />} />
                {/* Redirect routes for direct feature access */}
                <Route path="/materials" element={<Calculator />} />
                <Route path="/reporting" element={<Calculator />} />
                <Route path="/integration" element={<Calculator />} />
                <Route path="/benchmarking" element={<Calculator />} />
                <Route path="/education" element={<Calculator />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
