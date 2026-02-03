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

// Color Constants
const COLORS = {
  primary: '#13703a',    // Dark Green
  secondary: '#38984c',  // Medium Green
  accent: '#51b749',     // Light Green
  white: '#ffffff',
  black: '#000000',
  darkBg: '#0a0a0a',
  cardBg: '#111111',
};

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
        className="fixed top-0 bg-black/70 backdrop-blur-xl border-b border-white/5 z-50 h-16"
        classNames={{
          wrapper: "px-6 lg:px-8",
          item: "data-[active=true]:text-[#51b749]",
        }}
      >
        {/* --- Mobile: Toggle Button (Left) --- */}
        <NavbarContent className="sm:hidden" justify="start">
          <Button
            isIconOnly
            variant="light"
            className="text-white/60 hover:text-white"
            onPress={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </Button>
        </NavbarContent>

        {/* --- Brand Logo --- */}
        <NavbarContent justify="center" className="sm:justify-start">
          <NavbarBrand as={Link} to="/">
            <div className="flex items-center gap-2 group">
              <p className="font-bold text-xl tracking-tight text-white group-hover:text-[#51b749] transition-colors">
                EMR<span className="text-white/40 font-normal text-sm ml-1 hidden sm:inline-block">/ NITKKR</span>
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
                    isActive ? "text-[#51b749]" : "text-white/60 hover:text-white"
                  }`}
                >
                  {item.name}
                  {/* Active Indicator Dot */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-dot"
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#51b749] rounded-full shadow-[0_0_8px_2px_rgba(81,183,73,0.8)]"
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
              className="bg-[#111111] border border-white/5 text-white/80 hover:text-white hover:border-[#51b749]/50 hover:bg-[#1a1a1a] transition-all font-medium rounded-full px-6"
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
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm z-[70] bg-[#111111] border-r border-white/5 flex flex-col sm:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#51b749]/10 flex items-center justify-center border border-[#51b749]/20">
                         <Zap size={16} className="text-[#51b749] fill-[#51b749]" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">Navigation</span>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  className="text-white/40 hover:text-white"
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
                                    ? "bg-[#51b749]/10 border-[#51b749]/30 text-[#51b749]" 
                                    : "bg-[#111111] border-transparent text-white/60 hover:bg-[#1a1a1a] hover:text-white"
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
              <div className="p-6 border-t border-white/5 bg-black/50">
                <Button
                  as={Link}
                  to="/p/team"
                  className="w-full bg-gradient-to-r from-[#51b749] to-[#38984c] text-white font-bold shadow-lg shadow-[#51b749]/20"
                  size="lg"
                  onPress={() => setIsMenuOpen(false)}
                >
                  View Team
                </Button>
                <div className="mt-6 flex justify-center gap-4 text-white/40 text-xs font-mono">
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