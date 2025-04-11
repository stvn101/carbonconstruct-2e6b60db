
import React from 'react';

declare module '@/components/CarbonCalculator' {
  export interface CarbonCalculatorProps {
    demoMode?: boolean;
  }

  const CarbonCalculator: React.FC<CarbonCalculatorProps>;
  export default CarbonCalculator;
}
