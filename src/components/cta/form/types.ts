
import { ChangeEvent, FocusEvent } from 'react';

export interface InputProps {
  id: string;
  label: string;
  value: string;
  error?: string;
  type?: string;
  placeholder?: string;
  isOptional?: boolean;
  activeField: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export interface FormState {
  name: string;
  email: string;
  company: string;
  phone: string;
}

export interface CTAFormProps {
  onSubmit: (formData: FormState) => void;
  isSubmitting: boolean;
}
