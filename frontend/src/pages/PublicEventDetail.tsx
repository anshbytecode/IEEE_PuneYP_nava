import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService, EventItem } from '../services/eventService';
import dayjs from 'dayjs';
import { ArrowLeft, Calendar, MapPin, Award, PlayCircle, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ypLogoFallback from '../assets/IeePuneYP_logo.png';

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PublicEventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<EventItem | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchEventDetails = async () => {
        try {
          setLoading(true);
          const res = await eventService.getEventById(id);
          if (res.success && res.event) {
            setEvent(res.event);
          } else {
            navigate('/activities');
          }
        } catch (err) {
          console.error(err);
          navigate('/activities');
        } finally {
          setLoading(false);
        }
      };
      fetchEventDetails();
    }
  }, [id, navigate]);

  /**
   * Smart description renderer.
   * vTools fullDescription is raw HTML (e.g. <p>...</p>, <img>, <ul>).
   * We detect whether the content is HTML or plain markdown and handle accordingly.
   * For HTML: sanitize by allowing a safe subset of tags.
   * For plain text/markdown: convert markdown syntax to HTML.
   */
  const renderDescription = (content: string): string => {
    if (!content) return '<p class="text-gray-400 italic">No description available.</p>';

    const isHtml = /^\s*<[a-zA-Z]/.test(content.trim()) || /<(p|div|ul|ol|li|h[1-6]|br|img|a|strong|em|span)\b/i.test(content);

    if (isHtml) {
      // Content is already HTML from vTools — sanitize by allowing safe tags only
      // Strip dangerous tags/attributes (script, on*, style with expression)
      let safe = content
        // Remove script tags entirely
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        // Remove event handlers
        .replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: hrefs
        .replace(/href\s*=\s*["']\s*javascript:[^"']*/gi, 'href="#"')
        // Strip img tags that embed tracking pixels or blocked domains
        // (keep only https images from known domains)
        .replace(/<img([^>]*)src\s*=\s*["']([^"']+)["']([^>]*)>/gi, (_m, pre, src, post) => {
          // Allow https images; replace blocked ones with nothing
          if (src.startsWith('https://')) {
            return `<img${pre}src="${src}"${post} style="max-width:100%;border-radius:8px;margin:12px 0;display:block;" loading="lazy" />`;
          }
          return ''; // drop http or relative images from vTools
        });

      // Wrap bare text nodes that aren't in a block element in a paragraph
      if (!/<(p|div|ul|ol|h[1-6])/i.test(safe)) {
        safe = `<p>${safe}</p>`;
      }

      return safe;
    }

    // Plain text / markdown fallback
    let html = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    html = html
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-ieee-dark mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-ieee-dark mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-ieee-dark mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img src='$2' alt='$1' style='max-width:100%;border-radius:10px;margin:16px 0;display:block;' />")
      .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' rel='noopener noreferrer' style='color:var(--color-ieee-primary);text-decoration:underline;'>$1</a>")
      .replace(/```([\s\S]*?)```/g, '<pre style="background:#F3F4F6;color:#1F2937;padding:16px;border-radius:8px;font-family:monospace;overflow-x:auto;">$1</pre>')
      .replace(/^\s*-\s+(.*$)/gim, '<li style="margin-left:20px;color:#374151;list-style-type:disc;">$1</li>')
      .replace(/\n/g, '<br />');

    return html;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] bg-gray-50 gap-4">
        <div className="spinner spinner-lg"></div>
        <div className="text-gray-500 text-sm font-semibold">Loading event details...</div>
      </div>
    );
  }

  if (!event) return null;

  /**
   * Banner resolution priority:
   * 1. event.bannerUrl  (stored in DB from vTools banner-url field)
   * 2. First https:// image found in the description HTML (event flyer is often embedded there)
   * 3. YP logo fallback
   */
  const extractBannerFromDescription = (html: string): string => {
    if (!html) return '';
    const match = html.match(/src=["'](https:\/\/[^"'?#\s]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:[^"']*)?)["']/i)
      || html.match(/src=["'](https:\/\/[^"'\s]+)["']/);
    return match ? match[1] : '';
  };

  const resolvedBanner = event.bannerUrl || extractBannerFromDescription(event.fullDescription) || '';

  return (
    <div className="relative bg-gray-50 text-gray-800 pb-20 min-h-screen">
      {/* ────────────────────────────────────────────────────────────
          1. BREADCRUMBS
          ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <button
          onClick={() => navigate('/activities')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ieee-blue hover:text-ieee-dark transition-colors bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          Back to Events
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────
          2. EVENT HEADER INFO
          ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Badges row */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-white ${
              event.status === 'Upcoming' ? 'bg-green-600' : 'bg-gray-500'
            }`}>
              {event.status}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-ieee-blue text-white font-semibold">
              {event.category}
            </span>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-extrabold text-ieee-dark leading-tight tracking-tight mb-4">
            {event.title}
          </h1>

          {/* Quick-fact Icons Row */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 mt-2 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-ieee-blue shrink-0" />
              <span className="font-semibold">{dayjs(event.eventDate).format('MMMM DD, YYYY h:mm A')}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-ieee-blue shrink-0" />
              <span className="font-semibold">{event.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          2B. STANDALONE BANNER IMAGE CARD (NO TEXT OVERLAY)
          ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <div className="rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-[#E8F4F8] flex justify-center items-center p-3 md:p-6 group max-h-[600px]">
          <img
            src={resolvedBanner || ypLogoFallback}
            alt={event.title}
            className="max-w-full h-auto max-h-[550px] object-contain rounded-xl shadow-sm group-hover:scale-[1.005] transition-transform duration-350"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = ypLogoFallback;
              e.currentTarget.style.padding = '40px';
              e.currentTarget.style.objectFit = 'contain';
              e.currentTarget.style.background = '#E8F4F8';
            }}
          />
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────
          3. CORE INFO LAYOUT (SPLIT COLUMNS)
          ──────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area (col-span-2) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm"
            >
              <h2 className="text-xl font-bold text-ieee-dark mb-4 pb-2 border-b border-gray-100">
                Event Description
              </h2>
              {/* Rich text container — handles both HTML (from vTools) and plain markdown */}
              <div
                className="text-[15px] leading-relaxed text-gray-700 space-y-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderDescription(event.fullDescription) }}
              />
            </motion.div>

            {/* Gallery Section */}
            {event.galleryUrls && event.galleryUrls.length > 0 && (
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm"
              >
                <h2 className="text-xl font-bold text-ieee-dark mb-4 pb-2 border-b border-gray-100">
                  Event Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {event.galleryUrls.map((url, index) => (
                    <div
                      key={index}
                      onClick={() => setLightboxUrl(url)}
                      className="aspect-square rounded-xl overflow-hidden border border-gray-100 cursor-zoom-in group shadow-sm bg-gray-50"
                    >
                      <img
                        src={url}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Embedded Video Highlights */}
            {event.videoUrl && (
              <motion.div
                initial={reduced ? {} : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <PlayCircle className="text-ieee-blue" size={22} />
                  <h2 className="text-xl font-bold text-ieee-dark">
                    Video Highlights
                  </h2>
                </div>
                <div className="rounded-xl overflow-hidden border border-gray-200 bg-black aspect-video">
                  <video
                    src={event.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar Area (col-span-1) */}
          <div className="space-y-6 lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto custom-scrollbar pr-1">
            {/* Logistics & Registration */}
            <motion.div
              initial={reduced ? {} : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
            >
              <div className="space-y-6 mb-6">
                {/* Date */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-ieee-light flex items-center justify-center text-ieee-blue shrink-0">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Date &amp; Time</span>
                    <span className="text-gray-800 font-semibold text-[14px]">
                      {dayjs(event.eventDate).format('MMMM DD, YYYY h:mm A')}
                    </span>
                  </div>
                </div>
                {/* Venue */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-ieee-light flex items-center justify-center text-ieee-blue shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Venue Location</span>
                    <span className="text-gray-800 font-semibold text-[14px]">
                      {event.venue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Registration Button */}
              {event.status === 'Upcoming' && event.registrationLink && (
                <button
                  onClick={() => {
                    window.open(event.registrationLink, '_blank');
                  }}
                  className="w-full py-3 bg-gradient-to-r from-ieee-blue to-ieee-teal hover:from-ieee-dark hover:to-ieee-blue text-white font-bold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ExternalLink size={16} />
                  Register For Event
                </button>
              )}

              {event.status !== 'Upcoming' && (
                <button
                  disabled
                  className="w-full py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl border border-gray-200 cursor-not-allowed text-sm"
                >
                  Event Completed
                </button>
              )}
            </motion.div>

            {/* SDG Alignment */}
            {event.sdgAlignment && event.sdgAlignment.length > 0 && (
              <motion.div
                initial={reduced ? {} : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <Award className="text-ieee-blue" size={20} />
                  <h3 className="text-base font-bold text-ieee-dark">SDG Alignments</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.sdgAlignment.map((sdg, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg border border-ieee-light bg-ieee-light/35 text-ieee-blue font-semibold text-xs leading-tight"
                    >
                      {sdg}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* ────────────────────────────────────────────────────────────
          5. LIGHTBOX MODAL OVERLAY (FOR GALLERY)
          ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxUrl(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={lightboxUrl}
              alt="Enlarged gallery view"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain pointer-events-auto"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
