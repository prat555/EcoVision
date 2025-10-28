import { Card, CardContent } from "@/components/ui/card";
import { Recycle, CheckCircle2, Trash2 } from "lucide-react";

interface StatsProps {
  itemsAnalyzed: string | number;
  accuracy: string;
  wasteAverted: string;
}

export default function Stats({ itemsAnalyzed, accuracy, wasteAverted }: StatsProps) {
  const stats = [
    {
      icon: <Recycle className="h-8 w-8 text-primary" strokeWidth={2} />,
      value: itemsAnalyzed,
      label: "Waste items analyzed by our AI"
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" strokeWidth={2} />,
      value: accuracy,
      label: "Accuracy in waste classification"
    },
    {
      icon: <Trash2 className="h-8 w-8 text-primary" strokeWidth={2} />,
      value: wasteAverted,
      label: "Waste items diverted from landfills"
    }
  ];

  return (
    <section className="mb-12 max-w-6xl mx-auto">
      <h3 className="text-2xl font-heading font-semibold mb-8 text-center">Environmental Impact</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4 shrink-0">
                {stat.icon}
              </div>
              <h4 className="text-xl font-heading font-medium mb-2">{stat.value}</h4>
              <p className="text-neutral-600 dark:text-neutral-400">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
