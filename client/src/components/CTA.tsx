import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CTA() {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <section className="bg-primary rounded-xl shadow-lg overflow-hidden mb-12 max-w-6xl mx-auto">
      <div className="p-8 md:p-12 text-center text-white">
        <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4">
          Join Our Mission for a Cleaner Planet
        </h3>
        <p className="max-w-2xl mx-auto mb-6">
          Help us improve waste classification and reduce environmental impact by using EcoVision and sharing your experience.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/about">
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-300 font-medium transition-colors"
            >
              Learn More
            </Button>
          </Link>
          <Link href="/#upload-section">
            <Button
              onClick={scrollToUpload}
              className="bg-white text-primary hover:bg-gray-300 font-medium transition-colors"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
