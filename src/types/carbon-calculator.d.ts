
import React from 'react';

// Define the props interface without redeclaring the component itself
export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

// This tells TypeScript about the component without creating a duplicate declaration
declare const CarbonCalculator: React.FC<CarbonCalculatorProps>;
export default CarbonCalculator;
