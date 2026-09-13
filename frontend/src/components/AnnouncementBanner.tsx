import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { announcementService } from '../services/announcementService';

const STORAGE_KEY = 'banner_dismissed';

/**
 * AnnouncementBanner
 * Renders a full-width dismissible blue banner at the very top of the page.
 * Dismissed state persists within the browser session via sessionStorage.
 * Dynamic: Fetches from GET /api/announcements
 *
 * @returns {JSX.Element|null} Banner element or null if dismissed
 */
const AnnouncementBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerText, setBannerText] = useState('');

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    
    const fetchAnnouncement = async () => {
      try {
        const res = await announcementService.getAnnouncements();
        if (res.success && res.announcements) {
          const active = res.announcements.find(a => a.isActive);
          if (active) {
            setBannerText(active.content);
            if (!dismissed) setShowBanner(true);
          }
        }
      } catch (err) {
        console.error('Error fetching announcement banner:', err);
      }
    };

    fetchAnnouncement();
  }, []);

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem(STORAGE_KEY, 'true');
  };

  if (!showBanner || !bannerText) return null;

  return (
    <div
      className="w-full bg-ieee-blue text-white py-2.5 px-4 flex items-center justify-center relative"
      role="banner"
      aria-label="Site announcement"
    >
      <p className="text-sm font-medium text-center">{bannerText}</p>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/15 transition-colors duration-150"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

export default AnnouncementBanner;

