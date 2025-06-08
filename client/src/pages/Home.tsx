import { useEffect } from 'react';
import Hero from "@/components/Hero";
import ImageUploader from "@/components/ImageUploader";
import WasteCategories from "@/components/WasteCategories";
import AIAssistant from "@/components/AIAssistant";
import Stats from "@/components/Stats";
import CTA from "@/components/CTA";
import { useQuery } from "@tanstack/react-query";

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
    <div className="container mx-auto px-4 py-8">
      <Hero />
      <ImageUploader />
      <WasteCategories />
      <AIAssistant />
      <Stats 
        itemsAnalyzed={statsLoading ? "..." : stats?.itemsAnalyzed || "0"}
        accuracy={statsLoading ? "..." : stats?.accuracy || "89%"}
        wasteAverted={statsLoading ? "..." : stats?.wasteAverted || "0 kg"}
      />
      <CTA />
    </div>
  );
}
