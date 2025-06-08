import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisResultProps {
  isLoading: boolean;
  result: {
    category: 'recyclable' | 'compostable' | 'special' | 'landfill';
    itemName: string;
    disposalInstructions: string[];
    environmentalImpact: string;
  } | null;
}

export default function AnalysisResults({ isLoading, result }: AnalysisResultProps) {
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'recyclable':
        return {
          border: 'border-[#28A745]',
          bg: 'bg-[#28A745]',
          text: 'text-[#28A745]',
          bgOpacity: 'bg-opacity-10'
        };
      case 'compostable':
        return {
          border: 'border-green-600',
          bg: 'bg-green-600',
          text: 'text-green-600',
          bgOpacity: 'bg-opacity-10'
        };
      case 'special':
        return {
          border: 'border-[#FFC107]',
          bg: 'bg-[#FFC107]',
          text: 'text-[#FFC107]',
          bgOpacity: 'bg-opacity-10'
        };
      case 'landfill':
        return {
          border: 'border-[#DC3545]',
          bg: 'bg-[#DC3545]',
          text: 'text-[#DC3545]',
          bgOpacity: 'bg-opacity-10'
        };
      default:
        return {
          border: 'border-neutral-300',
          bg: 'bg-neutral-300',
          text: 'text-neutral-600',
          bgOpacity: 'bg-opacity-10'
        };
    }
  };

  const renderEmptyState = () => (
    <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mb-4" />
      <h5 className="text-lg font-medium mb-2">No Analysis Yet</h5>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
        Upload an image of waste items to receive AI-powered disposal recommendations
      </p>
    </div>
  );

  const renderLoadingState = () => (
    <div className="flex-grow flex flex-col items-center justify-center p-6">
      <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
      <p className="text-lg font-medium">Analyzing your waste...</p>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 text-center">
        Our AI is identifying the items and determining the best disposal methods
      </p>
    </div>
  );

  const renderResults = () => {
    if (!result) return null;
    
    const styles = getCategoryStyles(result.category);
    
    return (
      <div className="flex-grow overflow-y-auto p-4">
        <div className={cn("result-item mb-4 border rounded-lg overflow-hidden", styles.border)}>
          <div className={cn("px-4 py-2 border-b flex justify-between items-center", styles.border, styles.bg, styles.bgOpacity)}>
            <div className="flex items-center">
              <span className={cn("w-3 h-3 rounded-full mr-2", styles.bg)}></span>
              <h5 className="font-medium">{result.itemName}</h5>
            </div>
            <span className={cn("text-sm font-medium", styles.text)}>
              {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
            </span>
          </div>
          <div className="p-4">
            <p className="mb-3 text-sm">
              {result.category === 'recyclable' && "This item can be recycled in most curbside recycling programs."}
              {result.category === 'compostable' && "This item can be composted to create nutrient-rich soil."}
              {result.category === 'special' && "This item requires special handling and cannot go in regular trash or recycling."}
              {result.category === 'landfill' && "This item cannot be recycled or composted and should be placed in general waste."}
            </p>
            <div className="text-sm">
              <p className="font-medium mb-1">Disposal Instructions:</p>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-neutral-300">
                {result.disposalInstructions.map((instruction, i) => (
                  <li key={i}>{instruction}</li>
                ))}
              </ul>
            </div>
            <div className="mt-3 text-xs text-neutral-500">
              <p>Environmental Impact: {result.environmentalImpact}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden border border-neutral-200 dark:border-neutral-700">
      <CardHeader className="bg-neutral-100 dark:bg-neutral-700 px-4 py-3 border-b border-neutral-200 dark:border-neutral-600">
        <h4 className="font-heading font-medium">Analysis Results</h4>
      </CardHeader>
      
      <CardContent className="p-0 flex-grow">
        {isLoading ? renderLoadingState() : 
          result ? renderResults() : renderEmptyState()}
      </CardContent>
    </Card>
  );
}
