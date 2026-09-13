import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Sparkles, 
  Code, 
  TrendingUp, 
  Award, 
  HeartHandshake, 
  UserPlus, 
  Calendar, 
  Network, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const benefits = [
  {
    number: '01',
    title: 'Networking Opportunities',
    desc: 'Connect with like-minded engineers, innovators, and industry leaders across the Pune region and IEEE Region 10.',
    icon: Users,
    color: 'from-blue-600 to-ieee-blue'
  },
  {
    number: '02',
    title: 'Skill Development',
    desc: 'Participate in hands-on workshops and training sessions on emerging technologies and essential professional leadership skills.',
    icon: Sparkles,
    color: 'from-teal-600 to-ieee-teal'
  },
  {
    number: '03',
    title: 'Technical Events',
    desc: 'Attend masterclasses, hackathons, and global conferences focused on AI, Cloud, IoT, and cutting-edge innovations.',
    icon: Code,
    color: 'from-purple-600 to-indigo-600'
  },
  {
    number: '04',
    title: 'Career Growth',
    desc: 'Access structured mentorship programs, career guidance, and senior industry insights to accelerate your professional journey.',
    icon: TrendingUp,
    color: 'from-emerald-600 to-teal-600'
  },
  {
    number: '05',
    title: 'Leadership Opportunities',
    desc: 'Take initiative, lead working committees, and gain hands-on executive experience by volunteering in regional IEEE initiatives.',
    icon: Award,
    color: 'from-amber-500 to-orange-600'
  },
  {
    number: '06',
    title: 'Community Impact',
    desc: 'Engage in humanitarian initiatives (like IEEE CODEBhoomi) that apply technological innovation for societal upliftment.',
    icon: HeartHandshake,
    color: 'from-rose-500 to-pink-600'
  }
];

const nextSteps = [
  {
    step: '1',
    title: 'Become a Member',
    desc: 'Start your journey by joining IEEE and unlock access to global technical resources, publications, and international networks.',
    icon: UserPlus,
    ctaText: 'Join IEEE YP Now',
    ctaLink: 'https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMYP060'
  },
  {
    step: '2',
    title: 'Attend Events',
    desc: 'Participate in workshops, seminars, and networking meetups designed to enhance your technical skills and industry exposure.',
    icon: Calendar,
    ctaText: 'View Activities',
    ctaLink: '/activities'
  },
  {
    step: '3',
    title: 'Build Your Network',
    desc: 'Connect with professionals, mentors, and like-minded peers across Pune to expand your career opportunities and research collaborations.',
    icon: Network,
    ctaText: 'Meet ExeCom',
    ctaLink: '/execom'
  },
  {
    step: '4',
    title: 'Volunteer & Lead',
    desc: 'Take initiative, contribute to impactful regional projects, and develop executive leadership skills by being an active IEEE volunteer.',
    icon: ShieldCheck,
    ctaText: 'Get Involved',
    ctaLink: '/contact'
  }
];

export const WhatWeOfferSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white w-full relative overflow-hidden">
      
      {/* Decorative dot pattern */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-25 select-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern id="offer-dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#00629B" fillOpacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#offer-dots)" />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10 space-y-24">
        
        {/* ── PART 1: WHAT WE OFFER (01 TO 06 BENEFITS) ──────────────── */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-ieee-light text-ieee-blue border border-ieee-blue/20 shadow-2xs mb-3">
              <Sparkles size={14} className="text-ieee-blue" />
              <span>Membership Benefits</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-ieee-dark font-display tracking-tight">
              What We Offer to{' '}
              <span className="bg-gradient-to-r from-ieee-blue via-ieee-secondary to-ieee-teal bg-clip-text text-transparent">
                Young Professionals
              </span>
            </h2>

            <p className="text-gray-600 text-sm md:text-base mt-4 leading-relaxed">
              Empowering engineers, technologists, and researchers with world-class technical events, mentorship, and career acceleration platforms.
            </p>
          </div>

          {/* 6-Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.number}
                  className="bg-gray-50/70 hover:bg-white rounded-3xl p-7 border border-gray-200/90 hover:border-ieee-blue/40 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  initial={reduced ? {} : { opacity: 0, y: 20 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  {/* Top accent bar on hover */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${b.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />

                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-2xl font-black text-gray-400 group-hover:text-ieee-blue transition-colors font-display">
                        {b.number}.
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200 shadow-2xs flex items-center justify-center text-ieee-blue group-hover:bg-ieee-blue group-hover:text-white group-hover:scale-110 transition-all duration-300">
                        <Icon size={20} />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-ieee-blue transition-colors font-display mb-2.5">
                      {b.title}
                    </h3>

                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      {b.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center gap-1 text-xs font-bold text-ieee-blue opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span>Explore Benefit</span>
                    <ArrowRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── PART 2: TAKE THE NEXT STEP IN YOUR JOURNEY ─────────────── */}
        <div className="pt-8 border-t border-gray-200">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs mb-3">
              <span>Getting Started with IEEE YP Pune</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold text-ieee-dark font-display tracking-tight">
              Take the Next Step in Your{' '}
              <span className="bg-gradient-to-r from-ieee-blue via-ieee-secondary to-ieee-teal bg-clip-text text-transparent">
                Professional Journey
              </span>
            </h2>

            <p className="text-gray-600 text-sm md:text-base mt-4 leading-relaxed">
              Join a thriving community of innovators, engineers, and leaders. IEEE Young Professionals Pune Section provides the right environment to learn, grow, and make meaningful connections.
            </p>
          </div>

          {/* 4-Step Pathway Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {nextSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-2xs hover:shadow-lg hover:border-ieee-blue/40 transition-all duration-300 flex flex-col justify-between group"
                  initial={reduced ? {} : { opacity: 0, y: 20 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.08 }}
                >
                  <div>
                    {/* Step Icon & Number */}
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center mb-4 group-hover:bg-ieee-blue transition-colors shadow-sm">
                      <Icon size={22} />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-ieee-blue transition-colors font-display mb-2">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <a
                      href={step.ctaLink}
                      target={step.ctaLink.startsWith('http') ? '_blank' : '_self'}
                      rel={step.ctaLink.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-ieee-blue hover:text-ieee-dark transition-colors cursor-pointer"
                    >
                      <span>{step.ctaText}</span>
                      <ArrowRight size={13} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

    </section>
  );
};

export default WhatWeOfferSection;
