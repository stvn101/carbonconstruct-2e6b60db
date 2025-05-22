
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface PerformanceCardData {
  name: string;
  score: number;
  previous: number;
  change: number;
}

interface SummaryCardsProps {
  performanceData: PerformanceCardData[];
}

export const AverageSustainabilityCard = ({ performanceData }: SummaryCardsProps) => {
  const avgScore = performanceData.reduce((total, item) => total + item.score, 0) / performanceData.length;
  const prevAvgScore = performanceData.reduce((total, item) => total + item.previous, 0) / performanceData.length;
  const averageChange = avgScore - prevAvgScore;

  return (
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
  );
};

export const ImprovementRateCard = ({ performanceData }: SummaryCardsProps) => {
  const avgScore = performanceData.reduce((total, item) => total + item.score, 0) / performanceData.length;
  const prevAvgScore = performanceData.reduce((total, item) => total + item.previous, 0) / performanceData.length;
  const averageChange = avgScore - prevAvgScore;

  return (
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
  );
};

export const MaterialsAnalyzedCard = ({ performanceData }: SummaryCardsProps) => {
  return (
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
  );
};
