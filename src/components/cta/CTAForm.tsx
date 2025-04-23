import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FormInput from "./form/FormInput";
import SubmitButton from "./form/SubmitButton";
import { useFormValidation } from "./form/useFormValidation";
import type { CTAFormProps, FormState } from "./form/types";

const CTAForm = ({ onSubmit, isSubmitting }: CTAFormProps) => {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    phone: ""
  });
  
  const [activeField, setActiveField] = useState<string | null>(null);
  const { errors, setErrors, validateForm } = useFormValidation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
    
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(formState)) {
      onSubmit(formState);
    }
  };

  return (
    <motion.form 
      className="space-y-4" 
      onSubmit={handleSubmit}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="name"
          label="Full Name"
          value={formState.name}
          error={errors.name}
          placeholder="John Doe"
          activeField={activeField}
          onChange={handleChange}
          onFocus={() => setActiveField('name')}
          onBlur={() => setActiveField(null)}
        />
        <FormInput
          id="email"
          label="Work Email"
          type="email"
          value={formState.email}
          error={errors.email}
          placeholder="john@construction.com"
          activeField={activeField}
          onChange={handleChange}
          onFocus={() => setActiveField('email')}
          onBlur={() => setActiveField(null)}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="company"
          label="Company"
          value={formState.company}
          error={errors.company}
          placeholder="Construction Inc."
          activeField={activeField}
          onChange={handleChange}
          onFocus={() => setActiveField('company')}
          onBlur={() => setActiveField(null)}
        />
        <FormInput
          id="phone"
          label="Phone Number"
          type="tel"
          value={formState.phone}
          placeholder="(123) 456-7890"
          isOptional
          activeField={activeField}
          onChange={handleChange}
          onFocus={() => setActiveField('phone')}
          onBlur={() => setActiveField(null)}
        />
      </div>
      <SubmitButton isSubmitting={isSubmitting} />
      <div className="text-xs text-carbon-700 dark:text-carbon-200 text-center mt-2">
        By submitting this form, you agree to our{" "}
        <Link to="/terms-of-service" className="underline hover:text-carbon-900 dark:hover:text-carbon-50">Terms of Service</Link>{" "}
        &{" "}
        <Link to="/privacy-policy" className="underline hover:text-carbon-900 dark:hover:text-carbon-50">Privacy Policy</Link>
      </div>
    </motion.form>
  );
};

export default CTAForm;
