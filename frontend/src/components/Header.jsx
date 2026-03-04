import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { PanelLeftClose, User, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from '../context/AuthContext';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Workshops", path: "/p/workshops" },
  { name: "Events", path: "/p/events" },
  { name: "Projects", path: "/p/projects" },
  { name: "Gallery", path: "/p/gallery" },
  { name: "Sponsor", path: "/p/sponsor" },
  { name: "Team", path: "/p/team" },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading, logout } = useAuth();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Custom Avatar Component using a Div
  const UserAvatar = ({ user, className }) => {
    const initials = user?.name?.charAt(0).toUpperCase() || "U";
    return (
      <div className={cn("flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#51b749] to-[#13703a] border border-white/20", className)}>
        {user?.profilePhoto ? (
          <img src={user.profilePhoto} alt={user.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-white font-medium text-sm">{initials}</span>
        )}
      </div>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled 
          ? "bg-black/80 backdrop-blur-md border-white/10 py-2" 
          : "bg-black border-transparent py-4"
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
        <div className="hidden md:flex items-center gap-8">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.path}>
                  <Link to={link.path}>
                    <NavigationMenuLink
                      className={cn(
                        "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-white focus:outline-none disabled:pointer-events-none",
                        location.pathname === link.path
                          ? "text-[#51b749] bg-white/5"
                          : "text-white/60 hover:bg-white/5"
                      )}
                    >
                      {link.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4 pl-4 border-l border-white/10">
            {isLoading ? (
              /* Skeleton Loader */
              <div className="flex items-center gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-white/10" />
                <div className="h-4 w-20 rounded bg-white/10" />
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center gap-3 px-2 hover:bg-white/5 rounded-full">
                    <UserAvatar user={user} className="h-8 w-8" />
                    <span className="text-sm font-medium text-white/80 hidden lg:block">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-white/50">{user.email || 'Member'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="focus:bg-white/5 cursor-pointer">
                    <Link className="flex gap-2 hover:text-white" to={'/a/profile'}><User className="mr-2 h-4 w-4" /> Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="focus:bg-red-500/10 text-red-400 focus:text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="bg-[#51b749] hover:bg-[#43a03c] text-white rounded-full px-6 h-8">
                <Link to="/a/login">Login</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
           {!isLoading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative flex items-center gap-3 px-2 hover:bg-white/5 rounded-full">
                    <UserAvatar user={user} className="h-8 w-8" />
                    <span className="text-sm font-medium text-white/80 hidden lg:block">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-950 border-white/10 text-white">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-white/50">{user.email || 'Member'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem className="focus:bg-white/5 cursor-pointer">
                    <Link className="flex gap-2" to={'/a/profile'}><User className="mr-2 h-4 w-4" /> Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="focus:bg-red-500/10 text-red-400 focus:text-red-400 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
                <PanelLeftClose className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-zinc-950 border-white/10 text-white p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-6 border-b border-white/5">
                  <SheetTitle className="text-left text-[#51b749]">Menu</SheetTitle>
                </SheetHeader>
                
                <div className="flex flex-col p-4 gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium py-3 px-4 transition-all rounded-lg",
                        location.pathname === link.path 
                          ? "bg-[#51b749]/10 text-[#51b749]" 
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-auto p-6 border-t border-white/5">
                  {isLoading ? (
                    <Loader2 className="animate-spin text-white/20 h-6 w-6" />
                  ) : user ? (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} className="h-10 w-10" />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">{user.name}</span>
                          <span className="text-xs text-white/40">{user.email}</span>
                        </div>
                      </div>
                      <Button onClick={logout} variant="outline" className="w-full border-white/10 bg-red-500 hover:bg-red-500/10 hover:text-red-400">
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full bg-[#51b749]">
                      <Link to="/a/login" onClick={() => setIsOpen(false)}>Login</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;