
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { LineChart as LineChartIcon, BarChart3, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PerformanceCardData {
  name: string;
  score: number;
  previous: number;
  change: number;
}

interface TimeframeData {
  date: string;
  concrete: number;
  steel: number;
  timber: number;
}

interface ChartData {
  month: TimeframeData[];
  quarter: TimeframeData[];
  year: TimeframeData[];
}

interface SustainabilityTrendsProps {
  chartData: ChartData;
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
}

export const SustainabilityTrendsChart = ({ 
  chartData, 
  selectedTimeframe, 
  setSelectedTimeframe 
}: SustainabilityTrendsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <LineChartIcon className="h-4 w-4 mr-2" />
            Sustainability Trends
          </CardTitle>
          <div className="flex items-center space-x-1">
            <button 
              className={`px-2 py-1 text-xs rounded ${selectedTimeframe === 'month' ? 'bg-carbon-600 text-white' : 'bg-transparent hover:bg-carbon-100'}`}
              onClick={() => setSelectedTimeframe('month')}
            >
              Month
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${selectedTimeframe === 'quarter' ? 'bg-carbon-600 text-white' : 'bg-transparent hover:bg-carbon-100'}`}
              onClick={() => setSelectedTimeframe('quarter')}
            >
              Quarter
            </button>
            <button 
              className={`px-2 py-1 text-xs rounded ${selectedTimeframe === 'year' ? 'bg-carbon-600 text-white' : 'bg-transparent hover:bg-carbon-100'}`}
              onClick={() => setSelectedTimeframe('year')}
            >
              Year
            </button>
          </div>
        </div>
        <CardDescription>Performance trends over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData[selectedTimeframe]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Legend />
              <Line type="monotone" dataKey="concrete" name="Concrete" stroke="#94a3b8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="steel" name="Steel" stroke="#64748b" />
              <Line type="monotone" dataKey="timber" name="Timber" stroke="#22c55e" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

interface MaterialComparisonProps {
  performanceData: PerformanceCardData[];
}

export const MaterialComparisonChart = ({ performanceData }: MaterialComparisonProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Material Comparison
          </CardTitle>
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </div>
        <CardDescription>Current sustainability scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performanceData.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{item.name}</span>
                <span className="text-sm font-medium">{item.score}%</span>
              </div>
              <Progress value={item.score} className="h-2" indicatorClassName={
                item.score > 80 ? "bg-green-500" : 
                item.score > 60 ? "bg-amber-500" : 
                "bg-red-500"
              } />
              <div className="flex justify-end items-center mt-1">
                {item.change > 0 ? (
                  <span className="text-xs flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {item.change}%
                  </span>
                ) : (
                  <span className="text-xs flex items-center text-red-600">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    {Math.abs(item.change)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
