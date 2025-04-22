
import React, { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { NoAuth } from "@/components/NoAuth";
import { useA11y } from "@/hooks/useA11y";

// Lazy load the auth forms
const LoginForm = lazy(() => import("@/components/auth/LoginForm"));
const RegisterForm = lazy(() => import("@/components/auth/RegisterForm"));

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const returnTo = location.state?.returnTo || '/dashboard';

  // Improve accessibility
  useA11y({
    title: "Sign In | CarbonConstruct",
    announceRouteChanges: true,
    focusMainContentOnRouteChange: true
  });

  useEffect(() => {
    // If user is already logged in, redirect to returnTo or dashboard
    if (user) {
      navigate(returnTo, { state: { fromAuth: true } });
    }
  }, [user, navigate, returnTo]);

  return (
    <>
      <Helmet>
        <title>{activeTab === "signin" ? "Sign In" : "Create Account"} | CarbonConstruct</title>
      </Helmet>
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Button
            variant="ghost"
            asChild
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <Link to="/" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-tr from-carbon-600 to-carbon-400 flex items-center justify-center mb-4">
              <div className="h-4 w-4 bg-white rounded-full"></div>
            </div>
            <h1 className="text-2xl font-bold dark:text-carbon-50">Welcome to CarbonConstruct</h1>
            <p className="text-muted-foreground mt-2 dark:text-carbon-200">
              {activeTab === "signin" 
                ? "Sign in to access your account" 
                : "Create an account to get started"}
            </p>
          </div>
          
          <Card className="auth-card dark:border-gray-700 dark:bg-gray-800 border-2 border-black/20 shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl dark:text-carbon-50">
                {activeTab === "signin" ? "Sign In" : "Create Account"}
              </CardTitle>
              <CardDescription className="dark:text-carbon-200">
                {location.state?.returnTo 
                  ? 'Sign in to save your project' 
                  : activeTab === "signin"
                    ? 'Enter your credentials to access your account'
                    : 'Fill in your details to create a new account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 auth-tabs-list">
                  <TabsTrigger 
                    value="signin"
                    className="auth-tab-trigger"
                    aria-label="Sign in tab"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="auth-tab-trigger"
                    aria-label="Create account tab"
                  >
                    Create Account
                  </TabsTrigger>
                </TabsList>
                
                <Suspense fallback={
                  <div className="flex justify-center p-4" aria-live="polite" aria-busy="true">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-carbon-600 dark:border-carbon-400"></div>
                    <span className="sr-only">Loading authentication forms...</span>
                  </div>
                }>
                  <TabsContent value="signin">
                    <LoginForm returnTo={returnTo} />
                  </TabsContent>
                  
                  <TabsContent value="signup">
                    <RegisterForm returnTo={returnTo} />
                  </TabsContent>
                </Suspense>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Auth;
