import { MapPin, Mail } from 'lucide-react';
import { footerQuickLinks, footerResourceLinks } from '../data/homePageData';
import ypLogoImg from '/pic_ieeeupload/logonew.jpeg';

// Inline SVG icons — lucide-react version in this project does not export Linkedin or Instagram

interface IconProps {
  size?: number;
  color?: string;
}

const LinkedinIcon = ({ size = 16, color = 'white' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = ({ size = 16, color = 'white' }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

interface FooterLink {
  id: string | number;
  href: string;
  label: string;
}

/**
 * Footer
 * Dark navy footer with 4-column grid:
 *   1. Brand (IEEE YP Pune official logo graphic + description + real social icons)
 *   2. Quick Links (YP-specific pages)
 *   3. Resources (YP-specific resources)
 *   4. Contact
 * Bottom bar contains logo graphic + copyright + legal links.
 */
const Footer = () => (
  <footer className="bg-ieee-dark" role="contentinfo">
    {/* ── Main grid ─────────────────────────────────────────── */}
    <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Col 1 — Brand */}
      <div>
        <div className="mb-4">
          <a href="/" aria-label="IEEE YP Pune Homepage">
            <img
              src={ypLogoImg}
              alt="IEEE YP Pune Logo"
              className="h-25 w-auto object-contain hover:scale-105 transition-transform bg-white/95 p-2 rounded-lg"
            />
          </a>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Connecting early-career engineers and technologists across the Pune region since 2016.
        </p>

        {/* Real social icons — LinkedIn + Instagram with custom themed brand hovers */}
        <div className="flex items-center gap-3 mt-5">
          <a
            href="https://www.linkedin.com/company/ieee-yp-pune-section"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="IEEE YP Pune on LinkedIn"
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0077B5] hover:scale-110 hover:shadow-[0_0_12px_rgba(0,119,181,0.5)] transition-all duration-300 border border-white/10"
          >
            <LinkedinIcon size={16} color="white" />
          </a>
          <a
            href="https://www.instagram.com/ieeepune.yp/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="IEEE YP Pune on Instagram"
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-tr hover:from-[#F9CE34] hover:via-[#EE2A7B] hover:to-[#6228D7] hover:scale-110 hover:shadow-[0_0_12px_rgba(238,42,123,0.5)] transition-all duration-300 border border-white/10"
          >
            <InstagramIcon size={16} color="white" />
          </a>
        </div>
      </div>

      {/* Col 2 — Quick Links */}
      <div>
        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
          Quick Links
        </h3>
        <ul className="space-y-2.5">
          {(footerQuickLinks as FooterLink[]).map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className="text-gray-400 text-sm hover:text-white hover-underline-slide transition-colors duration-150 py-0.5 inline-block"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Col 3 — Resources */}
      <div>
        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
          Resources
        </h3>
        <ul className="space-y-2.5">
          {(footerResourceLinks as FooterLink[]).map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className="text-gray-400 text-sm hover:text-white hover-underline-slide transition-colors duration-150 py-0.5 inline-block"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Col 4 — Contact */}
      <div>
        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">
          Contact
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2 text-gray-400 text-sm">
            <MapPin size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
            <span>Pune, Maharashtra, India</span>
          </li>
          <li>
            {/* TODO: Confirm email with committee — using PDF email as placeholder */}
            <a
              href="mailto:yppune@ieee.org"
              className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors duration-150"
              aria-label="Email IEEE YP Pune"
            >
              <Mail size={14} className="shrink-0" aria-hidden="true" />
              yppune@ieee.org
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/company/ieee-yp-pune-section"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors duration-150"
              aria-label="IEEE YP Pune LinkedIn page"
            >
              <LinkedinIcon size={14} color="currentColor" />
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </div>

    {/* ── Bottom bar ────────────────────────────────────────── */}
    <div className="border-t border-white/10 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <p className="text-gray-400 text-xs font-medium">
            © 2026 IEEE YP Pune Section. All rights reserved.
          </p>
        </div>

        {/* Mandatory IEEE legal links */}
        <nav aria-label="Legal and policy links">
          <span className="text-gray-400 text-xs flex items-center gap-2 flex-wrap justify-center font-medium">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-600 select-none">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Use
            </a>
            <span className="text-gray-600 select-none">|</span>
            <a href="#" className="hover:text-white transition-colors">
              Accessibility
            </a>
          </span>
        </nav>
      </div>
    </div>
  </footer>
);

export default Footer;
