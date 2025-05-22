
import React, { useState } from 'react';
import { AverageSustainabilityCard, ImprovementRateCard, MaterialsAnalyzedCard } from './performance/PerformanceCards';
import { SustainabilityTrendsChart, MaterialComparisonChart } from './performance/PerformanceCharts';

interface MaterialPerformanceDashboardProps {
  materials: any[];
  className?: string;
}

const MaterialPerformanceDashboard: React.FC<MaterialPerformanceDashboardProps> = ({ materials, className }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  // Sample sustainability score data
  const performanceData = [
    { name: 'Concrete', score: 65, previous: 58, change: 7 },
    { name: 'Steel', score: 78, previous: 72, change: 6 },
    { name: 'Timber', score: 92, previous: 90, change: 2 },
    { name: 'Glass', score: 81, previous: 85, change: -4 }
  ];

  // Sample chart data
  const chartData = {
    month: [
      { date: 'Week 1', concrete: 82, steel: 70, timber: 90 },
      { date: 'Week 2', concrete: 78, steel: 74, timber: 91 },
      { date: 'Week 3', concrete: 70, steel: 76, timber: 92 },
      { date: 'Week 4', concrete: 65, steel: 78, timber: 92 }
    ],
    quarter: [
      { date: 'Jan', concrete: 85, steel: 65, timber: 88 },
      { date: 'Feb', concrete: 83, steel: 68, timber: 89 },
      { date: 'Mar', concrete: 78, steel: 70, timber: 90 },
      { date: 'Apr', concrete: 75, steel: 72, timber: 91 },
      { date: 'May', concrete: 70, steel: 76, timber: 92 },
      { date: 'Jun', concrete: 65, steel: 78, timber: 92 }
    ],
    year: [
      { date: 'Q1', concrete: 85, steel: 65, timber: 88 },
      { date: 'Q2', concrete: 78, steel: 70, timber: 90 },
      { date: 'Q3', concrete: 70, steel: 76, timber: 92 },
      { date: 'Q4', concrete: 65, steel: 78, timber: 92 }
    ]
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <AverageSustainabilityCard performanceData={performanceData} />
        <ImprovementRateCard performanceData={performanceData} />
        <MaterialsAnalyzedCard performanceData={performanceData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SustainabilityTrendsChart 
          chartData={chartData} 
          selectedTimeframe={selectedTimeframe} 
          setSelectedTimeframe={setSelectedTimeframe} 
        />
        <MaterialComparisonChart performanceData={performanceData} />
      </div>
    </div>
  );
};

export default MaterialPerformanceDashboard;
