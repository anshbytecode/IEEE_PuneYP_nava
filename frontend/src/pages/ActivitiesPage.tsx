import { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Building2, MapPin, ChevronRight,
  ChevronLeft, ChevronDown, ArrowRight, Sparkles,
  X, Filter, Search, ShieldCheck, RotateCcw,
  Cpu, Laptop, Users, Award, LayoutGrid, Layers
} from 'lucide-react';

import { eventService, EventItem } from '../services/eventService';
import { mediaService } from '../services/mediaService';
import ypLogoFallback from '../assets/IeePuneYP_logo.png';
import { pastMoments } from '../data/homePageData';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Category Rich Visual Themes & Color Tokens ─────────────────────── */
const CATEGORY_THEMES: Record<string, {
  bg: string;
  text: string;
  dot: string;
  gradient: string;
  accent: string;
  borderHover: string;
  icon: typeof Cpu;
}> = {
  Technical: {
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    dot: 'bg-sky-500',
    gradient: 'from-[#0A2540] via-[#004d75] to-[#0284c7]',
    accent: '#38bdf8',
    borderHover: 'hover:border-sky-500',
    icon: Cpu,
  },
  Networking: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    gradient: 'from-[#064e3b] via-[#047857] to-[#0d9488]',
    accent: '#34d399',
    borderHover: 'hover:border-emerald-500',
    icon: Users,
  },
  Leadership: {
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
    gradient: 'from-[#4c0519] via-[#881337] to-[#e11d48]',
    accent: '#fb7185',
    borderHover: 'hover:border-rose-500',
    icon: Award,
  },
  Workshop: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    gradient: 'from-[#451a03] via-[#78350f] to-[#d97706]',
    accent: '#fbbf24',
    borderHover: 'hover:border-amber-500',
    icon: Laptop,
  },
  Flagship: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    dot: 'bg-indigo-500',
    gradient: 'from-[#1e1b4b] via-[#312e81] to-[#004d75]',
    accent: '#818cf8',
    borderHover: 'hover:border-indigo-500',
    icon: Sparkles,
  },
};

const DEFAULT_THEME = {
  bg: 'bg-sky-100',
  text: 'text-sky-700',
  dot: 'bg-sky-500',
  gradient: 'from-[#002d4a] via-[#004d75] to-[#006a64]',
  accent: '#38bdf8',
  borderHover: 'hover:border-[#004d75]',
  icon: Sparkles,
};

interface ActivityCardProps {
  event: {
    id: string;
    vtoolsId?: string;
    category: string;
    status: string;
    day: string;
    month: string;
    year: string;
    title: string;
    subtitle: string;
    venue: string;
    time: string;
    imageUrl: string;
    imageAlt: string;
    isYpPune?: boolean;
    spoids?: string[];
    primaryHost?: string;
    relationship?: string;
  };
  index: number;
  onClick: () => void;
}

/* ════════════════════════════════════════════════════════════════════════════
   ACTIVITY CARD (With Official Poster / Banner Display & Dynamic Badges)
   ════════════════════════════════════════════════════════════════════════════ */
