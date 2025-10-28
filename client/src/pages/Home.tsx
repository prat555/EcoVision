import { useEffect } from 'react';
import Hero from "@/components/Hero";
import ImageUploader from "@/components/ImageUploader";
import WasteCategories from "@/components/WasteCategories";
import AIAssistant from "@/components/AIAssistant";
import Stats from "@/components/Stats";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function Home() {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop")',
          }}
        />
        {/* Gradient overlays for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      </div>
      
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <ImageUploader />
          <WasteCategories />
          <AIAssistant />
          <Stats 
            itemsAnalyzed={statsLoading ? "..." : stats?.itemsAnalyzed || "67"}
            accuracy={statsLoading ? "..." : stats?.accuracy || "89%"}
            wasteAverted={statsLoading ? "..." : stats?.wasteAverted || "354 kg"}
          />
        </motion.div>
      </div>
    </div>
  );
}
