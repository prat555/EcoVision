import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-heading font-medium mb-4">EcoVision</h4>
            <p className="text-neutral-400 text-sm">
              AI-powered waste classification helping you make sustainable disposal decisions.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-heading font-medium mb-4">Resources</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/guide" className="hover:text-white transition-colors">Recycling Guide</Link></li>
              <li><Link href="/guide" className="hover:text-white transition-colors">Waste Classification</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainable Living</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Educational Materials</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-heading font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Mission</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-heading font-medium mb-4">Subscribe</h4>
            <p className="text-neutral-400 text-sm mb-4">
              Get the latest sustainability tips and updates.
            </p>
            <form className="flex" onSubmit={handleSubscribe}>
              <Input 
                type="email" 
                placeholder="Your email" 
                className="flex-grow rounded-r-none text-neutral-800 focus:outline-none" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button 
                type="submit" 
                className="bg-primary hover:bg-secondary text-white rounded-l-none"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-neutral-400 text-sm flex flex-col md:flex-row justify-between">
          <p>&copy; 2023 EcoVision. All rights reserved.</p>
          <div className="space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
