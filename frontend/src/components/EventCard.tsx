import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * EventCard
 * Reusable card for displaying a single event.
 *
 * @param {Object}  props
 * @param {string}  props.type           - Event category badge text (e.g. "WORKSHOP")
 * @param {string}  props.date           - Human-readable date (e.g. "Mar 14, 2026")
 * @param {string}  props.title          - Event title
 * @param {string}  props.description    - Short description; clipped to 3 lines via line-clamp
 * @param {string}  props.location       - Venue / city string
 * @param {string}  props.imageUrl       - Hero image src URL
 * @param {number}  [props.animationDelay=0] - Stagger delay for whileInView entrance (seconds)
 */
interface EventCardProps {
  type: string;
  date: string;
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  animationDelay?: number;
}

const EventCard = ({
  type,
  date,
  title,
  description,
  location,
  imageUrl,
  animationDelay = 0,
}: EventCardProps) => {
  const reduced = prefersReducedMotion();

  return (
    <motion.article
      className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 relative group"
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: animationDelay }}
      aria-label={`Event: ${title}`}
    >
      {/* Top hover accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ieee-teal to-ieee-blue scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10" />

      {/* Hero image container with zoom */}
      <div className="w-full h-52 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={`${title} — event cover`}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Category badge + Date */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-gradient-to-r from-ieee-light to-blue-50 text-ieee-blue border border-ieee-blue/10 uppercase tracking-wider">
            {type}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar size={12} aria-hidden="true" />
            {date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 leading-snug group-hover:text-ieee-blue transition-colors duration-250">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1 mt-4 text-gray-400">
          <MapPin size={12} aria-hidden="true" />
          <span className="text-xs">{location}</span>
        </div>
      </div>
    </motion.article>
  );
};

export default EventCard;
