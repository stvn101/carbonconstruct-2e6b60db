
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuggestionsSectionProps {
  suggestions: string[];
  onRecalculate: () => void;
}

const SuggestionsSection = ({ suggestions, onRecalculate }: SuggestionsSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Improvement Suggestions</CardTitle>
        <CardDescription>
          Recommendations to reduce your project's carbon footprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-2">
              <Leaf className="h-5 w-5 text-carbon-500 mt-0.5 flex-shrink-0" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap gap-2">
        <Button onClick={onRecalculate} variant="outline" className="hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300">
          Recalculate
        </Button>
        <Button onClick={() => navigate("/calculator")} className="bg-carbon-600 hover:bg-carbon-700 text-white">
          New Calculation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuggestionsSection;
