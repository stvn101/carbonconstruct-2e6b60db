
import React, { useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GrokProvider } from "@/contexts/GrokContext";
import { MessageSquare, Leaf, Settings, BarChart3 } from "lucide-react";
import { useA11y } from "@/hooks/useA11y";

import GrokChat from "@/components/grok/GrokChat";
import GrokConfig from "@/components/grok/GrokConfig";
import MaterialAnalysis from "@/components/grok/MaterialAnalysis";
import { useCalculator } from "@/contexts/CalculatorContext"; // Assuming this exists for materials

function GrokAIAssistant() {
  const [activeTab, setActiveTab] = useState("chat");
  const { materials = [], energy = [], transport = [] } = useCalculator() || {};
  
  // Set page title and a11y features
  useA11y({
    title: "Grok AI Assistant - CarbonConstruct",
    announceRouteChanges: true,
    focusMainContentOnRouteChange: true
  });

  return (
    <GrokProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-24 pb-12" id="main-content" tabIndex={-1}>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-carbon-800 dark:text-carbon-100 mb-2">Grok AI Assistant</h1>
            <p className="text-carbon-600 dark:text-carbon-300">
              Leverage advanced AI to optimize your sustainable construction projects
            </p>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Construction Assistant</span>
                <span className="sm:hidden">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="materials" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Material Analysis</span>
                <span className="sm:hidden">Materials</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Configuration</span>
                <span className="sm:hidden">Settings</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="w-full">
              <GrokChat 
                placeholder="Ask Grok about sustainable construction materials, compliance, or best practices..." 
                title="Construction Assistant"
              />
            </TabsContent>
            
            <TabsContent value="materials">
              <div className="space-y-6">
                <MaterialAnalysis materials={materials} />
              </div>
            </TabsContent>
            
            <TabsContent value="settings">
              <GrokConfig />
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </div>
    </GrokProvider>
  );
}

export default GrokAIAssistant;
