import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { navLinks, utilityLinks } from '../data/homePageData';
import { useAuth } from '../context/AuthContext';

// Resolved asset imports
import ypLogoImg from '/pic_ieeeupload/logonew_clean.png';
import logoImg    from '../assets/Logo.png';
import puneSectionFlagImg from '../assets/Title.png';

interface NavLinkItem {
  id: string;
  label: string;
  emoji?: string;
  href: string;
  subLinks?: { id: string; label: string; href: string }[];
}

/**
 * Navbar
 * Three-layer navigation header (NOT sticky — scrolls with page per UX spec).
 *
 * Layer 1 — Utility bar: light gray bg, bold text, ieee.org / IEEEXplore / Standards / Spectrum / More Sites
 * Layer 2 — Brand bar:   white bg with subtle dot-network pattern;
 *                        Left: IEEE YP Logo + IEEE Pune Section flag logo
 *                        Center: Yellow Pune skyline illustration
 *                        Right: IEEE diamond logo + Search icon
 * Layer 3 — Primary nav: ieee-blue bg, NO icons, bold ALL-CAPS centered text
 *
 * Mobile (< md): layers 1 & 2 always visible; layer 3 collapses into hamburger drawer.
 */
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isIEEEAdmin, logout } = useAuth();

  /** Returns true if this nav link is the active page */
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };


  return (
    <header role="banner">

      {/* ── Layer 1: Utility bar (Right aligned) ───────────────────────── */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl 2xl:max-w-[1500px] mx-auto h-8 flex items-center justify-end px-4 md:px-8">
          <nav
            className="flex items-center flex-wrap text-gray-600 text-xs font-bold gap-0"
            aria-label="Global IEEE sites"
          >
            {utilityLinks.map((link, i) => (
              <span key={link.id} className="flex items-center">
                {i > 0 && (
                  <span className="mx-2 text-gray-300 select-none font-normal">|</span>
                )}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ieee-blue hover-underline-slide transition-colors duration-150 py-1"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Layer 2: Brand bar ────────────────────────────────────────── */}
      <div
        className="bg-white border-b border-gray-200 relative overflow-hidden"
        style={{ minHeight: '85px' }}
      >
        {/* Dot-network SVG pattern (decorative) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="var(--color-ieee-primary)" fillOpacity="0.12" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          {[
            [0,20,80,40],[80,40,160,15],[160,15,240,55],[240,55,320,20],
            [320,20,400,50],[400,50,480,10],[480,10,560,45],[560,45,640,20],
            [640,20,720,50],[720,50,800,15],[800,15,900,40],[900,40,1000,20],
            [1000,20,1100,55],[1100,55,1200,10],[1200,10,1300,40],[1300,40,1400,20],
          ].map(([x1,y1,x2,y2], i) => (
            <line
              key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--color-ieee-primary)" strokeOpacity="0.08" strokeWidth="1"
            />
          ))}
        </svg>
        {/* Content row */}
        <div className="relative max-w-7xl 2xl:max-w-[1400px] mx-auto h-full flex items-center justify-between px-4 md:px-8 py-2 md:py-2.5 gap-4">

          {/* Left: IEEE YP Logo | IEEE Pune Section flag logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href="/"
              aria-label="IEEE YP Pune — go to homepage"
              className="flex items-center"
            >
              <img
                src={ypLogoImg}
                alt="IEEE YP Pune 10 Years"
                className="h-11 sm:h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </a>

            <div
              className="h-8 md:h-10 w-px bg-gray-200"
              aria-hidden="true"
            />

            <a
              href="https://ieeepunesection.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="IEEE Pune Section"
              className="flex items-center"
            >
              <img
                src={puneSectionFlagImg}
                alt="IEEE Pune Section"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </a>
          </div>

          {/* Center: Yellow Pune Skyline only */}
          <div className="hidden lg:flex flex-1 justify-center items-center px-4 overflow-hidden">
            <img
              src="/pic_ieeeupload/punevibe.png"
              alt="Pune city skyline and landmarks"
              className="h-20 sm:h-24 md:h-26 max-w-full w-auto object-contain transition-all duration-300 hover:scale-[1.02]"
            />
          </div>

          {/* Right: IEEE Logo + Search + Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5 shrink-0">
            <a
              href="https://www.ieee.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="IEEE global website"
              className="flex items-center"
            >
              <img
                src={logoImg}
                alt="IEEE"
                className="h-7 sm:h-8 md:h-9 w-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </a>

            <button
              aria-label="Search site"
              className="text-gray-500 hover:text-ieee-blue hover:bg-ieee-light hover:scale-105 transition-all duration-200 p-2 rounded-full cursor-pointer"
            >
              <Search size={20} aria-hidden="true" />
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden text-gray-600 hover:text-ieee-blue transition-colors duration-150 p-1 rounded"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? (
                <X size={24} aria-hidden="true" />
              ) : (
                <Menu size={24} aria-hidden="true" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ── Layer 3: Primary nav — desktop ───────────────────────────── */}
      <nav
        className="bg-gradient-to-r from-ieee-blue to-ieee-dark hidden md:block shadow-md"
        aria-label="Main site navigation"
      >
        <div className="max-w-7xl mx-auto flex items-stretch justify-between px-4 md:px-8">
          <div className="flex items-stretch justify-center flex-grow">
            {(navLinks as NavLinkItem[]).map((link) => (
              <div key={link.id} className="relative group flex items-center">
                <a
                  href={link.href}
                  className={`flex items-center justify-center text-white text-sm font-bold px-5 py-4 transition-all duration-200 whitespace-nowrap tracking-wide uppercase hover:text-ieee-teal relative gap-1.5 ${
                    isActive(link.href)
                      ? 'text-ieee-teal font-extrabold'
                      : ''
                  }`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  <span>{link.label}</span>
                  {link.subLinks && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />}
                  <span className={`absolute bottom-0 left-0 right-0 h-1 transition-all duration-300 rounded-t-full ${
                    isActive(link.href)
                      ? 'bg-ieee-teal shadow-[0_0_8px_rgba(0,178,169,0.8)] scale-x-100'
                      : 'bg-white/40 scale-x-0 group-hover:scale-x-100'
                  }`} />
                </a>

                {/* Sublinks Dropdown */}
                {link.subLinks && (
                  <div className="absolute top-full left-0 hidden group-hover:block w-56 bg-white border border-gray-100 rounded-b-xl shadow-xl z-50 py-2">
                    {link.subLinks.map((sub) => (
                      <a
                        key={sub.id}
                        href={sub.href}
                        className="block px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-ieee-light hover:text-ieee-blue transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <>
                {isIEEEAdmin && (
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-white bg-ieee-dark hover:bg-white hover:text-ieee-dark border border-white/20 hover:scale-105 transition-all duration-200 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap cursor-pointer shadow-sm"
                  >
                    Dashboard
                  </button>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-white/85 hover:text-white hover:bg-red-500 hover:scale-105 border border-white/20 transition-all duration-200 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap cursor-pointer shadow-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>


      {/* ── Mobile nav drawer ─────────────────────────────────────────── */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden bg-ieee-blue border-t border-ieee-dark"
          aria-label="Mobile site navigation"
        >
          <div className="flex flex-col divide-y divide-white/10">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={`text-white text-sm font-bold uppercase tracking-wide px-6 py-3.5 transition-colors duration-150 flex items-center ${
                  isActive(link.href)
                    ? 'bg-ieee-dark'
                    : 'hover:underline hover:decoration-2 underline-offset-4'
                }`}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}

            {/* Mobile Auth Buttons */}
            {isAuthenticated && (
              <>
                {isIEEEAdmin && (
                  <button
                    onClick={() => { setMobileOpen(false); navigate('/dashboard'); }}
                    className="text-white text-sm font-bold uppercase tracking-wide px-6 py-3.5 hover:bg-ieee-dark transition-colors duration-150 text-left w-full cursor-pointer"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => { setMobileOpen(false); logout(); navigate('/'); }}
                  className="text-red-300 text-sm font-bold uppercase tracking-wide px-6 py-3.5 hover:bg-ieee-dark transition-colors duration-150 text-left w-full cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      )}

    </header>
  );
};

export default Navbar;
