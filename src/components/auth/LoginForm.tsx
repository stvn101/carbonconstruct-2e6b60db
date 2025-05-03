
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import AuthFormError from "./AuthFormError";
import EmailField from "./form-fields/EmailField";
import PasswordField from "./form-fields/PasswordField";
import { Separator } from "@/components/ui/separator";

interface LoginFormProps {
  returnTo?: string;
}

const LoginForm = ({ returnTo = "/dashboard" }: LoginFormProps) => {
  const { login, signInWithGoogle, signInWithGitHub } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [socialLoginType, setSocialLoginType] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormValues) => {
    try {
      setServerError(null);
      setIsLoading(true);
      await login(data.email, data.password);
      navigate(returnTo, { state: { fromAuth: true } });
    } catch (error: any) {
      setServerError(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      setServerError(null);
      setSocialLoginType(provider);
      
      // Store return URL in session storage for the callback
      sessionStorage.setItem('authReturnUrl', returnTo);
      
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithGitHub();
      }
    } catch (error: any) {
      setServerError(`${provider} login failed: ${error.message}`);
      setSocialLoginType(null);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <AuthFormError error={serverError} />
          <EmailField form={form} />
          <PasswordField form={form} />
          
          <Button
            type="submit"
            className="w-full bg-carbon-600 hover:bg-carbon-700 border border-black dark:border-white/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In
              </>
            ) : (
              "Sign In"
            )}
          </Button>
          
          <div className="relative my-6">
            <Separator />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-2 text-muted-foreground text-sm">
              Or continue with
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              disabled={!!socialLoginType}
              className="border-gray-300 dark:border-gray-600"
            >
              {socialLoginType === 'google' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={() => handleSocialLogin('github')}
              disabled={!!socialLoginType}
              className="border-gray-300 dark:border-gray-600"
            >
              {socialLoginType === 'github' ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"
                  />
                </svg>
              )}
              GitHub
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