const ActivityCard = ({ event, index, onClick }: ActivityCardProps) => {
  const theme = CATEGORY_THEMES[event.category] || DEFAULT_THEME;
  const hasCustomPhoto = Boolean(event.imageUrl && !event.imageUrl.includes('IeePuneYP_logo'));
  const posterSrc = hasCustomPhoto ? event.imageUrl : ypLogoFallback;

  return (
    <motion.article
      onClick={onClick}
      className={`bg-white rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 group cursor-pointer hover-lift flex flex-col justify-between ${
        event.isYpPune
          ? 'border-[#004d75]/25 shadow-xs sm:shadow-sm hover:shadow-xl ring-1 ring-[#004d75]/10'
          : 'border-[#E2E8F0] shadow-xs sm:shadow-sm hover:shadow-lg'
      } ${theme.borderHover}`}
      initial={reduced ? {} : { opacity: 0, y: 15 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: Math.min((index % 12) * 0.03, 0.3) }}
      aria-label={`Event: ${event.title}`}
    >
      <div>
        {/* Card Poster / Banner Header - collage height on mobile (h-24), spacious on laptop (sm:h-44) */}
        <div className="relative h-24 sm:h-44 overflow-hidden bg-gradient-to-b from-[#f0f6fa] via-white to-[#f4f8fb] border-b border-[#E2E8F0] flex items-center justify-center p-1.5 sm:p-3">
          <img
            src={posterSrc}
            alt={event.imageAlt || 'IEEE YP Pune Activity Poster'}
            className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
              hasCustomPhoto ? 'object-cover' : 'object-contain p-1 sm:p-2 drop-shadow-sm'
            }`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = ypLogoFallback;
              e.currentTarget.className = 'w-full h-full object-contain p-1 sm:p-2 transition-transform duration-500 group-hover:scale-105';
            }}
          />

          {/* Top Badges Bar */}
          <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between gap-1">
            <span className={`text-[7px] sm:text-[10px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full shadow-xs sm:shadow-sm backdrop-blur-md border border-white/40 ${theme.bg} ${theme.text}`}>
              {event.category}
            </span>
            {event.isYpPune && (
              <span className="bg-[#004d75] text-white text-[7px] sm:text-[9px] font-extrabold uppercase tracking-wider px-1 sm:px-2.5 py-0.2 sm:py-0.5 rounded-full shadow-xs sm:shadow-sm flex items-center gap-0.5 sm:gap-1 border border-white/20">
                <Sparkles size={7} className="text-amber-300 hidden sm:inline" /> YP
              </span>
            )}
          </div>

          {/* Bottom Date Strip */}
          <div className="absolute bottom-1 left-1.5 sm:bottom-2.5 sm:left-3 bg-white/95 backdrop-blur-md px-1.5 py-0.2 sm:px-2.5 sm:py-0.5 rounded sm:rounded-md border border-[#E2E8F0] shadow-xs flex items-center gap-0.5 sm:gap-1">
            <Calendar size={9} className="text-[#004d75] sm:size-[11px]" />
            <span className="text-[8px] sm:text-[11px] font-bold text-[#004d75]">
              {event.day} {event.month} {event.year}
            </span>
          </div>
        </div>

        {/* Card Body - collage styled on mobile, spacious on laptop */}
        <div className="p-2 sm:p-5">
          <h3 className="text-[11px] sm:text-[15px] font-bold text-[#151c27] leading-tight sm:leading-snug line-clamp-2 group-hover:text-[#004d75] transition-colors mb-1 sm:mb-2">
            {event.title}
          </h3>

          <p className="text-[9px] sm:text-xs text-[#525f70] line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed mb-1.5 sm:mb-4 min-h-0 sm:min-h-[2rem]">
            {event.subtitle || 'Organized under IEEE Pune Section & Young Professionals initiatives.'}
          </p>

          {/* Meta Info */}
          <div className="pt-1.5 sm:pt-3 border-t border-[#E2E8F0] space-y-0.5 sm:space-y-1.5 text-[9px] sm:text-xs text-[#525f70]">
            <div className="flex items-center gap-1 truncate">
              <MapPin size={9} className="shrink-0 text-[#004d75] sm:size-[13px]" />
              <span className="truncate text-[8px] sm:text-[11px]">{event.venue || 'Virtual / Pune Venue'}</span>
            </div>
            
            <div className="flex items-center justify-between text-[8px] sm:text-[11px] pt-0.5">
              <span className="text-[#707880] text-[8px] sm:text-[10px]">
                {event.vtoolsId ? `#${event.vtoolsId}` : 'vTools'}
              </span>

              {event.isYpPune ? (
                <span className="font-bold text-[#006a64] bg-[#006a64]/10 px-1 sm:px-2 py-0.2 sm:py-0.5 rounded text-[8px] sm:text-[10px] flex items-center gap-0.5 sm:gap-1">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#006a64]" />
                  YP00120
                </span>
              ) : (
                <span className="font-medium text-[#707880] bg-gray-100 px-1 sm:px-2 py-0.2 sm:py-0.5 rounded text-[8px] sm:text-[10px]">
                  Section
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer link */}
      <div className="px-2 sm:px-5 pb-2 sm:pb-4 pt-0 sm:pt-1">
        <div className="flex items-center justify-end gap-0.5 sm:gap-1 text-[9px] sm:text-xs font-bold text-[#004d75] group-hover:gap-1.5 transition-all">
          <span>Details</span>
          <ChevronRight size={10} className="sm:size-[14px]" />
        </div>
      </div>
    </motion.article>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   ACTIVITIES PAGE — IEEE Young Professionals Pune Section
   ════════════════════════════════════════════════════════════════════════════ */
const ActivitiesPage = () => {
  const navigate = useNavigate();
  const rightScrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [dbEvents, setDbEvents] = useState<EventItem[]>([]);
  const [moments, setMoments] = useState<any[]>([]);
  
  const [selectedScope, setSelectedScope] = useState<'yp-only' | 'all'>('yp-only');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title-asc'>('date-desc');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(new Date());
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(12);
  const [viewMode, setViewMode] = useState<'paged' | 'scrollable'>('paged');

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        const [eventsRes, mediaRes] = await Promise.all([
          eventService.getEvents({ limit: 500 }),
          mediaService.getMedia({ file_type: 'image', limit: 5 })
        ]);
        if (eventsRes.success && eventsRes.events) {
          setDbEvents(eventsRes.events.filter(e => !e.isDeleted));
        }
        if (mediaRes.success && mediaRes.media && mediaRes.media.length > 0) {
          setMoments(mediaRes.media.map(m => ({
            id: m.id,
            label: m.event_title || m.fileName.split('.')[0],
            imageUrl: m.fileUrl,
            imageAlt: m.fileName
          })));
        } else {
          setMoments(pastMoments as any[]);
        }
      } catch (err) {
        console.error('Failed to load activities page data:', err);
        setMoments(pastMoments as any[]);
      } finally {
        setLoading(false);
      }
    };
    loadPageData();
  }, []);

  const activitiesList = useMemo(() => {
    const extractBannerFromDesc = (html: string): string => {
      if (!html) return '';
      const fileMatch = html.match(/src=["'](https:\/\/[^"'?#\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:[^"']*)?)['"]/i);
      if (fileMatch) return fileMatch[1];
      const anyMatch = html.match(/src=["'](https:\/\/[^"'\s]+)['"]/);
      return anyMatch ? anyMatch[1] : '';
    };

    return dbEvents.map(event => {
      const dateObj = new Date(event.eventDate);
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const year = String(dateObj.getFullYear());

      let formattedTime = 'All Day';
      if (event.eventDate.includes('T')) {
        const timePart = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        if (timePart !== '12:00 AM') formattedTime = timePart;
      }

      const spoids = event.spoids || [];
      const text = `${event.title || ''} ${event.venue || ''} ${event.shortDescription || ''} ${event.fullDescription || ''} ${event.vtoolsId || ''}`.toLowerCase();
      const isYpPune = event.isYpPune || spoids.includes('YP00120') || (event.vtoolsId && String(event.vtoolsId).startsWith('YP00120')) || text.includes('yp00120') || text.includes('young professionals') || text.includes('ieee yp');

      const resolvedImage = event.bannerUrl || extractBannerFromDesc(event.fullDescription) || '';

      return {
        id: event.id,
        vtoolsId: event.vtoolsId,
        rawDate: dateObj,
        category: event.category || 'Technical',
        status: event.status === 'Upcoming' ? 'upcoming' : 'past',
        day, month, year,
        title: event.title,
        subtitle: event.shortDescription,
        venue: event.venue,
        time: formattedTime,
        imageUrl: resolvedImage,
        imageAlt: `${event.title} cover`,
        isYpPune,
        spoids,
      };
    });
  }, [dbEvents]);

  const scopedActivities = useMemo(() => {
    return selectedScope === 'yp-only' ? activitiesList.filter(e => e.isYpPune) : activitiesList;
  }, [activitiesList, selectedScope]);

  const scopeCounts = useMemo(() => ({
    ypCount: activitiesList.filter(e => e.isYpPune).length,
    totalCount: activitiesList.length
  }), [activitiesList]);

  const activitiesCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    scopedActivities.forEach(e => { counts[e.category] = (counts[e.category] || 0) + 1; });
    const sidebar = [{ id: 'cat-all', label: 'All Activities', count: scopedActivities.length, color: 'bg-[#004d75]' }];
    Object.keys(counts).forEach((cat, index) => {
      const style = CATEGORY_THEMES[cat] || DEFAULT_THEME;
      sidebar.push({ id: `cat-${index}`, label: cat, count: counts[cat], color: style.dot });
    });
    return sidebar;
  }, [scopedActivities]);

  const availableYears = useMemo(() => ['All', ...Array.from(new Set(scopedActivities.map(e => e.year))).sort((a, b) => Number(b) - Number(a))], [scopedActivities]);

  // Sync calendar month to latest active event on initial load
  useEffect(() => {
    if (scopedActivities.length > 0) {
      const firstEventDate = scopedActivities[0].rawDate;
      setCurrentCalendarDate(new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1));
    }
  }, [scopedActivities.length]);

  const calendarGridDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay() - 1;
    const startDayOfWeek = firstDay === -1 ? 6 : firstDay;
    const daysCount = new Date(year, month + 1, 0).getDate();
    const days: Array<{
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      hasEvent: boolean;
      events: typeof scopedActivities;
      categories: string[];
    }> = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({
        date: new Date(year, month, -i),
        dayNumber: new Date(year, month, -i).getDate(),
        isCurrentMonth: false,
        hasEvent: false,
        events: [],
        categories: []
      });
    }

    for (let i = 1; i <= daysCount; i++) {
      const d = new Date(year, month, i);
      const dayEvents = scopedActivities.filter(
        e => e.rawDate.getFullYear() === year && e.rawDate.getMonth() === month && e.rawDate.getDate() === i
      );
      const categories = [...new Set(dayEvents.map(e => e.category))];

      days.push({
        date: d,
        dayNumber: i,
        isCurrentMonth: true,
        hasEvent: dayEvents.length > 0,
        events: dayEvents,
        categories
      });
    }
    return days;
  }, [currentCalendarDate, scopedActivities]);

  const filteredEvents = useMemo(() => {
    let list = [...scopedActivities];
    if (selectedCategory !== 'All') list = list.filter(e => e.category === selectedCategory);
    if (selectedYear !== 'All') list = list.filter(e => e.year === selectedYear);
    if (selectedDate) list = list.filter(e => e.rawDate.toDateString() === selectedDate.toDateString());
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.subtitle.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q));
    }
    list.sort((a, b) => sortBy === 'title-asc' ? a.title.localeCompare(b.title) : (sortBy === 'date-asc' ? a.rawDate.getTime() - b.rawDate.getTime() : b.rawDate.getTime() - a.rawDate.getTime()));
    return list;
  }, [scopedActivities, selectedCategory, selectedYear, selectedDate, searchQuery, sortBy]);

  useEffect(() => { setCurrentPage(1); }, [selectedCategory, selectedYear, selectedDate, searchQuery, selectedScope, sortBy]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = useMemo(() => {
    if (viewMode === 'scrollable') return filteredEvents;
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, currentPage, itemsPerPage, viewMode]);

  const spotlightCards = useMemo(() => scopedActivities.slice(0, 3), [scopedActivities]);
  const categoryOptions = useMemo(() => ['All', ...new Set(scopedActivities.map((e) => e.category))], [scopedActivities]);
  
  const resetFilters = () => {
    setSelectedCategory('All'); setSelectedYear('All'); setSearchQuery(''); setSelectedDate(null); setSortBy('date-desc'); setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedYear !== 'All' || selectedDate !== null || searchQuery !== '';

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (rightScrollRef.current) rightScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex-grow flex flex-col font-sans bg-[#F8FAFC] text-[#151c27] min-h-screen">
      <main id="main-content" tabIndex={-1} className="flex-grow">
        <section className="relative overflow-hidden bg-white border-b border-[#E2E8F0] pt-10 pb-10">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F4F8] text-[#004d75] text-xs font-bold uppercase tracking-wider mb-2.5">
                  <ShieldCheck size={14} className="text-[#006a64]" />
                  IEEE Young Professionals Pune Section &bull; SPOID YP00120
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#004d75] mb-2.5 leading-tight tracking-tight">Events &amp; Activities Hub</h1>
                <p className="text-sm md:text-[15px] text-[#40484f] leading-relaxed">Explore all technical conclaves, hands-on workshops, leadership masterclasses, and networking sessions organized by <strong>IEEE Young Professionals Pune Section</strong>.</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-[#E8F4F8] px-5 py-3 rounded-2xl border border-[#004d75]/15 text-center shadow-sm">
                  <div className="text-2xl font-extrabold text-[#004d75] leading-none">{scopeCounts.ypCount}</div>
                  <div className="text-[10px] text-[#004d75] uppercase tracking-wider font-bold mt-1">IEEE YP Pune Events</div>
                </div>
                <div className="bg-[#F8FAFC] px-4 py-3 rounded-2xl border border-[#E2E8F0] text-center">
                  <div className="text-xs font-semibold text-[#707880] mb-0.5">Section View</div>
                  <button onClick={() => setSelectedScope(s => s === 'yp-only' ? 'all' : 'yp-only')} className="text-[11px] font-bold text-[#004d75] hover:underline flex items-center gap-1 justify-center">
                    <Building2 size={12} /> {selectedScope === 'yp-only' ? `View All (${scopeCounts.totalCount})` : 'Only YP Pune'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-7 items-start">
            <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-3.5 sm:space-y-5 order-1 lg:order-1 lg:sticky lg:top-20">
              {/* Calendar - compact on mobile, full-size on desktop */}
              <section className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-xs sm:shadow-sm overflow-hidden">
                <div className="p-2.5 sm:p-3.5 bg-[#004d75] text-white flex items-center justify-between">
                  <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest flex items-center gap-1.5 sm:gap-2">
                    <Calendar size={13} className="sm:size-[14px]" />
                    {currentCalendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                      className="p-0.5 sm:p-1 hover:bg-white/20 rounded transition-colors"
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={14} className="sm:size-[15px]" />
                    </button>
                    <button
                      onClick={() => setCurrentCalendarDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                      className="p-0.5 sm:p-1 hover:bg-white/20 rounded transition-colors"
                      aria-label="Next month"
                    >
                      <ChevronRight size={14} className="sm:size-[15px]" />
                    </button>
                  </div>
                </div>
                <div className="p-2.5 sm:p-3.5">
                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center mb-1 sm:mb-1.5">
                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                      <span key={d} className="text-[9px] sm:text-[10px] font-bold text-[#707880] uppercase">
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-center">
                    {calendarGridDays.map((cell, idx) => {
                      const isSelected = selectedDate?.toDateString() === cell.date.toDateString();
                      const hasEvents = cell.isCurrentMonth && cell.hasEvent;
                      const tooltip = hasEvents
                        ? `${cell.events.length} event(s):\n${cell.events.map(e => `• ${e.title}`).join('\n')}`
                        : undefined;

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (!cell.isCurrentMonth) return;
                            if (isSelected) {
                              setSelectedDate(null);
                            } else {
                              setSelectedDate(cell.date);
                            }
                          }}
                          disabled={!cell.isCurrentMonth}
                          title={tooltip}
                          className={`relative py-1 sm:py-1.5 px-0.5 text-[10px] sm:text-xs rounded sm:rounded-lg font-medium transition-all flex flex-col items-center justify-center ${
                            !cell.isCurrentMonth
                              ? 'text-[#c0c7d0] opacity-40 cursor-default'
                              : isSelected
                              ? 'bg-[#004d75] text-white font-extrabold shadow-sm ring-2 ring-[#004d75]/30'
                              : hasEvents
                              ? 'bg-[#E8F4F8] text-[#004d75] font-extrabold ring-1 ring-[#004d75]/30 hover:bg-[#d0e8f2] hover:scale-105 shadow-xs'
                              : 'text-[#151c27] hover:bg-[#F1F5F9]'
                          }`}
                        >
                          <span className="leading-none">{cell.dayNumber}</span>

                          {/* Category-themed event indicator dots */}
                          {hasEvents && (
                            <div className="flex items-center justify-center gap-0.5 mt-0.5">
                              {cell.categories.slice(0, 3).map((cat, cIdx) => {
                                const catTheme = CATEGORY_THEMES[cat] || DEFAULT_THEME;
                                return (
                                  <span
                                    key={cIdx}
                                    className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${
                                      isSelected ? 'bg-amber-300' : catTheme.dot
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Categories */}
              <section className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-xs sm:shadow-sm p-3 sm:p-4">
                <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-[#004d75] mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Filter size={12} className="sm:size-[13px]" /> Categories
                </h3>
                <ul className="space-y-0.5 sm:space-y-1">
                  {activitiesCategories.map(cat => {
                    const isActive =
                      (selectedCategory === 'All' && cat.label === 'All Activities') ||
                      selectedCategory === cat.label;
                    return (
                      <li key={cat.id}>
                        <button
                          onClick={() => setSelectedCategory(cat.label === 'All Activities' ? 'All' : cat.label)}
                          className={`w-full flex items-center justify-between p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
                            isActive ? 'bg-[#E8F4F8] text-[#004d75] font-bold' : 'text-[#40484f] hover:bg-[#f0f3ff]'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${cat.color} shrink-0`} />
                            <span className="truncate">{cat.label}</span>
                          </div>
                          <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-bold shrink-0 ${
                            isActive ? 'bg-[#004d75] text-white' : 'bg-[#e2e8f8] text-[#40484f]'
                          }`}>
                            {cat.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Spotlight in Sidebar */}
              {spotlightCards.length > 0 && (
                <section className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-xs sm:shadow-sm p-3 sm:p-4 space-y-2 sm:space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-1.5 sm:pb-2">
                    <h3 className="font-bold text-[11px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-[#004d75] flex items-center gap-1.5">
                      <Sparkles size={11} className="text-[#006a64]" />
                      Spotlight
                    </h3>
                    <span className="text-[9px] sm:text-[10px] font-bold bg-[#006a64]/10 text-[#006a64] px-1.5 py-0.2 rounded-full">
                      {spotlightCards.length}
                    </span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    {spotlightCards.map(event => {
                      const cardTheme = CATEGORY_THEMES[event.category] || DEFAULT_THEME;
                      const Icon = cardTheme.icon;
                      return (
                        <div
                          key={event.id}
                          onClick={() => navigate(`/public-events/${event.id}`)}
                          className="group relative bg-[#F8FAFC] hover:bg-[#E8F4F8] p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-[#E2E8F0] hover:border-[#004d75]/30 transition-all cursor-pointer flex gap-2 sm:gap-2.5 items-center"
                        >
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${cardTheme.gradient} shrink-0 flex items-center justify-center text-white shadow-xs`}>
                            <Icon size={14} className="sm:size-[16px]" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span className="text-[8px] sm:text-[9px] font-bold uppercase text-[#004d75] bg-white px-1 sm:px-1.5 py-0.2 rounded border border-[#E2E8F0]">
                                {event.day} {event.month} {event.year}
                              </span>
                            </div>
                            <h4 className="text-[11px] sm:text-xs font-bold text-[#151c27] truncate group-hover:text-[#004d75] transition-colors">
                              {event.title}
                            </h4>
                            <p className="text-[9px] sm:text-[10px] text-[#707880] truncate mt-0.5">
                              {event.venue || 'Pune Venue'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </aside>

            {/* ── RIGHT MAIN CONTENT (Scrollable Viewport) ── */}
            <div
              ref={rightScrollRef}
              className="flex-1 space-y-4 sm:space-y-5 order-1 lg:order-2 min-w-0 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar pr-1"
            >

              {/* 1. Filter Bar */}
              <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-xs sm:shadow-sm space-y-2.5 sm:space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-2.5 items-center">
                  
                  {/* Search */}
                  <div className="sm:col-span-5 relative">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707880]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search IEEE YP Pune activities..."
                      className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 sm:py-2 text-[11px] sm:text-xs rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#004d75] transition-all text-[#151c27]"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#707880] hover:text-[#151c27]"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  {/* Category Dropdown */}
                  <div className="sm:col-span-3 relative">
                    <button
                      onClick={() => { setCategoryDropdownOpen(o => !o); setYearDropdownOpen(false); setSortDropdownOpen(false); }}
                      className="w-full flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-[11px] sm:text-xs font-semibold text-[#40484f] hover:bg-white transition-colors"
                    >
                      <span className="truncate">Category: {selectedCategory === 'All' ? 'All' : selectedCategory}</span>
                      <ChevronDown size={12} className={`transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {categoryDropdownOpen && (
                      <ul className="absolute left-0 top-full mt-1.5 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-30 py-1 max-h-48 overflow-y-auto">
                        {categoryOptions.map(cat => (
                          <li key={cat}>
                            <button
                              onClick={() => { setSelectedCategory(cat); setCategoryDropdownOpen(false); }}
                              className={`w-full text-left px-3.5 py-1.5 text-xs ${
                                selectedCategory === cat ? 'bg-[#E8F4F8] text-[#004d75] font-bold' : 'text-[#40484f] hover:bg-[#F8FAFC]'
                              }`}
                            >
                              {cat === 'All' ? 'All Categories' : cat}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Year Dropdown */}
                  <div className="sm:col-span-2 relative">
                    <button
                      onClick={() => { setYearDropdownOpen(o => !o); setCategoryDropdownOpen(false); setSortDropdownOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#40484f] hover:bg-white transition-colors"
                    >
                      <span>Year: {selectedYear === 'All' ? 'All' : selectedYear}</span>
                      <ChevronDown size={13} className={`transition-transform ${yearDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {yearDropdownOpen && (
                      <ul className="absolute left-0 top-full mt-1.5 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-30 py-1 max-h-48 overflow-y-auto">
                        {availableYears.map(yr => (
                          <li key={yr}>
                            <button
                              onClick={() => { setSelectedYear(yr); setYearDropdownOpen(false); }}
                              className={`w-full text-left px-3.5 py-1.5 text-xs ${
                                selectedYear === yr ? 'bg-[#E8F4F8] text-[#004d75] font-bold' : 'text-[#40484f] hover:bg-[#F8FAFC]'
                              }`}
                            >
                              {yr === 'All' ? 'All Years' : yr}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="sm:col-span-2 relative">
                    <button
                      onClick={() => { setSortDropdownOpen(o => !o); setCategoryDropdownOpen(false); setYearDropdownOpen(false); }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#40484f] hover:bg-white transition-colors"
                    >
                      <span className="truncate">
                        {sortBy === 'date-desc' ? 'Newest' : sortBy === 'date-asc' ? 'Oldest' : 'A-Z'}
                      </span>
                      <ChevronDown size={13} className={`transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {sortDropdownOpen && (
                      <ul className="absolute right-0 top-full mt-1.5 w-full bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-30 py-1">
                        <li>
                          <button
                            onClick={() => { setSortBy('date-desc'); setSortDropdownOpen(false); }}
                            className={`w-full text-left px-3.5 py-1.5 text-xs ${sortBy === 'date-desc' ? 'bg-[#E8F4F8] text-[#004d75] font-bold' : 'text-[#40484f] hover:bg-[#F8FAFC]'}`}
                          >
                            Newest First
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => { setSortBy('date-asc'); setSortDropdownOpen(false); }}
                            className={`w-full text-left px-3.5 py-1.5 text-xs ${sortBy === 'date-asc' ? 'bg-[#E8F4F8] text-[#004d75] font-bold' : 'text-[#40484f] hover:bg-[#F8FAFC]'}`}
                          >
                            Oldest First
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => { setSortBy('title-asc'); setSortDropdownOpen(false); }}
                            className={`w-full text-left px-3.5 py-1.5 text-xs ${sortBy === 'title-asc' ? 'bg-[#E8F4F8] text-[#004d75] font-bold' : 'text-[#40484f] hover:bg-[#F8FAFC]'}`}
                          >
                            Title A-Z
                          </button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* Filter chips & View Mode */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0]">
                  <div className="flex flex-wrap items-center gap-2">
                    {hasActiveFilters ? (
                      <>
                        <span className="text-[11px] text-[#707880] font-semibold">Filters:</span>

                        {selectedCategory !== 'All' && (
                          <span className="text-[11px] bg-[#E8F4F8] text-[#004d75] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                            {selectedCategory}
                            <button onClick={() => setSelectedCategory('All')} className="hover:opacity-75"><X size={12} /></button>
                          </span>
                        )}

                        {selectedYear !== 'All' && (
                          <span className="text-[11px] bg-[#E8F4F8] text-[#004d75] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                            {selectedYear}
                            <button onClick={() => setSelectedYear('All')} className="hover:opacity-75"><X size={12} /></button>
                          </span>
                        )}

                        {selectedDate && (
                          <span className="text-[11px] bg-[#E8F4F8] text-[#004d75] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                            {selectedDate.toLocaleDateString()}
                            <button onClick={() => setSelectedDate(null)} className="hover:opacity-75"><X size={12} /></button>
                          </span>
                        )}

                        {searchQuery && (
                          <span className="text-[11px] bg-[#E8F4F8] text-[#004d75] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                            "{searchQuery}"
                            <button onClick={() => setSearchQuery('')} className="hover:opacity-75"><X size={12} /></button>
                          </span>
                        )}

                        <button
                          onClick={resetFilters}
                          className="text-[11px] text-[#006a64] font-bold hover:underline flex items-center gap-1 ml-1"
                        >
                          <RotateCcw size={12} /> Reset
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#707880] flex items-center gap-1">
                        <Sparkles size={12} className="text-[#004d75]" />
                        Showing authentic IEEE Young Professionals Pune activities
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 ml-auto">
                    <div className="hidden sm:inline-flex p-0.5 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0] text-[10px] font-bold">
                      <button
                        onClick={() => setViewMode('paged')}
                        className={`px-2 py-0.5 rounded flex items-center gap-1 ${viewMode === 'paged' ? 'bg-[#004d75] text-white shadow-xs' : 'text-[#40484f]'}`}
                        title="Paged View"
                      >
                        <LayoutGrid size={11} /> 12 / page
                      </button>
                      <button
                        onClick={() => setViewMode('scrollable')}
                        className={`px-2 py-0.5 rounded flex items-center gap-1 ${viewMode === 'scrollable' ? 'bg-[#004d75] text-white shadow-xs' : 'text-[#40484f]'}`}
                        title="Continuous Scroll View"
                      >
                        <Layers size={11} /> Scroll All
                      </button>
                    </div>

                    <button
                      onClick={() => setSelectedScope(s => s === 'yp-only' ? 'all' : 'yp-only')}
                      className="text-[11px] text-[#707880] hover:text-[#004d75] transition-colors"
                    >
                      {selectedScope === 'yp-only' ? (
                        <span>or <span className="underline font-semibold">All ({scopeCounts.totalCount})</span></span>
                      ) : (
                        <span className="font-semibold text-[#004d75] underline">&larr; YP Pune only</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Main Activities Grid */}
              <div>
                <div className="flex items-center justify-between mb-2.5 sm:mb-3 px-0.5">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h2 className="text-sm sm:text-base font-extrabold text-[#151c27]">
                      {selectedScope === 'yp-only' ? 'IEEE Young Professionals Activities' : 'All Section Events'}
                    </h2>
                    <span className="text-[10px] sm:text-xs font-bold bg-[#E8F4F8] text-[#004d75] px-2 py-0.2 rounded-full">
                      {filteredEvents.length}
                    </span>
                  </div>

                  <span className="text-[10px] sm:text-xs text-[#707880]">
                    {viewMode === 'paged'
                      ? `Page ${currentPage} of ${totalPages}`
                      : `Showing all ${filteredEvents.length}`}
                  </span>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-20 bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0]">
                    <div className="spinner spinner-lg" />
                  </div>
                ) : paginatedEvents.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-4">
                      {paginatedEvents.map((event, i) => (
                        <ActivityCard
                          key={event.id}
                          event={event}
                          index={i}
                          onClick={() => navigate(`/public-events/${event.id}`)}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {viewMode === 'paged' && totalPages > 1 && (
                      <div className="mt-4 sm:mt-5 p-2.5 sm:p-3.5 bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-xs sm:shadow-sm flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
                        <div className="text-[10px] sm:text-xs text-[#707880]">
                          Showing <span className="font-bold text-[#151c27]">{(currentPage - 1) * itemsPerPage + 1}</span>–
                          <span className="font-bold text-[#151c27]">{Math.min(currentPage * itemsPerPage, filteredEvents.length)}</span> of{' '}
                          <span className="font-bold text-[#151c27]">{filteredEvents.length}</span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-1 sm:p-1.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-0.5 sm:gap-1 ${
                              currentPage === 1
                                ? 'text-[#c0c7d0] cursor-not-allowed bg-gray-50'
                                : 'bg-[#F8FAFC] text-[#004d75] hover:bg-[#E8F4F8] border border-[#E2E8F0]'
                            }`}
                          >
                            <ChevronLeft size={12} className="sm:size-[13px]" /> Prev
                          </button>

                          <div className="flex items-center gap-0.5 sm:gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                              .map((pageNum, idx, arr) => {
                                const prev = arr[idx - 1];
                                const showEllipsis = prev && pageNum - prev > 1;
                                return (
                                  <div key={pageNum} className="flex items-center">
                                    {showEllipsis && <span className="px-0.5 text-[#707880] text-[10px] sm:text-xs">...</span>}
                                    <button
                                      onClick={() => handlePageChange(pageNum)}
                                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded sm:rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                                        currentPage === pageNum
                                          ? 'bg-[#004d75] text-white shadow-xs sm:shadow-sm'
                                          : 'bg-[#F8FAFC] text-[#40484f] hover:bg-[#E8F4F8] border border-[#E2E8F0]'
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  </div>
                                );
                              })}
                          </div>

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-1 sm:p-1.5 px-2 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center gap-0.5 sm:gap-1 ${
                              currentPage === totalPages
                                ? 'text-[#c0c7d0] cursor-not-allowed bg-gray-50'
                                : 'bg-[#F8FAFC] text-[#004d75] hover:bg-[#E8F4F8] border border-[#E2E8F0]'
                            }`}
                          >
                            Next <ChevronRight size={12} className="sm:size-[13px]" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] p-8 sm:p-12 flex flex-col items-center text-center shadow-xs sm:shadow-sm">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#E8F4F8] flex items-center justify-center text-[#004d75] mb-2.5 sm:mb-3">
                      <Search size={22} className="sm:size-[28px]" />
                    </div>
                    <h5 className="text-sm sm:text-base font-bold text-[#151c27] mb-1 sm:mb-1.5">No matching activities found</h5>
                    <p className="text-[11px] sm:text-xs text-[#707880] mb-4 sm:mb-5 max-w-sm leading-relaxed">
                      Try clearing your search query or selecting a different category or year.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-[#004d75] text-white text-[11px] sm:text-xs font-bold rounded-lg sm:rounded-xl hover:bg-[#003d5e] transition-all shadow-xs sm:shadow-sm"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════════════
            3. MOMENTS FROM PAST ACTIVITIES GALLERY
            ════════════════════════════════════════════════════════════════════════════ */}
        <section className="bg-white py-10 border-t border-[#E2E8F0]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg md:text-xl font-bold text-[#004d75]">Moments from Past Activities</h2>
                <p className="text-xs text-[#707880] mt-0.5">
                  Highlights and memories from our workshops, conclaves, and community meetups.
                </p>
              </div>
              <button
                onClick={() => navigate('/public-gallery')}
                className="text-xs font-bold text-[#004d75] hover:underline flex items-center gap-1"
              >
                <span>View all photos</span>
                <ArrowRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {moments.map((moment, i) => (
                <motion.div
                  key={moment.id}
                  className="group cursor-pointer"
                  onClick={() => navigate('/public-gallery')}
                  initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
                  whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-[#E8F4F8] border border-[#E2E8F0]">
                    <img
                      src={moment.imageUrl}
                      alt={moment.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[10px] font-semibold text-white truncate">{moment.label}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default ActivitiesPage;
