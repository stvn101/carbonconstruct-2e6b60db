
import { useContext } from 'react';
import { CalculatorContext } from './CalculatorContext';
import { CalculatorContextType } from './types';

export function useCalculator(): CalculatorContextType {
  const context = useContext(CalculatorContext);
  
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  
  return context;
}
