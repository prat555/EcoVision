import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Leaf, ArrowUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import EcoVisionLogo from "@/icons/EcoVisionLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-green-700 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5" />
      </motion.button>

      <footer className="bg-gradient-to-b from-neutral-900 to-black text-white pt-16 pb-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4 group">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <EcoVisionLogo className="h-10 w-10 text-primary" />
                </motion.div>
                <h4 className="text-2xl font-heading font-bold text-white">EcoVision</h4>
              </Link>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                AI-powered waste classification helping you make sustainable disposal decisions for a cleaner planet.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, href: "#", label: "Facebook" },
                  { icon: Twitter, href: "#", label: "Twitter" },
                  { icon: Instagram, href: "#", label: "Instagram" }
                ].map((social, i) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-neutral-800 hover:bg-primary p-2.5 rounded-full transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="text-lg font-heading font-semibold mb-6 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Resources
              </h4>
              <ul className="space-y-3">
                {[
                  { name: "Recycling Guide", href: "/guide" },
                  { name: "Waste Categories", href: "/guide" },
                  { name: "Sustainable Living", href: "/guide" },
                  { name: "Educational Materials", href: "/about" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-neutral-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="text-lg font-heading font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {[
                  { name: "About Us", href: "/about" },
                  { name: "Our Mission", href: "/about" },
                  { name: "Partners", href: "/about" },
                  { name: "Contact", href: "/contact" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href} 
                      className="text-neutral-400 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-heading font-semibold mb-6">Stay Updated</h4>
              <p className="text-neutral-400 text-sm mb-4 leading-relaxed">
                Get the latest sustainability tips, recycling guides, and eco-friendly updates.
              </p>
              <form className="space-y-3" onSubmit={handleSubscribe}>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-primary" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-green-700 text-white font-medium"
                >
                  Subscribe Now
                </Button>
              </form>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-neutral-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-neutral-500 text-sm">
                &copy; {new Date().getFullYear()} EcoVision. All rights reserved. Made with 💚 for the planet.
              </p>
              <div className="flex gap-6 text-sm">
                {["Terms", "Privacy", "Cookies"].map((item) => (
                  <a 
                    key={item}
                    href="#" 
                    className="text-neutral-500 hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
