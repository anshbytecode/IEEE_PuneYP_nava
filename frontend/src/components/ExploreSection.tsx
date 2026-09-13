import { motion } from 'framer-motion';
import { GraduationCap, Network, Briefcase, Zap, BookOpen, Users, Award } from 'lucide-react';
import { exploreCards } from '../data/homePageData';

const ICON_MAP = {
  GraduationCap,
  Network,
  Briefcase,
  Zap,
  BookOpen,
  Users,
  Award,
};

interface ExploreCard {
  id: string | number;
  href: string;
  icon: keyof typeof ICON_MAP;
  title: string;
  description: string;
}

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ExploreSection = () => (
  <section
    className="py-16 px-4 bg-white w-full relative"
    aria-labelledby="explore-heading"
  >
    <div className="max-w-7xl mx-auto">
      {/* ── Centred header ──────────────────────────────────────── */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 mb-3">
          <span>Flagship Initiatives</span>
        </div>

        <h2
          id="explore-heading"
          className="text-3xl lg:text-4xl font-extrabold text-ieee-blue font-display"
        >
          Explore YP Programmes
        </h2>
        <p className="text-gray-600 text-sm md:text-base mt-2 leading-relaxed font-sans max-w-xl mx-auto">
          Discover the flagship initiatives that drive IEEE YP Pune's mission of connecting and empowering early-career engineers.
        </p>
      </div>

      {/* ── 4-column feature card grid with Gold border boxes ──────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(exploreCards as ExploreCard[]).map((card, i) => {
          const Icon = ICON_MAP[card.icon] || GraduationCap;
          return (
            <motion.a
              key={card.id}
              href={card.href}
              className="bg-white rounded-2xl p-6 border border-amber-200/90 hover:border-amber-500 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer block relative overflow-hidden group"
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              aria-label={card.title}
            >
              {/* Gold Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Icon box wrapper */}
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 text-amber-600">
                <Icon size={20} aria-hidden="true" />
              </div>

              {/* Card text */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-ieee-blue transition-colors duration-250 font-display">
                {card.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-sans">
                {card.description}
              </p>

              {/* Action indicator at bottom */}
              <div className="mt-5 flex items-center gap-1.5 text-[11px] font-bold text-amber-700 tracking-wider uppercase group-hover:text-ieee-blue transition-colors duration-200">
                <span>Explore Programme</span>
                <span className="transform transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  </section>
);

export default ExploreSection;
