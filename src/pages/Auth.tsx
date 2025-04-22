
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

// Lazy load the auth forms
const LoginForm = lazy(() => import("@/components/auth/LoginForm"));
const RegisterForm = lazy(() => import("@/components/auth/RegisterForm"));

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("signin");
  const returnTo = location.state?.returnTo || '/dashboard';

  useEffect(() => {
    // If user is already logged in, redirect to returnTo or dashboard
    if (user) {
      navigate(returnTo, { state: { fromAuth: true } });
    }
  }, [user, navigate, returnTo]);

  return (
    <>
      <Helmet>
        <title>Sign In | CarbonConstruct</title>
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
            <h1 className="text-2xl font-bold">Welcome to CarbonConstruct</h1>
            <p className="text-muted-foreground mt-2">Sign in to measure and reduce your construction carbon footprint</p>
          </div>
          
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Authentication</CardTitle>
              <CardDescription>
                {location.state?.returnTo ? 'Sign in to save your project' : 'Enter your credentials to access your account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Create Account</TabsTrigger>
                </TabsList>
                
                <Suspense fallback={
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-carbon-600"></div>
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
