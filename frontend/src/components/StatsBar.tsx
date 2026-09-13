import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '../data/homePageData';

interface Stat {
  id: string;
  value: number;
  suffix: string;
  display: string;
  label: string;
}

const useCounter = (target: number, duration: number = 2000, started: boolean): number => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let raf: number;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, started]);

  return count;
};

const formatCount = (stat: Stat, count: number): string => {
  return `${count}${stat.suffix}`;
};

interface StatItemProps {
  stat: Stat;
  index: number;
  started: boolean;
}

const StatItem = ({ stat, index, started }: StatItemProps) => {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const count = useCounter(stat.value, 2000, started && !reduced);
  const display = reduced ? stat.display : formatCount(stat, count);

  return (
    <motion.div
      className={`flex-1 text-center py-12 px-6 relative group ${
        index > 0 ? 'border-l-0 sm:border-l border-white/15' : ''
      }`}
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div
        className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-none mb-3 group-hover:scale-105 transition-transform duration-300 font-display"
        aria-label={stat.display}
      >
        {display}
      </div>
      <div className="text-xs text-ieee-teal uppercase tracking-widest font-extrabold font-mono">
        {stat.label}
      </div>
    </motion.div>
  );
};

/**
 * StatsBar
 * Rich IEEE Dark Navy Blue bar with 4 animated stats.
 */
const StatsBar = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="w-full bg-gradient-to-r from-[#001c33] via-[#002845] to-[#00385e] border-y border-white/10 relative overflow-hidden shadow-lg"
      aria-label="IEEE YP Pune key statistics"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:flex sm:flex-row relative z-10">
        {stats.map((stat, i) => (
          <StatItem key={stat.id} stat={stat} index={i} started={inView} />
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
