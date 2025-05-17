
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import AboutPage from "./pages/About";
import CalculatorPage from "./pages/Calculator";
import MaterialDatabasePage from "./pages/MaterialDatabase";
import { Helmet } from "react-helmet-async";
import { ColorModeProvider } from "./contexts/ColorMode";
import { RegionProvider } from "./contexts/RegionContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";
import { fetchMaterials } from "./services/materialService";
import { refreshMaterialFactors } from "./lib/carbonFactors";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Initialize material factors from database
  useEffect(() => {
    console.log("App: Loading materials from database for factors");
    fetchMaterials(false)
      .then(materials => {
        // Convert format for refreshMaterialFactors
        if (materials && materials.length > 0) {
          const dbMaterials = materials.map(mat => ({
            id: mat.id ? Number(mat.id) : 0,
            material: mat.name,
            co2e_avg: mat.factor || mat.carbon_footprint_kgco2e_kg
          }));
          
          refreshMaterialFactors(dbMaterials);
        }
      })
      .catch(error => {
        console.error("Failed to load materials for factors:", error);
      });
  }, []);

  return (
    <>
      <Helmet>
        <meta name="theme-color" content="#006064" />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <ColorModeProvider>
          <RegionProvider>
            <Toaster position="top-center" />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
              <Route path="/materials" element={<MaterialDatabasePage />} />
            </Routes>
          </RegionProvider>
        </ColorModeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
