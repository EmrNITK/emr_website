import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PanelLeftClose, Users } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { name: "Workshops", path: "/p/workshops" },
  { name: "Events", path: "/p/events" },
  { name: "Projects", path: "/p/projects" },
  { name: "Gallery", path: "/p/gallery" },
  { name: "Sponsor", path: "/p/sponsor" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control mobile menu
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Utility to close menu
  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b bg-black py-2.5 border-white/10",
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-bold text-xl tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#51b749] to-[#13703a]">
                EM
              </span>R<span className="text-white/30 font-normal ml-1.5">/ NITKKR</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.path}>
                  <Link to={link.path}>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent transition-colors hover:bg-white/20 hover:text-white",
                        location.pathname === link.path 
                          ? "text-[#51b749] font-semibold" 
                          : "text-muted-foreground"
                      )}
                    >
                      {link.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* <div className="h-4 w-[1px] bg-border mx-2" /> */}

          <Button asChild variant="default" size="sm" className="rounded-full px-5">
            <Link to="/p/team">
              <Users className="w-4 h-4 mr-2" />
              <span>Team</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/20">
                <PanelLeftClose className="w-6 h-6 text-white/60" />
              </Button>
            </SheetTrigger>
            {/* The [&>button]: CSS selector targets the Shadcn internal close button 
            */}
            <SheetContent 
              side="right" 
              className={cn(
                "w-[300px] bg-black/95 backdrop-blur-xl border-white/10 text-white",
                /* Targeting the Shadcn Close Button:
                   - h-9 w-9: Sets the button container size
                   - [&>svg]:w-5: Increases the "X" icon size
                   - border: Adds the requested border
                */
                "[&>button]:h-8 [&>button]:w-8 [&>button]:flex [&>button]:items-center [&>button]:justify-center",
                "[&>button]:rounded-lg [&>button]:border [&>button]:border-white/30",
                "[&>button]:bg-white/5 [&>button]:text-white/70 [&>button]:mt-2",
                "[&>button]:hover:bg-white/10 [&>button]:hover:text-white [&>button]:transition-all",
                "[&>button>svg]:w-5 [&>button>svg]:h-5" 
              )}
            >
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left text-lg font-bold text-[#51b749]">Navigation</SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={cn(
                      "text-lg font-medium py-3 px-2 transition-all border-b border-white/5 hover:bg-white/5 rounded-md",
                      location.pathname === link.path ? "text-primary" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                    key={8}
                    to={"/p/team"}
                    onClick={closeMenu}
                    className={cn(
                      "text-lg font-medium py-3 px-2 transition-all border-b border-white/5 hover:bg-white/5 rounded-md",
                      location.pathname === "/p/team" ? "text-primary" : "text-muted-foreground hover:text-white"
                    )}
                  >
                    Our Team
                  </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;