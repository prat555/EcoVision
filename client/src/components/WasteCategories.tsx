import { Card, CardContent } from "@/components/ui/card";
import { Recycle, Leaf, AlertTriangle, Trash } from "lucide-react";

export default function WasteCategories() {
  const categories = [
    {
      title: "Recyclable",
      icon: <Recycle className="h-6 w-6 text-[#28A745] mr-2" />,
      description: "Materials that can be processed and reused in new products.",
      examples: [
        "Paper & cardboard",
        "Glass bottles & jars",
        "Metal cans",
        "Plastic bottles (PET, HDPE)",
        "Clean aluminum foil"
      ],
      highlightColor: "bg-[#28A745]"
    },
    {
      title: "Compostable",
      icon: <Leaf className="h-6 w-6 text-green-600 mr-2" />,
      description: "Organic materials that can decompose into nutrient-rich soil.",
      examples: [
        "Fruit & vegetable scraps",
        "Coffee grounds & filters",
        "Eggshells",
        "Yard trimmings",
        "Untreated paper products"
      ],
      highlightColor: "bg-green-600"
    },
    {
      title: "Special Disposal",
      icon: <AlertTriangle className="h-6 w-6 text-[#FFC107] mr-2" />,
      description: "Items requiring specific handling due to hazardous components.",
      examples: [
        "Batteries",
        "Electronics",
        "Light bulbs",
        "Paint",
        "Medications"
      ],
      highlightColor: "bg-[#FFC107]"
    }
  ];

  return (
    <section className="mb-12 max-w-6xl mx-auto">
      <h3 className="text-2xl font-heading font-semibold mb-6 text-center">
        Waste Classification Guide
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Card key={index} className="overflow-hidden">
            <div className={`h-2 ${category.highlightColor}`}></div>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                {category.icon}
                <h4 className="font-heading font-medium text-lg">{category.title}</h4>
              </div>
              <p className="text-sm mb-4">{category.description}</p>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Common examples:</p>
                <ul className="list-disc list-inside space-y-1 text-neutral-700 dark:text-neutral-300">
                  {category.examples.map((example, i) => (
                    <li key={i}>{example}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
