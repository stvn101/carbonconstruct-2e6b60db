
import { useState, useCallback } from 'react';

type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  isEmail?: boolean;
  isNumber?: boolean;
  custom?: (value: string) => boolean;
};

type ValidationErrors = Record<string, string>;

const useFormValidation = <T extends Record<string, string>>(
  initialValues: T,
  validationRules: Record<keyof T, ValidationRules>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(() => {
    const initialTouched = {} as Record<keyof T, boolean>;
    Object.keys(initialValues).forEach(key => {
      initialTouched[key as keyof T] = false;
    });
    return initialTouched;
  });

  const validateField = useCallback((name: keyof T, value: string): string => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && !value) {
      return 'This field is required';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`;
    }

    if (rules.isEmail && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return 'Invalid email address';
    }

    if (rules.isNumber && !/^\d+$/.test(value)) {
      return 'Must be a number';
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.custom && !rules.custom(value)) {
      return 'Invalid value';
    }

    return '';
  }, [validationRules]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate field if it's already been touched
    if (touched[name as keyof T]) {
      const error = validateField(name as keyof T, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name as keyof T, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = useCallback(() => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const k = key as keyof T;
      const error = validateField(k, values[k]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    
    // Mark all fields as touched when validating the whole form
    const allTouched = {} as Record<keyof T, boolean>;
    Object.keys(values).forEach(key => {
      allTouched[key as keyof T] = true;
    });
    setTouched(allTouched);
    
    return isValid;
  }, [values, validateField]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    const resetTouched = {} as Record<keyof T, boolean>;
    Object.keys(initialValues).forEach(key => {
      resetTouched[key as keyof T] = false;
    });
    setTouched(resetTouched);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues
  };
};

export default useFormValidation;
