import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="text-center max-w-4xl mx-auto mb-16 mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-sm bg-card/60 rounded-3xl p-8 md:p-12 shadow-2xl border border-primary/10"
      >
        {/* Badge */}
        <motion.div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Powered by Google Gemini AI</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h2 
          className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 bg-gradient-to-r from-primary via-green-600 to-primary bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Smart Waste Classification
          <br />
          <span className="text-3xl md:text-4xl lg:text-5xl">with AI Vision</span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Snap a photo of your waste items and get instant AI-powered guidance on the most eco-friendly disposal methods. Making sustainability simple, one scan at a time.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            size="lg"
            className="bg-primary hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            onClick={scrollToUpload}
          >
            Start Scanning
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg"
            variant="outline"
            className="border-2 font-semibold hover:bg-primary/5"
            onClick={() => {
              const guideSection = document.querySelector('[href="/guide"]');
              if (guideSection) {
                (guideSection as HTMLElement).click();
              }
            }}
          >
            Learn More
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-1">Fast</div>
            <div className="text-sm text-muted-foreground">&lt; 3s Analysis</div>
          </div>
          <div className="text-center border-x border-border">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-1">Accurate</div>
            <div className="text-sm text-muted-foreground">AI-Powered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-primary mb-1">Free</div>
            <div className="text-sm text-muted-foreground">For Everyone</div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
