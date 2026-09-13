import { motion } from 'framer-motion';
import { Calendar, Building2, Users, Globe } from 'lucide-react';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cards = [
  {
    id: 'highlights-activities',
    number: '23',
    label: 'Activities Conducted',
    icon: Calendar,
    color: 'bg-ieee-blue',
    desc: 'Technical talks, workshops, networking meets, and international congresses throughout 2025.',
  },
  {
    id: 'highlights-ous',
    number: '9',
    label: 'OUs Enabled',
    icon: Building2,
    color: 'bg-ieee-teal',
    desc: 'Organizational units and affinity group chapters supported across institutions in Pune region.',
  },
  {
    id: 'highlights-members',
    number: '500+',
    label: 'Community Members',
    icon: Users,
    color: 'bg-ieee-blue',
    desc: 'Growing network spanning industry, academia, and government sectors across the Pune region.',
  },
  {
    id: 'highlights-international',
    number: '3',
    label: 'International Engagements',
    icon: Globe,
    color: 'bg-ieee-teal',
    desc: 'Representation at YP Nexus Kochi, IEEE IES SYP Congress Tunis, and EU-REKA programme.',
  },
];

/**
 * HighlightsSection
 * 2025 Impact — inserted between UpcomingEvents and ExploreSection.
 * 4-card grid (2×2 mobile, 4-col desktop) with icon, number, label, description.
 */
const HighlightsSection = () => (
  <section
    className="py-16 px-4 bg-gray-50"
    aria-labelledby="highlights-heading"
  >
    <div className="max-w-7xl mx-auto">

      {/* ── Centered header ─────────────────────────────────────── */}
      <div className="text-center mb-10">
        <h2
          id="highlights-heading"
          className="text-3xl font-bold text-ieee-dark"
        >
          Our 2025 Impact
        </h2>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          23 activities conducted across workshops, networking events, OU enablement, and international programmes.
        </p>
      </div>

      {/* ── 4-card grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
              initial={reduced ? {} : { opacity: 0, y: 20 }}
              whileInView={reduced ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {/* Icon box */}
              <div
                className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-4`}
              >
                <Icon size={20} color="white" aria-hidden="true" />
              </div>

              {/* Number */}
              <div className="text-3xl font-bold text-ieee-dark leading-none">
                {card.number}
              </div>

              {/* Label */}
              <div className="text-sm font-semibold text-ieee-blue uppercase tracking-wide mt-1">
                {card.label}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

    </div>
  </section>
);

export default HighlightsSection;
