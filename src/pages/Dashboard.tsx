import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ProjectsTab } from "@/components/dashboard/ProjectsTab";
import { ReportsTab } from "@/components/dashboard/ReportsTab";
import SubscriptionStatus from "@/components/payment/SubscriptionStatus";
import PaymentHistory from "@/components/payment/PaymentHistory";
import PaymentSuccess from "@/components/payment/PaymentSuccess";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/contexts/ProjectContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const tabParam = searchParams.get("tab");
    if (tabParam && ["overview", "projects", "reports", "payments"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    // Check if we're coming from a successful payment
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      setShowPaymentSuccess(true);
      
      // Verify payment with backend
      if (user) {
        supabase.functions.invoke('verify-payment')
          .catch(err => console.error("Error verifying payment:", err));
      }
    }
  }, [searchParams, user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL without full page reload
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.pushState({}, "", url.toString());
  };

  // Get recent projects for the dashboard stats
  const recentProjects = projects?.slice(0, 5) || [];
  const projectsCount = projects?.length || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {showPaymentSuccess && (
        <div className="mb-8">
          <PaymentSuccess onClose={() => setShowPaymentSuccess(false)} />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="w-full border-b bg-transparent p-0">
          <div className="flex overflow-x-auto pb-2">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-carbon-600 data-[state=active]:shadow-none"
              data-state={activeTab === "overview" ? "active" : "inactive"}
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-carbon-600 data-[state=active]:shadow-none"
              data-state={activeTab === "projects" ? "active" : "inactive"}
            >
              Recent Projects
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-carbon-600 data-[state=active]:shadow-none"
              data-state={activeTab === "reports" ? "active" : "inactive"}
            >
              Reports
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-carbon-600 data-[state=active]:shadow-none"
              data-state={activeTab === "payments" ? "active" : "inactive"}
            >
              Payments
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 gap-8">
            <DashboardStats
              projectsCount={projectsCount}
              recentProjects={recentProjects}
            />
            <SubscriptionStatus />
          </div>
        </TabsContent>

        <TabsContent value="projects" className="pt-4">
          <ProjectsTab projects={projects || []} />
        </TabsContent>

        <TabsContent value="reports" className="pt-4">
          <ReportsTab />
        </TabsContent>
        
        <TabsContent value="payments" className="pt-4">
          <div className="grid grid-cols-1 gap-8">
            <SubscriptionStatus />
            <PaymentHistory />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
