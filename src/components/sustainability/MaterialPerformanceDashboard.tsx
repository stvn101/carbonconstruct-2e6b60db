
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart3, LineChart as LineChartIcon, ArrowUpRight, ArrowDownRight, Info, TrendingUp } from 'lucide-react';

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

  // Calculate average scores
  const avgScore = performanceData.reduce((total, item) => total + item.score, 0) / performanceData.length;
  const prevAvgScore = performanceData.reduce((total, item) => total + item.previous, 0) / performanceData.length;
  const averageChange = avgScore - prevAvgScore;

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Sustainability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{avgScore.toFixed(1)}</p>
                <div className="flex items-center mt-1">
                  {averageChange > 0 ? (
                    <span className="flex items-center text-green-600 text-sm">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      {averageChange.toFixed(1)} pts
                    </span>
                  ) : (
                    <span className="flex items-center text-red-600 text-sm">
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                      {Math.abs(averageChange).toFixed(1)} pts
                    </span>
                  )}
                </div>
              </div>
              <div className="h-16 w-16 relative">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke={avgScore > 80 ? "#22c55e" : avgScore > 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="3"
                    strokeDasharray={`${(avgScore / 100) * 100} 100`}
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    transform="rotate(-90 18 18)"
                  />
                  <text
                    x="18"
                    y="18"
                    dominantBaseline="central"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="currentColor"
                  >
                    {avgScore.toFixed(0)}
                  </text>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Improvement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">+{(averageChange / prevAvgScore * 100).toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground mt-1">vs. previous period</p>
              </div>
              <div className="h-16 w-16">
                <TrendingUp size={40} className="text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Materials Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{performanceData.length}</p>
                <p className="text-sm text-muted-foreground mt-1">key materials</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {performanceData.map(material => (
                  <Badge key={material.name} variant="outline" className="text-xs">
                    {material.name}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </div>
  );
};

export default MaterialPerformanceDashboard;
