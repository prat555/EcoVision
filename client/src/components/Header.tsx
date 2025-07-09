import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  MenuIcon, 
  X, 
  User as UserIcon,
  LogOut,
  Sun,
  Moon 
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDarkMode } from "@/hooks/useDarkMode";
import EcoVisionLogo from "@/icons/EcoVisionLogo";
import { useAuth } from "@/hooks/use-firebase-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const [location] = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Guide", path: "/guide" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white dark:bg-neutral-800 shadow-sm dark:shadow-none border-b border-neutral-200 dark:border-neutral-700 transition-colors">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <EcoVisionLogo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-heading font-bold text-primary">EcoVision</h1>
          </Link>
        </div>
        
        <div className="flex items-center">
          {/* Main Navigation - aligned in the middle */}
          <div className="hidden md:flex items-center space-x-6 mr-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`font-medium transition-colors ${
                  location === link.path 
                    ? "text-primary" 
                    : "hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          {/* Dark Mode Toggle - with sun/moon icons */}
          <div className="flex items-center mr-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="hover:bg-transparent"
            >
              {isDarkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          
          {/* Login/User Profile - rightmost element */}
          <div className="hidden md:block">
            {!user ? (
              <Link href="/auth">
                <Button variant="default" size="sm">
                  Login / Sign Up
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name ?? user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout()}
                    className="text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    href={link.path}
                    className={`text-lg font-medium transition-colors ${
                      location === link.path 
                        ? "text-primary" 
                        : "hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {/* Mobile theme toggle */}
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">Theme</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className="hover:bg-transparent"
                  >
                    {isDarkMode ? (
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    ) : (
                      <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>
                
                {/* Mobile auth buttons */}
                {!user ? (
                  <Link 
                    href="/auth"
                    className="w-full" 
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="default" className="w-full">
                      Login / Sign Up
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-center gap-2 text-red-500 w-full"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}