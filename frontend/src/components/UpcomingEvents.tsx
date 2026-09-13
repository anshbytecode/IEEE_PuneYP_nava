import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import { eventService, EventItem } from '../services/eventService';

/**
 * UpcomingEvents
 * Section that renders three EventCards in a responsive grid.
 * Header row includes section title, subtitle, and a "View All Events" link.
 * Dynamic: Fetches from GET /api/events?status=Upcoming&limit=3
 */
const UpcomingEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await eventService.getEvents({ status: 'Upcoming', limit: 3 });
        if (res.success && res.events) {
          const sortedUpcoming = res.events
            .filter(e => !e.isDeleted)
            .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
          setEvents(sortedUpcoming.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching upcoming events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingEvents();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <section
      className="py-12 px-4 bg-white"
      aria-labelledby="upcoming-events-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* ── Header row ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
          <div>
            <h2
              id="upcoming-events-heading"
              className="text-3xl font-bold text-ieee-blue"
            >
              Upcoming Events
            </h2>
            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
              Join our community at these upcoming technical and professional gatherings.
            </p>
          </div>

          <a
            href="/activities"
            className="shrink-0 border border-ieee-blue text-ieee-blue hover:bg-ieee-blue hover:text-white transition-colors duration-200 px-5 py-2 rounded-md text-sm font-semibold"
            aria-label="View all upcoming events"
          >
            View All Events
          </a>
        </div>

        {/* ── Grid/Loader ────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="spinner spinner-lg"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <Link to={`/public-events/${event.id}`} key={event.id} className="block cursor-pointer">
                <EventCard
                  type={event.category}
                  date={formatDate(event.eventDate)}
                  title={event.title}
                  description={event.shortDescription}
                  location={event.venue}
                  imageUrl={event.bannerUrl || 'https://via.placeholder.com/600x400?text=IEEE+Event'}
                  animationDelay={i * 0.1}
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No upcoming events scheduled at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;

