
import React from 'react';
import { getPasswordStrength } from '@/utils/authHelpers';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const { score, label } = getPasswordStrength(password);
  
  if (!password) {
    return null;
  }
  
  // Define colors for different strength levels
  const getColorForScore = (score: number): string => {
    switch (Math.floor(score)) {
      case 0: return 'bg-red-500'; // Very Weak
      case 1: return 'bg-orange-500'; // Weak
      case 2: return 'bg-yellow-500'; // Medium
      case 3: return 'bg-blue-500'; // Strong
      case 4: return 'bg-green-500'; // Very Strong
      default: return 'bg-gray-300';
    }
  };

  // Create array of 5 bars
  const bars = Array.from({ length: 5 }, (_, i) => {
    const isActive = i < score * (5/4); // Convert score (0-4) to 5 bars
    return (
      <div
        key={i}
        className={`h-1.5 flex-1 rounded-full mx-0.5 transition-all duration-300 ${
          isActive ? getColorForScore(score) : 'bg-gray-200 dark:bg-gray-700'
        }`}
      ></div>
    );
  });

  return (
    <div className="my-2">
      <div className="flex mb-1">
        {bars}
      </div>
      <p className={`text-xs ${getTextColor(score)}`}>
        Password strength: <span className="font-semibold">{label}</span>
      </p>
      {score <= 2 && (
        <ul className="text-xs mt-1 text-gray-600 dark:text-gray-400 list-disc list-inside">
          {score < 2 && <li>Use at least 10 characters</li>}
          {!(/[A-Z]/.test(password)) && <li>Add uppercase letters</li>}
          {!(/[a-z]/.test(password)) && <li>Add lowercase letters</li>}
          {!(/[0-9]/.test(password)) && <li>Add numbers</li>}
          {!(/[^A-Za-z0-9]/.test(password)) && <li>Add special characters</li>}
          {/(.)\1\1/.test(password) && <li>Avoid repeated characters</li>}
        </ul>
      )}
    </div>
  );
};

const getTextColor = (score: number): string => {
  switch (Math.floor(score)) {
    case 0: return 'text-red-500 dark:text-red-400';
    case 1: return 'text-orange-500 dark:text-orange-400';
    case 2: return 'text-yellow-500 dark:text-yellow-400';
    case 3: return 'text-blue-500 dark:text-blue-400';
    case 4: return 'text-green-500 dark:text-green-400';
    default: return 'text-gray-500 dark:text-gray-400';
  }
};

export default PasswordStrengthMeter;
