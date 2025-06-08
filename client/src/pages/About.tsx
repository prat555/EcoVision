import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function About() {
  useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
    
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-center">About EcoVision</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-primary">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              EcoVision aims to revolutionize waste management through cutting-edge AI technology. 
              Our mission is to empower individuals and businesses with the knowledge and tools needed 
              to make informed waste disposal decisions that benefit our planet.
            </p>
            <p>
              By providing accurate waste classification and personalized disposal recommendations, 
              we help reduce landfill waste, increase recycling rates, and promote sustainable practices 
              in everyday life.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-primary">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We envision a world where waste is properly sorted, recycled, and managed to minimize 
              environmental impact. Through education and accessible technology, we believe we can 
              create a global community committed to sustainable waste management practices that 
              protect our planet for future generations.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-primary">How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg mb-2">AI-Powered Image Recognition</h3>
                <p>
                  Our advanced AI algorithms analyze images of waste items to identify materials 
                  and determine their recyclability with high accuracy.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Personalized Recommendations</h3>
                <p>
                  Based on the analysis, we provide tailored disposal instructions specific to 
                  the item and material type, ensuring proper waste management.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium text-lg mb-2">Sustainability Education</h3>
                <p>
                  Our AI assistant offers informative responses to questions about sustainable 
                  practices, helping users deepen their understanding of environmental issues.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-primary">Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              EcoVision was founded by a team of environmental scientists, AI researchers, and 
              sustainability advocates passionate about using technology to solve environmental challenges.
            </p>
            <p>
              We're committed to continuous improvement of our technology and expanding our impact 
              through partnerships with waste management facilities, environmental organizations, 
              and educational institutions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
