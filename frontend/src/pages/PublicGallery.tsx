import React, { useState, useEffect, useMemo } from 'react';
import { mediaService, MediaItem } from '../services/mediaService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image, PlayCircle, FileText, X, ExternalLink,
  Search, Camera, Film, BookOpen, LayoutGrid, ZoomIn
} from 'lucide-react';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getLabel = (item: MediaItem): string => {
  if (item.event_title) return item.event_title;
  const raw = item.fileName.replace(/\.[^/.]+$/, '');
  return raw.length > 28 ? raw.slice(0, 28) + '…' : raw;
};

const TABS = [
  { id: 'all',   label: 'All',    Icon: LayoutGrid },
  { id: 'image', label: 'Photos', Icon: Camera     },
  { id: 'video', label: 'Videos', Icon: Film       },
  { id: 'pdf',   label: 'Docs',   Icon: BookOpen   },
] as const;

type TabId = typeof TABS[number]['id'];

export const PublicGallery: React.FC = () => {
  const [loading, setLoading]     = useState(true);
  const [allMedia, setAllMedia]   = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [search, setSearch]       = useState('');
  const [lightbox, setLightbox]   = useState<MediaItem | null>(null);

  useEffect(() => {
  const localMedia: MediaItem[] = [
 {
  id: 1,
  fileName: "IEEE Event ",
  fileType: "image",
  fileUrl: "/pic_ieeeupload/ieeep1.png",
  event_title: "IEEE YP Pune Event"
},
    {
      id: 2,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/CB.jpeg",
      event_title: "IEEE YP Pune Event"
    },
    {
      id: 3,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/CB1.jpeg",
      event_title: "IEEE YP Pune Event"
    },
    {
      id: 4,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/IC.jpeg",
      event_title: "IEEE YP Pune Event"
    },
    {
      id: 5,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/IC1.jpeg",
      event_title: "IEEE YP Pune Event"
    },
     {
      id: 6,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/e1.jpg",
      event_title: "IEEE YP Pune Event"
    },
     {
      id: 7,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/e2.jpg",
      event_title: "IEEE YP Pune Event"
    },
      {
      id: 8,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/n1.jpg",
      event_title: "IEEE YP Pune Event"
    },
    {
      id: 9,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/n2.jpg",
      event_title: "IEEE YP Pune Event"
    },
    {
      id: 10,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/n3.jpg",
      event_title: "IEEE YP Pune Event"
    },
     {
      id: 11,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/n4.jpg",
      event_title: "IEEE YP Pune Event"
    },
    {
      id: 12,
      fileName: "IEEE Event ",
      fileType: "image",
      fileUrl: "/pic_ieeeupload/n5.jpg",
      event_title: "IEEE YP Pune Event"
    },

    

  ];

  setAllMedia(localMedia);
  setLoading(false);
}, []);

  const filtered = useMemo(() => {
    let items = activeTab === 'all' ? allMedia : allMedia.filter(m => m.fileType === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        m =>
          m.fileName.toLowerCase().includes(q) ||
          (m.event_title && m.event_title.toLowerCase().includes(q))
      );
    }
    return items;
  }, [allMedia, activeTab, search]);

  const stats = useMemo(() => ({
    photos: allMedia.filter(m => m.fileType === 'image').length,
    videos: allMedia.filter(m => m.fileType === 'video').length,
    events: new Set(allMedia.map(m => m.event_title).filter(Boolean)).size,
  }), [allMedia]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative text-[#F8FAFC] pb-20 w-full">
      {/* ── 1. HERO HEADER ────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 px-4 md:px-8 text-center border-b border-white/5 bg-slate-950/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ieee-teal/15 border border-ieee-teal/25 rounded-full text-ieee-teal text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_12px_rgba(0,178,169,0.1)]">
              <Image size={12} />
              <span>Multimedia Library</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 font-display">
              Our YP{' '}
              <span className="bg-gradient-to-r from-ieee-teal via-cyan-400 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(0,178,169,0.15)]">
                Media Gallery
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-sans">
              Moments that inspire, connections that last. Explore highlights from our events, workshops and initiatives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 2. STATS CARDS ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { Icon: Camera,      value: `${stats.photos}+`, label: 'Photos'         },
          { Icon: Film,        value: `${stats.videos}+`, label: 'Videos'         },
          { Icon: LayoutGrid,  value: `${stats.events}+`, label: 'Events Covered' },
        ].map(({ Icon, value, label }) => (
          <div key={label} className="bg-[#0b0f19]/45 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-ieee-teal/10 text-ieee-teal rounded-xl border border-ieee-teal/20">
              <Icon size={22} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-white leading-none font-display">{value}</div>
              <div className="text-[11px] text-gray-500 font-bold uppercase mt-1 tracking-wider">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. FILTERS TOOLBAR ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-white/10 shadow-xl py-3.5 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tab pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-ieee-teal text-white shadow-[0_0_12px_rgba(0,178,169,0.3)]'
                    : 'border border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <Icon size={12} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs shrink-0">
            <input
              type="text"
              placeholder="Search by name or event..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/60 border border-white/10 focus:border-ieee-teal focus:ring-1 focus:ring-ieee-teal rounded-xl text-sm text-white focus:outline-none transition-all placeholder-gray-650 font-semibold"
            />
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>
        </div>
      </div>

      {/* ── 4. GALLERY GRID ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {loading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid rounded-2xl bg-white/5 border border-white/5 animate-pulse"
                style={{ height: `${[200, 260, 180, 220, 240, 190, 270, 210][i % 8]}px` }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-ieee-teal/10 border border-ieee-teal/20 flex items-center justify-center mb-5 text-ieee-teal">
              <Image size={36} />
            </div>
            <h3 className="text-lg font-bold text-white font-display">No media found</h3>
            <p className="text-gray-500 text-xs mt-1.5 max-w-xs">
              {search ? 'No results match your search.' : 'No photos or videos have been uploaded yet.'}
            </p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-4 text-xs font-bold text-ieee-teal hover:text-white transition-colors cursor-pointer"
              >
                Clear search
              </button>
            )}
          </motion.div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((item, idx) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={idx}
                onClick={() => item.fileType === 'image' && setLightbox(item)}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-center text-[10px] text-gray-500 font-bold mt-8 uppercase tracking-widest">
            Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}
          </p>
        )}
      </main>

      {/* ── 5. LIGHTBOX MODAL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md cursor-zoom-out"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer z-10"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1,    opacity: 1, y: 0  }}
              exit={{ scale: 0.88,    opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-5xl w-full flex flex-col items-center"
            >
              <img
                src={lightbox.fileUrl}
                alt={getLabel(lightbox)}
                className="max-h-[78vh] w-auto max-w-full rounded-2xl shadow-2xl object-contain border border-white/5"
              />

              <div className="mt-4 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 shadow-2xl">
                <Camera size={16} className="text-ieee-teal shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm leading-snug font-display">{getLabel(lightbox)}</p>
                  {lightbox.event_title && (
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Event photo</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── 6. GALLERY CARD ITEM ────────────────────────────────────────── */
interface GalleryCardProps {
  item: MediaItem;
  index: number;
  onClick: () => void;
}

const GalleryCard: React.FC<GalleryCardProps> = ({ item, index, onClick }) => {
  const label = getLabel(item);
  const isImage = item.fileType === 'image';
  const isVideo = item.fileType === 'video';

  return (
    <motion.div
      className="break-inside-avoid mb-4 group"
      initial={reduced ? {} : { opacity: 0, y: 20, scale: 0.97 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.5) }}
    >
      <div
        onClick={onClick}
        className={`relative rounded-2xl overflow-hidden bg-[#0b0f19]/45 backdrop-blur-md border border-white/5 shadow-lg
          ${isImage ? 'cursor-zoom-in' : 'cursor-default'}
          hover:border-ieee-teal/30 transition-all duration-300`}
      >
        {isImage && (
          <>
            <img
              src={item.fileUrl}
              alt={label}
              className="w-full h-auto object-cover block group-hover:scale-[1.04] transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors duration-300 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-90 group-hover:scale-100">
                <ZoomIn size={18} className="text-white" />
              </div>
            </div>
          </>
        )}

        {isVideo && (
          <div className="relative bg-black">
            <video
              src={item.fileUrl}
              className="w-full h-auto block max-h-60 object-cover"
              controls
              preload="metadata"
            />
            <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-red-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-full select-none pointer-events-none tracking-widest uppercase">
              <PlayCircle size={10} />
              VIDEO
            </span>
          </div>
        )}

        {item.fileType === 'pdf' && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-slate-950/40 border border-white/5 min-h-[130px] rounded-2xl">
            <FileText size={30} className="text-ieee-teal mb-2" />
            <p className="text-xs font-bold text-white truncate w-full px-2 font-display">{label}</p>
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-ieee-teal hover:text-white transition-colors cursor-pointer"
              onClick={e => e.stopPropagation()}
            >
              Open <ExternalLink size={10} />
            </a>
          </div>
        )}

        {(isImage || isVideo) && (
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-slate-950/70 backdrop-blur-md px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                {isImage ? (
                  <Camera size={11} className="text-ieee-teal shrink-0" />
                ) : (
                  <PlayCircle size={11} className="text-red-400 shrink-0" />
                )}
                <p className="text-white text-[12px] font-semibold truncate">{label}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
