
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";
import AuthFormError from "./AuthFormError";
import EmailField from "./form-fields/EmailField";
import PasswordField from "./form-fields/PasswordField";

interface RegisterFormProps {
  returnTo?: string;
}

const RegisterForm = ({ returnTo = "/dashboard" }: RegisterFormProps) => {
  const { register, loading } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: RegisterFormValues) => {
    try {
      setServerError(null);
      await register(data.email, data.email, data.password);
      navigate(returnTo, { state: { fromAuth: true } });
    } catch (error) {
      setServerError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <AuthFormError error={serverError} />
          <EmailField form={form} />
          <PasswordField form={form} />
          <PasswordField 
            form={form} 
            name="confirmPassword" 
            label="Confirm Password" 
          />

          <Button
            type="submit"
            className="w-full bg-carbon-600 hover:bg-carbon-700 
              border-2 border-black dark:border-white/40 
              rounded-md shadow-md py-6
              hover:shadow-lg hover:border-black dark:hover:border-white/60
              transition-all duration-200 
              font-medium text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
