import React, { useState, useEffect } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link as HeroLink,
} from "@heroui/react";
import { Link, useLocation } from "react-router-dom";
import { Cpu, Menu, X, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Workshops", path: "/p/workshops" },
  { name: "Events", path: "/p/events" },
  { name: "Projects", path: "/p/projects" },
  { name: "Gallery", path: "/p/gallery" },
  { name: "Sponsor", path: "/p/sponsor" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <>
      <Navbar
        maxWidth="xl"
        isBordered
        className="fixed top-0 bg-black/70 backdrop-blur-xl border-b border-white/5 z-50 h-20"
        classNames={{
          wrapper: "px-6 lg:px-8",
          item: "data-[active=true]:text-cyan-400",
        }}
      >
        {/* --- Mobile: Toggle Button (Left) --- */}
        <NavbarContent className="sm:hidden" justify="start">
          <Button
            isIconOnly
            variant="light"
            className="text-zinc-400 hover:text-white"
            onPress={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </Button>
        </NavbarContent>

        {/* --- Brand Logo --- */}
        <NavbarContent justify="center" className="sm:justify-start">
          <NavbarBrand as={Link} to="/">
            <div className="flex items-center gap-2 group">
              {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <Cpu className="text-white" size={18} />
              </div> */}
              <p className="font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                EMR<span className="text-zinc-500 font-normal text-sm ml-1 hidden sm:inline-block">/ NITKKR</span>
              </p>
            </div>
          </NavbarBrand>
        </NavbarContent>

        {/* --- Desktop Navigation (Centered) --- */}
        <NavbarContent className="hidden sm:flex gap-8" justify="center">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavbarItem key={item.name} isActive={isActive}>
                <HeroLink
                  as={Link}
                  to={item.path}
                  className={`relative text-sm font-medium transition-all duration-300 ${
                    isActive ? "text-cyan-400" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {item.name}
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 rounded-full shadow-[0_0_8px_2px_rgba(6,182,212,0.8)]"
                    />
                  )}
                </HeroLink>
              </NavbarItem>
            );
          })}
        </NavbarContent>

        {/* --- Desktop Action (Right) --- */}
        <NavbarContent justify="end" className="hidden sm:flex">
          <NavbarItem>
            <Button
              as={Link}
              to="/p/team"
              className="bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-cyan-500/50 hover:bg-zinc-800 transition-all font-medium rounded-full px-6"
              size="sm"
            >
              Team
            </Button>
          </NavbarItem>
        </NavbarContent>
        
        {/* Placeholder for alignment on mobile right side */}
        <NavbarContent className="sm:hidden" justify="end">
            <div className="w-8" /> 
        </NavbarContent>
      </Navbar>

      {/* --- MOBILE DRAWER (Slide Over) --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] sm:hidden"
            />

            {/* Sidebar Container */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm z-[70] bg-zinc-950 border-r border-white/10 flex flex-col sm:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    {/* <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                         <Zap size={16} className="text-cyan-400 fill-cyan-400" />
                    </div> */}
                    <span className="text-lg font-bold text-white tracking-tight">Navigation</span>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  className="text-zinc-500 hover:text-white"
                  onPress={() => setIsMenuOpen(false)}
                >
                  <X size={24} />
                </Button>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto p-6 space-y-2">
                {navLinks.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                        >
                            <Link
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                                    isActive 
                                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" 
                                    : "bg-zinc-900/40 border-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                }`}
                            >
                                <span className="font-medium">{item.name}</span>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        </motion.div>
                    );
                })}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-zinc-900/50">
                {/* <Button
                  as={Link}
                  to="/p/sponsors"
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold shadow-lg shadow-cyan-900/20"
                  size="lg"
                  onPress={() => setIsMenuOpen(false)}
                >
                  Partner With Us
                </Button> */}
                <div className="mt-6 flex justify-center gap-4 text-zinc-600 text-xs font-mono">
                    <span>© {new Date().getFullYear()} EMR CLUB</span>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;