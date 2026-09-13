import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Coins, Award, GraduationCap, Sparkles, ArrowRight, CheckCircle2, Search, Filter, Calendar } from 'lucide-react';
import { grantsAndAwards as fallbackGrants } from '../data/homePageData';
import { grantService, GrantItem } from '../services/grantService';

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Coins': return <Coins className="w-5 h-5 text-emerald-600" />;
    case 'Trophy': return <Trophy className="w-5 h-5 text-amber-600" />;
    case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-ieee-blue" />;
    case 'Award': return <Award className="w-5 h-5 text-purple-600" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-ieee-teal" />;
    default: return <Award className="w-5 h-5 text-ieee-blue" />;
  }
};

export const PublicGrants: React.FC = () => {
  const [grants, setGrants] = useState<GrantItem[]>(fallbackGrants);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrant, setSelectedGrant] = useState<GrantItem | null>(null);

  useEffect(() => {
    const fetchApiGrants = async () => {
      try {
        const res = await grantService.getGrants();
        if (res.success && res.grants && res.grants.length > 0) {
          setGrants(res.grants);
        }
      } catch (err) {
        console.warn('Backend API /api/grants not available or empty, using default list:', err);
      }
    };

    fetchApiGrants();
  }, []);

  const categories = ['All', 'Grants & Funding', 'Awards & Recognition', 'Sponsorships'];

  // Filter items based on category and search text
  const filteredGrants = grants.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative bg-gray-50 text-gray-800 pb-20 min-h-screen">
      
      {/* ────────────────────────────────────────────────────────────
          1. HERO HEADER (Matches PublicAbout / Activities style)
          ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-gray-200 overflow-hidden">
        {/* Dot pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="grants-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="var(--color-ieee-primary)" fillOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grants-dots)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-ieee-light text-ieee-blue text-xs font-bold uppercase tracking-wider mb-4 border border-ieee-blue/20">
            <Trophy size={14} />
            <span>Honors & Funding Initiatives</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-ieee-dark leading-tight tracking-tight font-display">
            IEEE Pune Section{' '}
            <span className="bg-gradient-to-r from-ieee-blue to-ieee-teal bg-clip-text text-transparent">
              Grants, Awards & Sponsorships
            </span>
          </h1>

          <p className="text-gray-600 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Recognizing regional excellence and facilitating international research grants, humanitarian funding, and engineering innovation sponsorships.
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. SUMMARY STATS HIGHLIGHTS
          ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-3xl font-extrabold text-ieee-blue font-display">$7,500+ USD</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              Global IEEE Grants Secured
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-3xl font-extrabold text-emerald-600 font-display">#1 Region 10</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              Exemplary YP Group Award
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="text-3xl font-extrabold text-purple-600 font-display">15+ Projects</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">
              Student Innovation Sponsorships
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. SEARCH & CATEGORY FILTER BAR
          ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-ieee-blue text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search grants or awards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:border-ieee-blue"
            />
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. GRANTS & AWARDS CARDS GRID
          ──────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        {filteredGrants.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No Grants or Awards Found</h3>
            <p className="text-xs text-gray-500 mt-1">Try adjusting your search query or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrants.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-ieee-light flex items-center justify-center">
                      {getIconComponent(item.icon)}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${item.badgeColor}`}>
                      {item.status}
                    </span>
                  </div>

                  {/* Organization & Year */}
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                    <Calendar size={13} className="text-gray-400" />
                    <span>{item.organization}</span>
                    <span>•</span>
                    <span>{item.year}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-ieee-dark mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Impact pill */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 mb-4">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span className="text-xs font-medium text-emerald-800">
                      {item.impact}
                    </span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Grant / Award Value
                    </span>
                    <span className="text-sm font-extrabold text-ieee-dark font-display">
                      {item.amount}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedGrant(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-ieee-blue hover:text-ieee-dark cursor-pointer"
                  >
                    <span>View Info</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ────────────────────────────────────────────────────────────
          5. DETAILS MODAL POPUP
          ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedGrant && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 border border-gray-200 shadow-xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedGrant.badgeColor}`}>
                  {selectedGrant.category}
                </span>
                <button
                  onClick={() => setSelectedGrant(null)}
                  className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <h3 className="text-xl font-bold text-ieee-dark mb-2">
                {selectedGrant.title}
              </h3>

              <div className="text-xs font-bold text-ieee-blue mb-4">
                {selectedGrant.organization} ({selectedGrant.year})
              </div>

              <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-5">
                {selectedGrant.description}
              </p>

              <div className="space-y-2.5 p-4 rounded-xl bg-gray-50 border border-gray-200 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Grant Value / Trophy:</span>
                  <span className="font-bold text-ieee-dark">{selectedGrant.amount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Key Outcome:</span>
                  <span className="font-bold text-emerald-700">{selectedGrant.impact}</span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedGrant(null)}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-ieee-blue text-white hover:bg-ieee-dark transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
