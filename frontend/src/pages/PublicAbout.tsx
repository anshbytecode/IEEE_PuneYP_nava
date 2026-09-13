import React, { useState, useEffect } from 'react';
import { teamService, TeamMemberItem } from '../services/teamService';
import { motion } from 'framer-motion';
import { Mail, Briefcase, Award, Users } from 'lucide-react';

const LinkedinIcon: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = 'currentColor' }) => (
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

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PublicAbout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
  const [activeTab, setActiveTab] = useState<'chair' | 'execom' | 'about'>('chair');

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === '#chair-message') {
        setActiveTab('chair');
        document.getElementById('chair-message')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#execom2026') {
        setActiveTab('execom');
        document.getElementById('execom2026')?.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#about') {
        setActiveTab('about');
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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

  return (
    <div className="relative bg-gray-50 text-gray-800 pb-20 min-h-screen">
      {/* ────────────────────────────────────────────────────────────
          1. HERO HEADER
          ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Dot pattern */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern id="about-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#006699" fillOpacity="0.06" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-dots)" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-14 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ieee-light text-ieee-blue text-xs font-bold uppercase tracking-wider mb-4">
            <Users size={12} />
            About Us
          </div>
          <h1 className="text-4xl font-bold text-ieee-dark leading-tight tracking-tight">
            Meet the{' '}
            <span className="bg-gradient-to-r from-ieee-blue to-ieee-teal bg-clip-text text-transparent">
              IEEE Pune YP Committee & Leadership
            </span>
          </h1>
          <p className="text-gray-500 text-[15px] mt-4 max-w-2xl mx-auto leading-relaxed">
            Select a suboption below to explore our Chair's vision, Executive Committee members, and core section impact.
          </p>

          {/* Sub-option Navigation Switcher */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <a
              href="#chair-message"
              onClick={() => setActiveTab('chair')}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 shadow-sm border ${
                activeTab === 'chair'
                  ? 'bg-ieee-blue text-white border-ieee-blue shadow-md scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-ieee-blue hover:text-ieee-blue'
              }`}
            >
              📩 Message from Chair
            </a>
            <a
              href="#execom2026"
              onClick={() => setActiveTab('execom')}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 shadow-sm border ${
                activeTab === 'execom'
                  ? 'bg-ieee-blue text-white border-ieee-blue shadow-md scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-ieee-blue hover:text-ieee-blue'
              }`}
            >
              👥 Execom 2026
            </a>
            <a
              href="#about"
              onClick={() => setActiveTab('about')}
              className={`px-6 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 shadow-sm border ${
                activeTab === 'about'
                  ? 'bg-ieee-blue text-white border-ieee-blue shadow-md scale-105'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-ieee-blue hover:text-ieee-blue'
              }`}
            >
              ℹ️ About IEEE YP Pune
            </a>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          2. MESSAGE FROM CHAIR (SUBOPTION 1)
          ──────────────────────────────────────────────────────────── */}
      <section id="chair-message" className="max-w-7xl mx-auto px-4 md:px-8 py-10 scroll-mt-6">
        <div className="bg-gradient-to-r from-ieee-blue to-ieee-dark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-xl border border-white/10">
          <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none">
            <Users size={280} />
          </div>
          <div className="relative z-10 max-w-4xl">
            <span className="text-ieee-teal font-extrabold text-xs uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Suboption 1: Leadership Address
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-6 font-display leading-snug">
              Message from the Chair
            </h2>
            <blockquote className="text-white/90 text-base md:text-lg italic leading-relaxed mb-6 font-sans border-l-4 border-ieee-teal pl-6">
              "As IEEE Young Professionals Pune Section completes a landmark 10 years of continuous impact in 2026, our commitment remains stronger than ever — to empower young engineers, nurture technical research, and foster meaningful industrial-academic connections. We invite every young professional in Pune to join our vibrant community."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full border-2 border-ieee-teal overflow-hidden bg-white/10 shrink-0">
                <img src="/drive-download/member6.jpg" alt="Rakshit Jain" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">Rakshit Jain</h4>
                <p className="text-ieee-teal text-xs font-semibold uppercase tracking-wider">Chair, IEEE YP Pune Section Execom 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          3. EXECOM 2026 COMMITTEE MEMBERS (SUBOPTION 2)
          ──────────────────────────────────────────────────────────── */}
      <section id="execom2026" className="max-w-7xl mx-auto px-4 md:px-8 py-12 scroll-mt-6">
        <div className="text-center mb-12">
          <span className="text-ieee-teal font-extrabold text-xs uppercase tracking-widest block mb-2">Suboption 2: Governance</span>
          <h2 className="text-3xl font-extrabold text-ieee-blue font-display">IEEE YP Pune Execom 2026</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            Meet all Executive Committee officers leading initiatives across Pune Section for 2026.
          </p>
        </div>

        {/* Roles Subsections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            {
              role: "Chair",
              name: "Rakshit Jain",
              bio: "Overall section leadership & strategic execution",
              img: "/drive-download/member6.jpg"
            },
            {
              role: "Vice Chair (VC)",
              name: "Vineet Patil",
              
              bio: "Operations & Student Chapter alignment",
              img: "/drive-download/vineet.jfif"
            },
            {
              role: "Secretary & Academic Relations Chair",
              name: "Deepa Mishra",
            
              bio: "Governance, vTools reporting & section records",
              img: "/drive-download/member5.jpg"
            },
          
            {
              role: "Mentor",
              name: "Dhiraj Mani Chaurasia",
             
              bio: "Senior advisor & research guidance lead",
              img: "/drive-download/member2.jpg"
            },
            {
              role: "Industry Relations Chair",
              name: "Harshal Pathak",
             
              bio: "Corporate partnerships & Hinjawadi IT connect",
              img: "/drive-download/member1.jpg"
            },
        
            {
              role: "Society Collaborations Chair",
              name: "Shruti Bhandurge",
              
              bio: "Inter-society technical programs & joint meets",
              img: "/drive-download/member4.jpeg"
            },
            {
              role: "Student Relations Vice Chair",
              name: "Hanna Varghese",
              
              bio: "Student member retention & transition",
              img: "/drive-download/hanna.PNG"
            },
            {
              role: "Student Relations Chair",
              name: "Riddhi Attarde",
              
              bio: "Student branch chapters & campus outreach",
              img: "/drive-download/riddhi.jfif"
            },
            {
              role: "Treasurer",
              name: "Shrushti Vyawhare",
              
              bio: "Financial planning, grants & budget management",
              img: "/drive-download/member3.jpeg"
            },
            
            
          ].map((officer, idx) => (
            <motion.div
              key={`${officer.role}-${idx}`}
              className="bg-white rounded-2xl border border-gray-200 p-6 text-center flex flex-col items-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ieee-blue to-ieee-teal opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-ieee-blue mb-4 shrink-0 shadow-sm">
                <img
                  src={officer.img}
                  alt={officer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-ieee-teal text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-ieee-light mb-2">
                {officer.role}
              </span>
              <h3 className="font-bold text-gray-900 text-base group-hover:text-ieee-blue transition-colors">
                {officer.name}
              </h3>
              <span className="text-gray-400 text-xs font-mono block mt-0.5">
                {officer.affiliation}
              </span>
              <p className="text-gray-500 text-xs mt-2 leading-relaxed font-sans">
                {officer.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          4. ABOUT IEEE YP PUNE SECTION (SUBOPTION 3)
          ──────────────────────────────────────────────────────────── */}
      <section id="about" className="max-w-7xl mx-auto px-4 md:px-8 py-12 scroll-mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Column */}
          <div>
            <span className="text-ieee-teal font-extrabold text-xs uppercase tracking-widest block mb-2">Suboption 3: About</span>
            <h2 className="text-3xl font-extrabold text-ieee-blue mb-4 font-display">About IEEE YP Pune Section</h2>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-4 font-sans">
              Established in 2016, the IEEE Pune Section Young Professionals Affinity Group completes <strong>10 Years of Continuous Activity in 2026</strong>. We serve as a vital bridge connecting early-career engineers, researchers, and technologists who have graduated within the last decade to global IEEE opportunities.
            </p>
            <p className="text-gray-600 text-[15px] leading-relaxed mb-6 font-sans">
              With 500+ members across industry and academia, our initiatives focus on continuous professional development, technical innovation, research mentorship, and rural digital empowerment.
            </p>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5 text-[15px] text-gray-600">
                <span className="w-2 h-2 rounded-full bg-ieee-teal mt-2 shrink-0" />
                <span><strong>Professional Mentoring:</strong> Bridging the gap between corporate technology leaders and early-career graduates.</span>
              </li>
              <li className="flex items-start gap-2.5 text-[15px] text-gray-600">
                <span className="w-2 h-2 rounded-full bg-ieee-teal mt-2 shrink-0" />
                <span><strong>Continuous Learning:</strong> Technical workshops, hands-on labs, and AI/Cloud masterclasses.</span>
              </li>
              <li className="flex items-start gap-2.5 text-[15px] text-gray-600">
                <span className="w-2 h-2 rounded-full bg-ieee-teal mt-2 shrink-0" />
                <span><strong>Global Ecosystem:</strong> Connecting 25+ Student Branches and affinity groups across IEEE Region 10 Asia-Pacific.</span>
              </li>
            </ul>
          </div>

          {/* Right Column */}
          <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600" />
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-ieee-light flex items-center justify-center text-ieee-blue shrink-0">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base font-display">Decade of Excellence</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Celebrated 10 years of continuous volunteer activities, flagship hackathons, and regional awards.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-ieee-light flex items-center justify-center text-ieee-blue shrink-0">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base font-display">Industry & Academic Synergy</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Empowering 25+ Organizational Units and 500+ active members across Pune IT & engineering hubs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
