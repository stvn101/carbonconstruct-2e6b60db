
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

// Auth
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Captcha
import HCaptcha from "@hcaptcha/react-hcaptcha";

type FormData = {
  email: string;
  password: string;
  remember: boolean;
};

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const captchaRef = React.useRef<HCaptcha>(null);
  
  const { register, handleSubmit, formState: { errors }, getValues, reset } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      remember: false
    }
  });

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  const resetCaptcha = () => {
    setCaptchaToken(null);
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };

  const handleSignIn = async (data: FormData) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const result = await signIn(data.email, data.password, captchaToken);
      if (result.error) {
        toast.error(result.error.message);
        setAuthError(result.error.message);
        resetCaptcha();
      } else {
        toast.success("Signed in successfully!");
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      toast.error(error.message || "Failed to sign in");
      setAuthError(error.message || "Failed to sign in");
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (data: FormData) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const result = await signUp(data.email, data.password, captchaToken);
      if (result.error) {
        toast.error(result.error.message);
        setAuthError(result.error.message);
        resetCaptcha();
      } else {
        toast.success("Check your email for confirmation!");
        setActiveTab("signin");
        reset();
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast.error(error.message || "Failed to sign up");
      setAuthError(error.message || "Failed to sign up");
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Enter your credentials to access your account
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
                
                <TabsContent value="signin">
                  <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="your.email@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-sm text-carbon-600 hover:underline">
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          autoCapitalize="none"
                          autoComplete="current-password"
                          {...register("password", { required: "Password is required" })}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" {...register("remember")} />
                      <Label htmlFor="remember">Remember me</Label>
                    </div>
                    
                    {/* Captcha for sign in */}
                    <div className="flex justify-center py-2">
                      <HCaptcha
                        ref={captchaRef}
                        sitekey="9f524944-cf4e-4a23-a874-e1bb98f07f23"
                        onVerify={onCaptchaVerify}
                      />
                    </div>
                    
                    {authError && (
                      <div className="bg-destructive/10 text-destructive text-sm p-2 rounded">
                        {authError}
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting || !captchaToken}
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="your.email@example.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        {...register("email", { 
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          placeholder="••••••••"
                          type={showPassword ? "text" : "password"}
                          autoCapitalize="none"
                          autoComplete="new-password"
                          {...register("password", { 
                            required: "Password is required",
                            minLength: {
                              value: 6,
                              message: "Password must be at least 6 characters"
                            }
                          })}
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password.message}</p>
                      )}
                    </div>
                    
                    {/* Captcha for sign up */}
                    <div className="flex justify-center py-2">
                      <HCaptcha
                        ref={captchaRef}
                        sitekey="9f524944-cf4e-4a23-a874-e1bb98f07f23"
                        onVerify={onCaptchaVerify}
                      />
                    </div>
                    
                    {authError && (
                      <div className="bg-destructive/10 text-destructive text-sm p-2 rounded">
                        {authError}
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isSubmitting || !captchaToken}
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                    
                    <p className="text-center text-xs text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="underline underline-offset-4 hover:text-primary">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default Auth;
