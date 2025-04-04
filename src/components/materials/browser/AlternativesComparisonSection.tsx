
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowRight, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { EnrichedMaterial, createExtendedMaterialDB } from "@/utils/materialUtils";

const AlternativesComparisonSection: React.FC = () => {
  const EXTENDED_MATERIAL_DB = createExtendedMaterialDB();
  const materialPairs = [] as {standard: EnrichedMaterial, alternative: EnrichedMaterial}[];
  
  EXTENDED_MATERIAL_DB.forEach(material => {
    if (material.alternativeToStandard) {
      const standardName = material.type.replace(/recycled |low-carbon |sustainable /i, '');
      const standard = EXTENDED_MATERIAL_DB.find(m => 
        m.type.toLowerCase() === standardName.toLowerCase() && !m.alternativeToStandard
      );
      
      if (standard) {
        materialPairs.push({
          standard,
          alternative: material
        });
      }
    }
  });

  const comparisonData = materialPairs.map(pair => ({
    name: pair.standard.type,
    standard: pair.standard.factor,
    alternative: pair.alternative.factor,
    reduction: Math.round(((pair.standard.factor - pair.alternative.factor) / pair.standard.factor) * 100)
  }));

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Sustainable Alternatives</CardTitle>
          <CardDescription>
            Compare standard materials with their more sustainable alternatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Emission Factor Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={comparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis label={{ value: 'kg CO₂e/kg', angle: -90, position: 'insideLeft' }} />
                  <RechartsTooltip />
                  <Bar dataKey="standard" name="Standard Material" fill="#a3a3a3" />
                  <Bar dataKey="alternative" name="Sustainable Alternative" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4">Direct Comparisons</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Standard Material</TableHead>
                  <TableHead>Sustainable Alternative</TableHead>
                  <TableHead>Emission Reduction</TableHead>
                  <TableHead>Sustainability Improvement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialPairs.map((pair, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{pair.standard.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {pair.alternative.type}
                        <Badge className="ml-2 bg-green-600">Eco</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowDown className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-medium">{Math.round(pair.alternative.carbonReduction)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-xs">{pair.standard.sustainabilityScore}</span>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gray-600 h-2 rounded-full" 
                              style={{ width: `${pair.standard.sustainabilityScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-xs">{pair.alternative.sustainabilityScore}</span>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-carbon-600 h-2 rounded-full" 
                              style={{ width: `${pair.alternative.sustainabilityScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 bg-carbon-50 dark:bg-carbon-900 p-4 rounded-lg">
            <h4 className="flex items-center font-medium mb-2">
              <BarChart3 className="h-5 w-5 mr-2 text-carbon-600" />
              Key Benefits of Sustainable Alternatives
            </h4>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start">
                <div className="min-w-4 h-4 w-4 rounded-full bg-carbon-600 mt-1 mr-2"></div>
                <span>Lower carbon footprint - reduced embodied carbon emissions</span>
              </li>
              <li className="flex items-start">
                <div className="min-w-4 h-4 w-4 rounded-full bg-carbon-600 mt-1 mr-2"></div>
                <span>Compliance with evolving building codes and sustainability regulations</span>
              </li>
              <li className="flex items-start">
                <div className="min-w-4 h-4 w-4 rounded-full bg-carbon-600 mt-1 mr-2"></div>
                <span>Improved project sustainability ratings and certifications (LEED, BREEAM, etc.)</span>
              </li>
              <li className="flex items-start">
                <div className="min-w-4 h-4 w-4 rounded-full bg-carbon-600 mt-1 mr-2"></div>
                <span>Reduced environmental impact through recycled content or sustainable sourcing</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlternativesComparisonSection;
