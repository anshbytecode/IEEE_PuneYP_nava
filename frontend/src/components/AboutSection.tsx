import { motion } from 'framer-motion';
import { LineMaskSplit } from './Common/LineMaskSplit';
import { Briefcase, Award, GraduationCap, Globe2, ArrowRight } from 'lucide-react';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pillars = [
  {
    icon: Briefcase,
    title: 'Professional Mentorship',
    desc: 'Connecting early-career engineers with senior corporate leaders and research mentors.',
    color: 'bg-ieee-light text-ieee-blue border-ieee-blue/20'
  },
  {
    icon: Award,
    title: 'Global Research & Grants',
    desc: 'Facilitating international IEEE HAC funding ($5,000 CODEBhoomi) & EU-REKA sponsorships.',
    color: 'bg-teal-50 text-ieee-teal border-teal-200'
  },
  {
    icon: GraduationCap,
    title: '25+ Student Branches',
    desc: 'Empowering regional colleges with technical workshops, hackathons, and career guidance.',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    icon: Globe2,
    title: 'Region 10 Global Network',
    desc: 'Participating in IEEE Asia-Pacific congresses, cross-border research, and YP Nexus meets.',
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  }
];

/**
 * AboutSection
 * Clean light theme highlighting chapter story and key focus pillars without duplicate numerical stat boxes.
 */
const AboutSection = () => (
  <section
    className="py-20 px-4 bg-white w-full relative"
    aria-labelledby="about-heading"
  >
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

      {/* ── LEFT: Text narrative (7 cols) ─────────────────────────── */}
      <div className="lg:col-span-6">
        {/* Small badge label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 mb-3">
          <LineMaskSplit text="ABOUT US" duration={0.5} />
        </div>

        {/* Heading */}
        <h2
          id="about-heading"
          className="text-3xl lg:text-5xl font-extrabold text-ieee-blue mt-2 mb-6 leading-tight font-display tracking-tight"
        >
          <LineMaskSplit text="A Decade of Connecting Engineers" delay={0.1} />
        </h2>

        {/* Body paragraph 1 */}
        <div className="text-gray-700 text-sm md:text-base leading-relaxed mb-4 font-sans">
          <LineMaskSplit
            text="The IEEE Pune Section Young Professionals Affinity Group (YP AG) is a dynamic community that connects students, early-career professionals, and experienced technologists to foster professional growth and collaboration. Established in 2016, the affinity group completes 10 years of continuous activity in 2026."
            delay={0.2}
            duration={0.6}
          />
        </div>

        {/* Body paragraph 2 */}
        <div className="text-gray-600 text-sm leading-relaxed mb-8 font-sans">
          <LineMaskSplit
            text="With 500+ members spanning industry, academia, and government, IEEE YP Pune serves as a vital bridge between education and profession — through technical masterclasses, career sessions, research initiatives, and humanitarian innovation programs."
            delay={0.3}
            duration={0.6}
          />
        </div>

        {/* CTAs */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={reduced ? {} : { opacity: 0, y: 10 }}
          whileInView={reduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            href="/activities"
            className="px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-ieee-blue to-ieee-teal text-white hover:shadow-lg hover:scale-105 transition-all duration-250 cursor-pointer inline-flex items-center justify-center tracking-wider uppercase shadow-sm"
            aria-label="Explore IEEE YP Pune activities"
          >
            <span>Our Activities</span>
          </a>
          <a
            href="https://www.ieee.org/membership-catalog/productdetail/showProductDetailPage.html?product=MEMYP060"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl font-bold text-xs bg-amber-50/90 border border-amber-300 text-amber-900 hover:bg-amber-100 hover:scale-105 transition-all duration-250 cursor-pointer inline-flex items-center justify-center tracking-wider uppercase shadow-2xs gap-1.5"
            aria-label="Join IEEE Young Professionals"
          >
            <span>Join IEEE YP</span>
            <ArrowRight size={13} />
          </a>
        </motion.div>
      </div>

      {/* ── RIGHT: Qualitative Focus Pillars (6 cols) ─────────────── */}
      <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {pillars.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              className="bg-gray-50/70 hover:bg-white rounded-2xl p-5 border border-gray-200/90 hover:border-ieee-blue/40 shadow-2xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${item.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={20} />
                </div>

                <h3 className="text-base font-bold text-gray-900 group-hover:text-ieee-blue transition-colors font-display mb-1.5">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  </section>
);

export default AboutSection;
