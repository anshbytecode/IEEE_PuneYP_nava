import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Award, GraduationCap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const decadeMilestones = [
  {
    id: 'dm-1',
    year: '2016',
    title: 'Charter & Inception',
    desc: 'Formed under IEEE Pune Section to bridge the academic-to-industry transition for emerging tech graduates.',
    icon: Calendar,
    color: 'from-blue-600 to-ieee-blue'
  },
  {
    id: 'dm-2',
    year: '2018–2021',
    title: 'Regional Expansion',
    desc: 'Expanded outreach across 25+ student branches and organized international webinars with 3,000+ attendees.',
    icon: GraduationCap,
    color: 'from-teal-600 to-ieee-teal'
  },
  {
    id: 'dm-3',
    year: '2024',
    title: 'Global IEEE HAC Grant',
    desc: 'Secured USD $5,000 for CODEBhoomi rural digital literacy labs and won R10 Exemplary AG recognition.',
    icon: Award,
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'dm-4',
    year: '2026',
    title: 'Decennial Milestone & 100+ Activities',
    desc: 'Celebrating 10 years of continuous activity with 100+ planned events, research fellowships, and EU-REKA innovation sponsorships.',
    icon: Sparkles,
    color: 'from-purple-600 to-indigo-600'
  }
];

export const AboutDecadeSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white via-gray-50 to-white w-full border-t border-gray-200 relative overflow-hidden">
      
      {/* Decorative background grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-30 select-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="decade-grid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#00629B" fillOpacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#decade-grid)" />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs mb-3">
            <Sparkles size={14} className="text-amber-600" />
            <span>Celebrating 10 Years of Excellence (2016 – 2026)</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold text-ieee-dark font-display tracking-tight">
            About the{' '}
            <span className="bg-gradient-to-r from-ieee-blue via-ieee-secondary to-ieee-teal bg-clip-text text-transparent">
              Decade of Impact
            </span>
          </h2>

          <p className="text-gray-600 text-sm md:text-base mt-4 leading-relaxed">
            From our founding in 2016 to completing 10 years in 2026, IEEE Pune Section Young Professionals has grown into an international platform supporting 500+ active engineers and 25+ Student Branches.
          </p>
        </div>

        {/* 4-card Milestone Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {decadeMilestones.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-xs hover:shadow-xl hover:border-ieee-blue/40 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                initial={reduced ? {} : { opacity: 0, y: 20 }}
                whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                {/* Top color bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.color}`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                      {item.year}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-ieee-light text-ieee-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-ieee-blue transition-colors font-display mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-bold text-ieee-blue">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Key Milestone</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-[#002845] via-[#003952] to-[#004e6e] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-xs font-bold uppercase tracking-widest text-ieee-teal font-mono">
              JOIN OUR DECENNIAL CELEBRATIONS
            </div>
            <h4 className="text-2xl font-bold text-white font-display">
              Be Part of 100+ Planned Activities in 2026
            </h4>
            <p className="text-xs md:text-sm text-gray-300 max-w-xl">
              Connect with fellow technologists, access international IEEE funding, and build a lasting global career network.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMYP060"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-ieee-teal to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-[#002845] font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Join IEEE YP</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

      </div>

    </section>
  );
};

export default AboutDecadeSection;
