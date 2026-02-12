import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight, Users, Zap } from "lucide-react";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useMotionTemplate, 
  useMotionValue, 
  useMotionValueEvent
} from "framer-motion";

// --- Configuration ---
const navLinks = [
  { name: "Workshops", path: "/p/workshops" },
  { name: "Events", path: "/p/events" },
  { name: "Projects", path: "/p/projects" },
  { name: "Gallery", path: "/p/gallery" },
  { name: "Sponsor", path: "/p/sponsor" },
];

const COLORS = {
  accent: "#51b749",
  accentDim: "rgba(81, 183, 73, 0.1)",
};

// --- Sub-Components ---

const Logo = () => (
  <Link to="/" className="flex items-center gap-2 group relative z-50">
    <p className="font-bold text-xl tracking-tight text-white transition-colors">
      EMR<span className="text-white/40 font-normal text-sm ml-1 hidden sm:inline-block group-hover:text-white/60 transition-colors">/ NITKKR</span>
    </p>
  </Link>
);

const DesktopNavLink = ({ item, isActive, hoveredPath, onHover }) => {
  // Logic: The item is "highlighted" if it's strictly the one being hovered,
  // OR if nothing is hovered and this is the active page.
  const isHighlighted = hoveredPath === item.path || (hoveredPath === null && isActive);

  return (
    <Link
      to={item.path}
      onMouseEnter={() => onHover(item.path)}
      onMouseLeave={() => onHover(null)}
      className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
        isHighlighted ? "text-white" : "text-zinc-500 hover:text-white"
      }`}
    >
      {/* Magnetic Background Pill */}
      {isHighlighted && (
        <motion.div
          layoutId="nav-pill"
          className={`absolute inset-0 rounded-full ${
            isActive && hoveredPath === null
              ? "bg-[#51b749]/15 border border-[#51b749]/20" // Active Page Style
              : "bg-white/10 border border-white/5"           // Hover Style
          }`}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      )}

      {/* Text Content */}
      <span className="relative z-10 flex items-center gap-2">
        {item.name}
        
        {/* The Glow Dot - Only shows for the active page, but fades if hovering others */}
        {isActive && (
           <motion.span
            animate={{ 
                opacity: hoveredPath === null || hoveredPath === item.path ? 1 : 0.3,
                scale: hoveredPath === null || hoveredPath === item.path ? 1 : 0.8
            }}
            className="block w-1.5 h-1.5 rounded-full bg-[#51b749] shadow-[0_0_10px_#51b749]"
          />
        )}
      </span>
    </Link>
  );
};

// --- Mobile Menu Item ---
const MobileNavLink = ({ item, index, closeMenu }) => {
    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
        >
            <Link
                to={item.path}
                onClick={closeMenu}
                className="group flex items-center justify-between py-4 border-b border-white/5 hover:border-white/10 transition-colors"
            >
                <span className="text-2xl font-bold text-white/70 group-hover:text-white transition-colors tracking-tight">
                    {item.name}
                </span>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white/20 group-hover:bg-[#51b749] group-hover:border-[#51b749] group-hover:text-black group-hover:scale-110 group-hover:-rotate-45 transition-all duration-300">
                    <ArrowUpRight size={20} />
                </div>
            </Link>
        </motion.div>
    )
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null); // Track which link is hovered
  
  const location = useLocation();
  const { scrollY } = useScroll();

  // Mouse Spotlight Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // Handle Scroll Effect efficiently
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  // Close menu on route change & Lock scroll
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
  }, [isMenuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[1000] flex justify-center pt-4 px-4"
      >
        <motion.div
          className={`relative group rounded-full border transition-all duration-500 w-full max-w-6xl overflow-hidden`}
          onMouseMove={handleMouseMove}
          style={{
             backgroundColor: scrolled || isMenuOpen ? "rgba(10, 10, 10, 0.85)" : "transparent",
             backdropFilter: scrolled || isMenuOpen ? "blur(20px)" : "blur(0px)",
             borderColor: scrolled || isMenuOpen ? "rgba(255, 255, 255, 0.08)" : "transparent",
             boxShadow: scrolled ? "0 10px 40px -10px rgba(0,0,0,0.5)" : "none",
          }}
        >
            {/* Spotlight Overlay */}
            <motion.div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                        500px circle at ${mouseX}px ${mouseY}px,
                        rgba(81, 183, 73, 0.08),
                        transparent 80%
                        )
                    `,
                }}
            />

          <nav className="relative flex items-center justify-between pl-6 pr-2 py-2">
            {/* Left: Logo */}
            <Logo />

            {/* Center: Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              <div 
                className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5"
                onMouseLeave={() => setHoveredPath(null)} // Reset when leaving container
              >
                {navLinks.map((item) => (
                    <DesktopNavLink
                        key={item.name}
                        item={item}
                        isActive={location.pathname === item.path}
                        hoveredPath={hoveredPath}
                        onHover={setHoveredPath}
                    />
                ))}
              </div>
            </div>

            {/* Right: Actions & Toggle */}
            <div className="flex items-center gap-3">
              <Link to="/p/team">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden sm:flex items-center gap-2 bg-white text-black text-sm font-bold rounded-full px-5 py-2.5 hover:bg-[#e0e0e0] transition-colors"
                >
                    <Users size={16} />
                    <span>Team</span>
                </motion.button>
              </Link>

              {/* Mobile Toggle */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.9 }}
                className={`md:hidden relative w-10 h-10 rounded-full flex items-center justify-center border transition-colors z-50
                    ${isMenuOpen ? "bg-white text-black border-white" : "bg-white/5 text-white border-white/5 hover:bg-white/10"}`}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </nav>
        </motion.div>
      </motion.header>

      {/* --- Mobile Fullscreen Menu --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[900] bg-[#050505] flex flex-col pt-32 px-6 overflow-hidden"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-[20%] -right-[20%] w-[500px] h-[500px] bg-[#51b749]/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-[0%] left-[0%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px]" />
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{ 
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', 
                    backgroundSize: '40px 40px' 
                }}
              />
            </div>

            {/* Links Container */}
            <div className="flex flex-col relative z-50 h-full">
              {navLinks.map((item, index) => (
                 <MobileNavLink key={item.name} item={item} index={index} closeMenu={() => setIsMenuOpen(false)} />
              ))}
              
               <MobileNavLink 
                item={{ name: "Our Team", path: "/p/team" }} 
                index={navLinks.length} 
                closeMenu={() => setIsMenuOpen(false)} 
               />

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-auto pb-10 flex flex-col gap-2 items-center text-center"
              >
                <p className="text-white font-medium">EMR, NIT Kurukshetra</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;