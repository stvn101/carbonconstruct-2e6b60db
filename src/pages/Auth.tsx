
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { user, signInWithGitHub } = useAuth();

  useEffect(() => {
    // Redirect to dashboard if user is already logged in
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  const handleGitHubSignIn = async () => {
    try {
      await signInWithGitHub();
      // Navigation will happen via the useEffect above
    } catch (error) {
      console.error("GitHub sign in failed:", error);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Sign In | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Sign in or create an account with CarbonConstruct to save and track your construction project's carbon footprint."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to CarbonConstruct</CardTitle>
            <CardDescription>
              Sign in or create an account to save your carbon calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="login" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              type="button" 
              className="w-full"
              onClick={handleGitHubSignIn}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Auth;
