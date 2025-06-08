import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="text-center max-w-3xl mx-auto mb-12">
      <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
        Smart Waste Classification with AI
      </h2>
      <p className="text-lg mb-8">
        Take a photo of your waste items and let our AI tell you the most eco-friendly way to dispose of them.
      </p>
      <div className="flex justify-center">
        <Button 
          className="bg-accent hover:bg-gray-600 text-white font-medium"
          onClick={scrollToUpload}
        >
          Get Started
        </Button>
      </div>
    </section>
  );
}
