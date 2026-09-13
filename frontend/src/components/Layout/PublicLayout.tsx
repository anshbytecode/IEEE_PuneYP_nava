import React from 'react';
import AnnouncementBanner from '../AnnouncementBanner';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { BackgroundEffects } from '../Common/BackgroundEffects';
import { motion } from 'framer-motion';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900 relative">
      {/* ── MAIN WEBSITE LAYOUT ────────────────────────────────────── */}
      <BackgroundEffects />
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        <AnnouncementBanner />
        <Navbar />
        <motion.main 
          id="main-content" 
          className="flex-grow flex flex-col"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </div>
  );
};
