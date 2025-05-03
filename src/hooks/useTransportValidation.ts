
import { useState } from 'react';

// Define the maximum values allowed per NCC 2025 regulations
export const MAX_DISTANCE = 10000; // 10,000 km
export const MAX_WEIGHT = 10000;   // 10,000 kg

export interface TransportFieldError {
  distance?: string;
  weight?: string;
}

export const useTransportValidation = () => {
  const [errors, setErrors] = useState<Record<number, TransportFieldError>>({});

  const validateField = (index: number, field: 'distance' | 'weight', value: string) => {
    const numValue = Number(value);
    
    if (value === "") {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          delete newErrors[index][field];
          if (Object.keys(newErrors[index] || {}).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
      return true;
    }

    if (!isNaN(numValue)) {
      if (numValue < 0) {
        setErrors(prev => ({
          ...prev,
          [index]: {
            ...(prev[index] || {}),
            [field]: `${field === 'distance' ? 'Distance' : 'Weight'} cannot be negative`
          }
        }));
        return false;
      } else if ((field === 'distance' && numValue > MAX_DISTANCE) || 
                 (field === 'weight' && numValue > MAX_WEIGHT)) {
        const maxValue = field === 'distance' ? MAX_DISTANCE : MAX_WEIGHT;
        const unit = field === 'distance' ? 'km' : 'kg';
        setErrors(prev => ({
          ...prev,
          [index]: {
            ...(prev[index] || {}),
            [field]: `Maximum ${field} is ${maxValue.toLocaleString()} ${unit}`
          }
        }));
        return false;
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors[index]) {
            delete newErrors[index][field];
            if (Object.keys(newErrors[index] || {}).length === 0) {
              delete newErrors[index];
            }
          }
          return newErrors;
        });
        return true;
      }
    }
    return false;
  };

  return { errors, validateField };
};
