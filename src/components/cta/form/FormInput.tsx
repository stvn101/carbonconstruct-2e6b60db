
import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { InputProps } from "./types";

const FormInput = ({ 
  id, 
  label, 
  value, 
  error, 
  type = "text",
  placeholder,
  isOptional,
  activeField,
  onChange,
  onFocus,
  onBlur 
}: InputProps) => {
  // Determine appropriate autocomplete value based on id/type
  const getAutoCompleteValue = () => {
    switch(id) {
      case 'name': return 'name';
      case 'email': return 'email';
      case 'phone': return 'tel';
      case 'company': return 'organization';
      case 'website': return 'url';
      case 'address': return 'street-address';
      case 'city': return 'address-level2';
      case 'state': return 'address-level1';
      case 'zip': return 'postal-code';
      case 'country': return 'country';
      default: return type === 'email' ? 'email' : 
               type === 'tel' ? 'tel' :
               type === 'url' ? 'url' : 'off';
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">
        {label} {isOptional && <span className="text-xs text-gray-500">(Optional)</span>}
      </label>
      <div className="relative">
        <input 
          type={type}
          id={id}
          name={id}
          placeholder={placeholder}
          className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border ${
            error ? 'border-red-400' : activeField === id ? 'border-carbon-600 dark:border-carbon-400' : 'border-gray-300 dark:border-gray-600'
          } rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-carbon-500/50 transition-all duration-200`}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          aria-label={label}
          aria-required={!isOptional}
          aria-invalid={!!error}
          autoComplete={getAutoCompleteValue()}
        />
        {error && (
          <motion.p 
            className="mt-1 text-xs text-red-500 flex items-center"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            aria-live="polite"
          >
            <span className="bg-red-400/20 p-1 rounded-full mr-1">!</span>
            {error}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default FormInput;
