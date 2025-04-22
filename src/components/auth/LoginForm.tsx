
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

interface LoginFormProps {
  returnTo?: string;
}

const LoginForm = ({ returnTo = "/dashboard" }: LoginFormProps) => {
  const { login, loading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
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
      await login(data.email, data.password);
      navigate(returnTo, { state: { fromAuth: true } });
    } catch (error) {
      setServerError("Invalid email or password");
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
            className="w-full bg-carbon-600 hover:bg-carbon-700 
              border border-black/80 dark:border-white/20 
              rounded-md shadow-sm 
              hover:border-black/90 dark:hover:border-white/30 
              transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
