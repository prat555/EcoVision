import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RecycleIcon, 
  LeafIcon, 
  AlertTriangleIcon, 
  TrashIcon 
} from "lucide-react";

export default function Guide() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-center">Waste Classification Guide</h1>
        <p className="text-lg text-center mb-10">Learn how to properly sort and dispose of different types of waste materials.</p>
        
        <Tabs defaultValue="recyclable" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="recyclable" className="flex items-center gap-2">
              <RecycleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Recyclable</span>
            </TabsTrigger>
            <TabsTrigger value="compostable" className="flex items-center gap-2">
              <LeafIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Compostable</span>
            </TabsTrigger>
            <TabsTrigger value="special" className="flex items-center gap-2">
              <AlertTriangleIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Special</span>
            </TabsTrigger>
            <TabsTrigger value="landfill" className="flex items-center gap-2">
              <TrashIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Landfill</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recyclable">
            <Card>
              <CardHeader className="bg-[#28A745] bg-opacity-10 border-b border-[#28A745]">
                <CardTitle className="text-xl font-heading flex items-center">
                  <span className="w-3 h-3 bg-[#28A745] rounded-full mr-2"></span>
                  Recyclable Materials
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">Materials that can be processed and transformed into new products, reducing the need for raw materials and energy consumption.</p>
                
                <h3 className="font-medium text-lg mb-2">Common Examples:</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>Paper & cardboard (clean, dry, and not contaminated with food)</li>
                  <li>Glass bottles & jars (rinsed, with caps removed)</li>
                  <li>Metal cans (aluminum, steel, tin - rinsed)</li>
                  <li>Plastic bottles (types 1-PET and 2-HDPE are most commonly accepted)</li>
                  <li>Clean aluminum foil (flattened, with food residue removed)</li>
                  <li>Rigid plastic containers (check local guidelines for accepted types)</li>
                </ul>
                
                <h3 className="font-medium text-lg mb-2">Recycling Tips:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Always rinse containers to remove food residue</li>
                  <li>Remove paper labels when possible</li>
                  <li>Flatten cardboard boxes to save space</li>
                  <li>Check local recycling guidelines as accepted materials vary by location</li>
                  <li>Don't bag recyclables unless specifically required by your local facility</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="compostable">
            <Card>
              <CardHeader className="bg-green-600 bg-opacity-10 border-b border-green-600">
                <CardTitle className="text-xl font-heading flex items-center">
                  <span className="w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                  Compostable Materials
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">Organic materials that can naturally decompose into nutrient-rich soil amendment, reducing landfill waste and methane emissions.</p>
                
                <h3 className="font-medium text-lg mb-2">Common Examples:</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>Fruit and vegetable scraps</li>
                  <li>Coffee grounds and filters</li>
                  <li>Tea bags (remove staples)</li>
                  <li>Eggshells (crushed)</li>
                  <li>Yard trimmings, leaves, and grass clippings</li>
                  <li>Uncoated paper products (napkins, paper towels, etc.)</li>
                  <li>Nutshells and corn cobs</li>
                </ul>
                
                <h3 className="font-medium text-lg mb-2">Composting Tips:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Maintain a balance of "green" (nitrogen-rich) and "brown" (carbon-rich) materials</li>
                  <li>Cut larger items into smaller pieces to speed decomposition</li>
                  <li>Keep compost moist but not soggy</li>
                  <li>Turn compost regularly to aerate</li>
                  <li>Avoid meat, dairy, oils, and pet waste in home composting</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="special">
            <Card>
              <CardHeader className="bg-[#FFC107] bg-opacity-10 border-b border-[#FFC107]">
                <CardTitle className="text-xl font-heading flex items-center">
                  <span className="w-3 h-3 bg-[#FFC107] rounded-full mr-2"></span>
                  Special Disposal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">Items requiring specific handling procedures due to hazardous components or special recycling requirements that can't be processed through standard channels.</p>
                
                <h3 className="font-medium text-lg mb-2">Common Examples:</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>Batteries (all types)</li>
                  <li>Electronics and e-waste</li>
                  <li>Light bulbs (especially CFLs and fluorescents)</li>
                  <li>Paint and paint-related products</li>
                  <li>Household chemicals and cleaners</li>
                  <li>Medications and pharmaceuticals</li>
                  <li>Automotive fluids and parts</li>
                  <li>Propane tanks and aerosol cans</li>
                </ul>
                
                <h3 className="font-medium text-lg mb-2">Disposal Tips:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Never place special disposal items in regular trash or recycling</li>
                  <li>Check for local household hazardous waste collection events</li>
                  <li>Many retailers offer take-back programs for items like batteries and electronics</li>
                  <li>Use community drug take-back programs for unused medications</li>
                  <li>Store hazardous items in original containers when possible</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="landfill">
            <Card>
              <CardHeader className="bg-[#DC3545] bg-opacity-10 border-b border-[#DC3545]">
                <CardTitle className="text-xl font-heading flex items-center">
                  <span className="w-3 h-3 bg-[#DC3545] rounded-full mr-2"></span>
                  Landfill Waste
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="mb-4">Items that cannot currently be recycled or composted and must be sent to landfill. When possible, seek alternatives to these products.</p>
                
                <h3 className="font-medium text-lg mb-2">Common Examples:</h3>
                <ul className="list-disc list-inside space-y-2 mb-6">
                  <li>Certain plastic films and bags</li>
                  <li>Contaminated food containers</li>
                  <li>Disposable diapers</li>
                  <li>Broken ceramics and glassware (wrapped safely)</li>
                  <li>Certain mixed material packaging</li>
                  <li>Non-recyclable plastics (types 3, 6, and 7 in many areas)</li>
                  <li>Heavily soiled paper products</li>
                </ul>
                
                <h3 className="font-medium text-lg mb-2">Waste Reduction Tips:</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>Choose products with minimal or recyclable packaging</li>
                  <li>Opt for reusable alternatives to disposable items</li>
                  <li>Donate usable items instead of discarding them</li>
                  <li>Consider a product's end-of-life when making purchases</li>
                  <li>Repair items when possible instead of replacing them</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
