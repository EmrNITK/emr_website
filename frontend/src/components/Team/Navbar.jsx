import React, { useState, useEffect } from 'react';

// --- Custom Hook for Window Size (for responsiveness) ---
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return { width: size[0], height: size[1] };
};

// --- The Upgraded Futuristic Navbar Component ---
const Navbar = ({ navItems }) => {
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const [menuOpen, setMenuOpen] = useState(false);

  // Effect to lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLinkClick = () => menuOpen && setMenuOpen(false);

  // --- Styles ---
  const styles = {
    navbar: {
      padding: '15px 30px',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(10, 15, 30, 0.7)',
      backdropFilter: 'blur(12px)',
      fontFamily: "'Orbitron', sans-serif",
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      // The animated border is now handled by pseudo-elements in dynamicStyles
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#00ffff',
      cursor: 'pointer',
      letterSpacing: '2px',
      // The pulsating glow is now an animation
    },
    desktopNav: {
      display: 'flex',
      gap: '40px',
      listStyle: 'none',
      margin: 0,
      padding: 0,
    },
    hamburger: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      width: '2.2rem',
      height: '2.2rem',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      zIndex: 10,
    },
    hamburgerLine: {
      width: '2.2rem',
      height: '3px',
      background: '#00ffff',
      borderRadius: '10px',
      transition: 'all 0.3s linear',
      position: 'relative',
      transformOrigin: '1px',
    },
    mobileMenu: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '50px',
      background: 'rgba(10, 10, 26, 0.9)',
      backdropFilter: 'blur(20px)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 5,
      listStyle: 'none',
      padding: 0,
      margin: 0,
      transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)',
      // Hexagon background is handled by pseudo-elements
    },
  };
  
  // Inject all animations and complex styles
  const dynamicStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

    /* --- Animations --- */
    @keyframes glowPulse {
      0%, 100% { text-shadow: 0 0 8px #00ffff, 0 0 12px #00aaff, 0 0 16px #00aaff; }
      50% { text-shadow: 0 0 12px #00ffff, 0 0 18px #00aaff, 0 0 24px #00aaff; }
    }
    
    @keyframes border-flow {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes scanline {
      0% { top: -10%; }
      100% { top: 110%; }
    }

    @keyframes text-glitch {
      0% { transform: translate(0); opacity: 1; }
      20% { transform: translate(-2px, 2px); opacity: 0.8; }
      40% { transform: translate(2px, -2px); opacity: 0.8; }
      60% { transform: translate(-1px, 1px); opacity: 1; }
      80% { transform: translate(1px, -1px); opacity: 0.9; }
      100% { transform: translate(0); opacity: 1; }
    }
    
    /* --- Component Styles --- */
    .navbar-container {
      position: relative;
      border-bottom: 2px solid transparent;
      background: linear-gradient(90deg, rgba(0,255,255,0.3), rgba(0,170,255,0.3), rgba(0,255,255,0.3));
      background-size: 200% 100%;
      background-clip: padding-box;
      animation: border-flow 4s linear infinite;
      overflow: hidden; /* To contain the scanline */
    }

    .navbar-container::after { /* Scanline effect */
      content: '';
      position: absolute;
      left: 0;
      width: 100%;
      height: 3px;
      background: rgba(0, 255, 255, 0.3);
      box-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
      animation: scanline 6s linear infinite;
      opacity: 0.7;
    }

    .logo-text {
      animation: glowPulse 3s ease-in-out infinite;
    }

    .nav-link {
      color: #e0e0e0;
      text-decoration: none;
      font-size: 1rem;
      padding: 8px 12px;
      position: relative;
      transition: color 0.3s ease;
    }

    .nav-link:hover { color: #fff; }

    /* Glitch effect container */
    .nav-link .glitch-wrapper { position: relative; }

    .nav-link .glitch-wrapper::before {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(10, 15, 30, 0.7); /* Match navbar bg */
      color: #00ffff;
      opacity: 0;
      clip-path: polygon(0 0, 100% 0, 100% 20%, 0 20%);
    }

    .nav-link:hover .glitch-wrapper::before {
      animation: text-glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }
    
    /* Corner brackets */
    .nav-link .corners::before, .nav-link .corners::after {
      content: '';
      position: absolute;
      width: 0px;
      height: 0px;
      border-color: #00ffff;
      border-style: solid;
      transition: all 0.2s linear 0.1s; /* Delay to let glitch happen first */
    }
    .nav-link .corners::before { top: 0; left: 0; border-width: 2px 0 0 2px; }
    .nav-link .corners::after { bottom: 0; right: 0; border-width: 0 2px 2px 0; }
    .nav-link:hover .corners::before, .nav-link:hover .corners::after {
      width: calc(100% + 4px);
      height: calc(100% + 4px);
    }
    
    .mobile-menu-container {
      position: relative;
      overflow: hidden; /* For hex background */
    }
    
    /* Hexagon background for mobile menu */
    .mobile-menu-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image:
        linear-gradient(rgba(10, 10, 26, 0.95), rgba(10, 10, 26, 0.95)),
        url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="115.47"><path d="M50 0L100 28.8675L100 86.6025L50 115.47L0 86.6025L0 28.8675Z" fill="none" stroke="rgba(0, 255, 255, 0.05)" stroke-width="2"/></svg>');
      background-size: auto, 100px 115.47px;
      opacity: 0.5;
      z-index: -1;
    }
    
    .mobile-nav-item {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    
    .mobile-nav-link {
       color: #e0e0e0;
       text-decoration: none;
       font-size: 2rem;
       font-weight: bold;
       transition: color 0.3s ease, text-shadow 0.3s ease;
    }
    .mobile-nav-link:hover {
      color: #00ffff;
      text-shadow: 0 0 10px #00ffff;
    }
  `;

  return (
    <>
      <style>{dynamicStyles}</style>
      <div style={styles.navbar} className="navbar-container">
        <div style={styles.logo} className="logo-text">[ EMR ]</div>
        
        {isMobile ? (
          <button style={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
            <div style={{...styles.hamburgerLine, transform: menuOpen ? 'rotate(45deg)' : 'rotate(0)'}} />
            <div style={{...styles.hamburgerLine, opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'translateX(20px)' : 'translateX(0)'}} />
            <div style={{...styles.hamburgerLine, transform: menuOpen ? 'rotate(-45deg)' : 'rotate(0)'}} />
          </button>
        ) : (
          <ul style={styles.desktopNav}>
            {navItems.map((item) => (
              <li key={item}>
                <a href={`#${item.toLowerCase()}`} className="nav-link">
                  <span className="corners" />
                  <span className="glitch-wrapper" data-text={item}>{item}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isMobile && (
        <div style={{...styles.mobileMenu}} className="mobile-menu-container">
          <ul style={{listStyle:'none', padding:0, margin:0, textAlign: 'center'}}>
            {navItems.map((item, index) => (
              <li key={item} className="mobile-nav-item" style={ menuOpen ? { transitionDelay: `${index * 0.1 + 0.3}s`, opacity: 1, transform: 'translateY(0)' } : {}}>
                <a href={`#${item.toLowerCase()}`} className="mobile-nav-link" onClick={handleLinkClick}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;