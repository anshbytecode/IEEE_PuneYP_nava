import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import StatsBar from '../components/StatsBar';
import UpcomingEvents from '../components/UpcomingEvents';
import HighlightsSection from '../components/HighlightsSection';
import ExploreSection from '../components/ExploreSection';
import CTABanner from '../components/CTABanner';
import YPScoopStrip from '../components/YPScoopStrip';

const scrollRevealVariants: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  }
};

/**
 * HomePage
 * Root page component for the IEEE YP Pune public homepage.
 */
const HomePage = () => (
  <div className="flex-grow flex flex-col font-sans">
    {/* Page content */}
    <main id="main-content" tabIndex={-1} className="flex-grow">
      
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
      >
        <HeroSection />
      </motion.div>

      {/* About Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
      >
        <AboutSection />
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
      >
        <StatsBar />
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
      >
        <UpcomingEvents />
      </motion.div>



      {/* Explore Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
      >
        <ExploreSection />
      </motion.div>

      {/* CTA Banner */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
        variants={scrollRevealVariants}
      >
        <CTABanner />
      </motion.div>
    </main>

    {/* Newsletter strip */}
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={scrollRevealVariants}
    >
      <YPScoopStrip />
    </motion.div>
  </div>
);

export default HomePage;
