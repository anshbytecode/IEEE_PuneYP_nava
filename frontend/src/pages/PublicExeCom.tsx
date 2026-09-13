import React, { useState, useEffect } from 'react';
import { teamService, TeamMemberItem } from '../services/teamService';
import { motion } from 'framer-motion';
import { 
  Users, 
  Mail, 
  Search,
  Building2,
  Phone
} from 'lucide-react';

const LinkedinIcon: React.FC<{ size?: number; color?: string }> = ({ size = 14, color = 'currentColor' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    aria-hidden="true"
  >
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PublicExeCom: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const res = await teamService.getTeam();
        if (res.success && res.teamMembers) {
          const sorted = res.teamMembers.sort((a, b) => a.orderIndex - b.orderIndex);
          setTeamMembers(sorted);
        }
      } catch (err) {
        console.error('Failed to load team members', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  // Helper to categorize team members based on their position/designation
  const getMemberCategory = (position: string): string => {
    const pos = position.toLowerCase();
    if (pos.includes('chair') || pos.includes('secretary') || pos.includes('treasurer') || pos.includes('officer')) {
      return 'Core Officers';
    }
    if (pos.includes('tech') || pos.includes('workshop') || pos.includes('research') || pos.includes('project') || pos.includes('activity')) {
      return 'Technical & Activities';
    }
    if (pos.includes('membership') || pos.includes('outreach') || pos.includes('student') || pos.includes('relation') || pos.includes('industry') || pos.includes('mentor') || pos.includes('collaboration')) {
      return 'Outreach & Membership';
    }
    if (pos.includes('web') || pos.includes('media') || pos.includes('design') || pos.includes('editor') || pos.includes('publicity')) {
      return 'Web & Digital Media';
    }
    return 'Core Officers';
  };

  const getRoleBadgeStyle = (category: string) => {
    switch (category) {
      case 'Core Officers':
        return 'bg-amber-50 text-amber-900 border-amber-300/80 shadow-2xs';
      case 'Technical & Activities':
        return 'bg-teal-50 text-teal-900 border-teal-300/80 shadow-2xs';
      case 'Outreach & Membership':
        return 'bg-sky-50 text-sky-900 border-sky-300/80 shadow-2xs';
      case 'Web & Digital Media':
        return 'bg-purple-50 text-purple-900 border-purple-300/80 shadow-2xs';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-300';
    }
  };

  const categories = ['All', 'Core Officers', 'Technical & Activities', 'Outreach & Membership', 'Web & Digital Media'];

  const filteredMembers = teamMembers.filter(member => {
    const memberCat = getMemberCategory(member.position);
    const matchesCat = activeCategory === 'All' || memberCat === activeCategory;
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.affiliation && member.affiliation.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="relative bg-[#FAFCFF] text-gray-900 pb-24 min-h-screen">
      
      {/* ── 1. HERO HEADER ──────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-white via-gray-50 to-[#FAFCFF] border-b border-gray-200 overflow-hidden py-16">
        {/* Subtle decorative dot pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="execom-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.2" fill="#00629B" fillOpacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#execom-dots)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-ieee-light text-ieee-blue text-xs font-bold uppercase tracking-wider mb-4 border border-ieee-blue/20 shadow-xs">
            <Users size={14} className="text-ieee-blue" />
            <span>IEEE Pune Section Leadership</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-ieee-dark leading-tight tracking-tight font-display">
            Executive Committee{' '}
            <span className="bg-gradient-to-r from-ieee-blue via-ieee-secondary to-ieee-teal bg-clip-text text-transparent">
              (ExeCom)
            </span>
          </h1>

          <p className="text-gray-600 text-sm md:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Meet the volunteer leaders, office bearers, and domain coordinators spearheading IEEE Young Professionals Pune Section initiatives.
          </p>
        </div>
      </section>

      {/* ── 2. SEARCH & CATEGORY FILTER BAR ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-7 relative z-10">
        <div className="bg-white p-3 md:p-4 rounded-2xl border border-gray-200/90 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => {
              const count = cat === 'All' 
                ? teamMembers.length 
                : teamMembers.filter(m => getMemberCategory(m.position) === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    activeCategory === cat
                      ? 'bg-ieee-blue text-white shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <span>{cat}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      activeCategory === cat
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search member, role, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs md:text-sm focus:outline-none focus:border-ieee-blue focus:bg-white transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── 3. EXECOM MEMBERS GRID ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-10">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-24 gap-3">
            <div className="w-10 h-10 border-3 border-ieee-blue border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-semibold">Loading committee members...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800">No committee members found</h3>
            <p className="text-xs text-gray-500 mt-1">Try selecting another category or clearing your search filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredMembers.map((member, idx) => {
              const category = getMemberCategory(member.position);
              const badgeStyle = getRoleBadgeStyle(category);
              const isPhone = member.contact && /^[0-9+\s()-]+$/.test(member.contact.trim());

              return (
                <motion.div
                  key={member.id}
                  className="bg-white rounded-3xl border border-gray-200/90 hover:border-ieee-blue/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                  initial={reduced ? {} : { opacity: 0, y: 20 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                >
                  {/* Top Decorative Header Banner */}
                  <div className="h-20 bg-gradient-to-r from-[#002845] via-[#004e6e] to-[#00B2A9] relative">
                    <div className="absolute top-2 right-3">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-white/70">
                        IEEE YP
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="px-6 pb-6 pt-0 -mt-12 flex flex-col items-center text-center flex-grow">
                    
                    {/* Profile Photo */}
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white mb-3 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={member.profileImageUrl || 'https://via.placeholder.com/300?text=IEEE'}
                        alt={member.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Member Name */}
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-ieee-blue transition-colors font-display tracking-tight">
                      {member.name}
                    </h3>

                    {/* Role / Position Badge */}
                    <div className="mt-2 min-h-[28px] flex items-center justify-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border leading-tight ${badgeStyle}`}>
                        {member.position}
                      </span>
                    </div>

                    {/* Affiliation / Institute */}
                    {member.affiliation ? (
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-600 font-medium max-w-full">
                        <Building2 size={13} className="text-gray-400 shrink-0" />
                        <span className="truncate">{member.affiliation}</span>
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-gray-400 italic">
                        IEEE Pune Section
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Contact & LinkedIn */}
                  <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex flex-col gap-2.5">
                    {/* Contact (Phone or Email) */}
                    {member.contact && (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-gray-600">
                        {isPhone ? (
                          <Phone size={12} className="text-gray-400 shrink-0" />
                        ) : (
                          <Mail size={12} className="text-gray-400 shrink-0" />
                        )}
                        <span className="truncate font-mono text-[11px]">{member.contact}</span>
                      </div>
                    )}

                    {/* LinkedIn Button */}
                    {member.linkedinUrl ? (
                      <a
                        href={member.linkedinUrl.startsWith('http') ? member.linkedinUrl : `https://${member.linkedinUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold py-2 px-4 rounded-xl transition-all duration-200 shadow-2xs hover:shadow-md cursor-pointer"
                      >
                        <LinkedinIcon size={13} color="#FFFFFF" />
                        <span>LinkedIn Profile</span>
                      </a>
                    ) : (
                      <div className="text-[11px] text-center text-gray-400 font-mono py-1">
                        IEEE Member
                      </div>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
