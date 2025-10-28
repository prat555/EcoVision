import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2, Leaf, Trash2, Zap, Trees, Droplets, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recyclable':
        return <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <CheckCircle2 className="h-5 w-5" />
        </motion.div>;
      case 'compostable':
        return <Leaf className="h-5 w-5" />;
      case 'special':
        return <Zap className="h-5 w-5" />;
      case 'landfill':
        return <Trash2 className="h-5 w-5" />;
      default:
        return null;
    }
  };

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
    <motion.div 
      className="flex-grow flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0] 
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1 
        }}
      >
        <AlertCircle className="h-20 w-20 text-muted-foreground/30 mb-4" />
      </motion.div>
      <h5 className="text-lg font-semibold mb-2">No Analysis Yet</h5>
      <p className="text-muted-foreground text-sm max-w-xs">
        Upload or capture an image of waste items to receive AI-powered disposal recommendations
      </p>
    </motion.div>
  );

  const renderLoadingState = () => (
    <motion.div 
      className="flex-grow flex flex-col items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-16 w-16 text-primary mb-4" />
      </motion.div>
      <p className="text-lg font-semibold mb-2">Analyzing your waste...</p>
      <p className="text-sm text-muted-foreground text-center max-w-xs">
        Our AI is identifying the items and determining the best disposal methods
      </p>
      <motion.div 
        className="mt-4 flex gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );

  const renderResults = () => {
    if (!result) return null;
    
    const styles = getCategoryStyles(result.category);
    
    return (
      <motion.div 
        className="flex-grow overflow-y-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div 
          className={cn("mb-4 border-2 rounded-xl overflow-hidden shadow-md", styles.border)}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Category Header */}
          <div className={cn("px-5 py-4 border-b-2 flex justify-between items-center", styles.border, styles.bg, styles.bgOpacity)}>
            <div className="flex items-center gap-3">
              <motion.div
                className={cn("flex items-center justify-center", styles.text)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                {getCategoryIcon(result.category)}
              </motion.div>
              <h5 className="font-semibold text-lg">{result.itemName}</h5>
            </div>
            <motion.span 
              className={cn("text-sm font-bold px-3 py-1 rounded-full", styles.bg, "text-white")}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
            </motion.span>
          </div>

          {/* Content */}
          <div className="p-5 bg-card">
            <motion.p 
              className="mb-4 text-sm leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {result.category === 'recyclable' && "♻️ This item can be recycled in most curbside recycling programs."}
              {result.category === 'compostable' && "🌱 This item can be composted to create nutrient-rich soil."}
              {result.category === 'special' && "⚠️ This item requires special handling and cannot go in regular trash or recycling."}
              {result.category === 'landfill' && "🗑️ This item cannot be recycled or composted and should be placed in general waste."}
            </motion.p>

            {/* Disposal Instructions */}
            <motion.div 
              className="bg-muted/50 rounded-lg p-4 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-semibold mb-2 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Disposal Instructions:
              </p>
              <ul className="space-y-2">
                {result.disposalInstructions.map((instruction, i) => (
                  <motion.li 
                    key={i}
                    className="flex items-start gap-2 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (i * 0.1) }}
                  >
                    <span className={cn("mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0", styles.bg)} />
                    <span>{instruction}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Environmental Impact */}
            <motion.div 
              className="bg-primary/5 border border-primary/20 rounded-lg p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="font-semibold text-sm mb-2 text-primary flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Environmental Impact
              </p>
              <div className="flex items-start gap-2">
                <div className="flex gap-1 mt-1">
                  <motion.div
                    className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  >
                    <Leaf className="w-5 h-5 text-primary shrink-0" strokeWidth={2} />
                  </motion.div>
                  <motion.div
                    className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                  >
                    <Trees className="w-5 h-5 text-primary shrink-0" strokeWidth={2} />
                  </motion.div>
                  <motion.div
                    className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                  >
                    <Droplets className="w-5 h-5 text-primary shrink-0" strokeWidth={2} />
                  </motion.div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {result.environmentalImpact}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <Card className="flex flex-col h-full min-h-[500px] overflow-hidden border-2 shadow-lg backdrop-blur-sm bg-card/80">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b-2 backdrop-blur-sm">
        <h4 className="font-heading font-semibold text-lg">Analysis Results</h4>
      </CardHeader>
      
      <CardContent className="p-0 flex-grow">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading">{renderLoadingState()}</motion.div>
          ) : result ? (
            <motion.div key="results">{renderResults()}</motion.div>
          ) : (
            <motion.div key="empty">{renderEmptyState()}</motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
