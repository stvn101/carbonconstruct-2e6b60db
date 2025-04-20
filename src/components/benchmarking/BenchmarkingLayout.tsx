
import React from "react";
import { BarChart3 } from "lucide-react";

interface BenchmarkingLayoutProps {
  children: React.ReactNode;
}

const BenchmarkingLayout: React.FC<BenchmarkingLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
              <BarChart3 className="h-6 w-6 text-carbon-700" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Benchmarking</h1>
          <p className="text-lg text-muted-foreground">
            Compare your project's performance against industry standards and identify areas for improvement
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default BenchmarkingLayout;
