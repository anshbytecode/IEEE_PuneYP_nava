import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Button, Spin, Empty } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, ArrowRightOutlined, AlertOutlined, ProjectOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { eventService, EventItem } from '../services/eventService';
import { blogService, BlogItem } from '../services/blogService';
import { announcementService, AnnouncementItem } from '../services/announcementService';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

export const PublicHome: React.FC = () => {
  const navigate = useNavigate();
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [featuredEvents, setFeaturedEvents] = useState<EventItem[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<BlogItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);

  useEffect(() => {
    // 1. Fetch announcements
    const fetchAnnouncements = async () => {
      try {
        const res = await announcementService.getAnnouncements();
        if (res.success && res.announcements) {
          setAnnouncements(res.announcements.filter(a => a.isActive));
        }
      } catch (err) {
        console.error('Failed to load announcements', err);
      }
    };

    // 2. Fetch events (upcoming)
    const fetchFeaturedEvents = async () => {
      try {
        setLoadingEvents(true);
        const res = await eventService.getEvents({ limit: 10, status: 'Upcoming' });
        if (res.success && res.events) {
          const sorted = res.events
            .filter(e => !e.isDeleted)
            .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
            .slice(0, 3);
          setFeaturedEvents(sorted);
        }
      } catch (err) {
        console.error('Failed to load events', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    // 3. Fetch latest blogs
    const fetchLatestBlogs = async () => {
      try {
        setLoadingBlogs(true);
        const res = await blogService.getBlogs({ limit: 3, status: 'Published' });
        if (res.success && res.blogs) {
          setLatestBlogs(res.blogs.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load blogs', err);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchAnnouncements();
    fetchFeaturedEvents();
    fetchLatestBlogs();
  }, []);

  return (
    <div className="relative text-[#F8FAFC] pb-16 w-full overflow-hidden">
      
      {/* ── ANNOUNCEMENTS TICKER ────────────────────────────────────────── */}
      {announcements.length > 0 && (
        <div className="w-full bg-slate-950/45 backdrop-blur-md border-b border-white/5 py-3 px-6 relative z-10">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5 shrink-0 bg-ieee-teal/10 border border-ieee-teal/20 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-ieee-teal shadow-[0_0_12px_rgba(0,178,169,0.15)]">
              <AlertOutlined className="animate-pulse" />
              <span>Announcements</span>
            </div>
            <div className="grow overflow-hidden relative">
              <div 
                className="inline-block whitespace-nowrap text-sm text-gray-300 font-medium pl-[100%] animate-[marquee_28s_linear_infinite]"
              >
                {announcements.map((ann) => (
                  <span key={ann.id} className="mr-16">
                    <strong className="text-white font-semibold">{ann.title}</strong>: {ann.content}
                    {ann.link && (
                      <a 
                        href={ann.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="ml-2 text-ieee-teal hover:text-white underline underline-offset-2 transition-colors"
                      >
                        Learn More &rarr;
                      </a>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-20 px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-ieee-teal/15 border border-ieee-teal/25 rounded-full text-ieee-teal text-xs font-bold tracking-widest uppercase mb-8 shadow-[0_0_15px_rgba(0,178,169,0.1)]">
              <ProjectOutlined />
              <span>IEEE Young Professionals</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] font-display">
              Empowering the Next Generation of{' '}
              <span className="bg-gradient-to-r from-ieee-teal via-cyan-400 to-indigo-500 bg-clip-text text-transparent filter drop-shadow-[0_0_20px_rgba(0,178,169,0.15)]">
                Technology Leaders
              </span>
            </h1>

            {/* Subtitle description */}
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              Welcome to the IEEE Pune Section Young Professionals. We host events, hands-on workshops, networking meetups, and publish blogs to help early career engineers develop professionally.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap justify-center items-center gap-4">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate('/public-events')}
                  className="h-12 px-8 bg-gradient-to-r from-ieee-teal to-cyan-500 text-white font-bold border-none rounded-full shadow-[0_4px_20px_rgba(0,178,169,0.35)] hover:shadow-[0_4px_30px_rgba(0,178,169,0.55)] cursor-pointer"
                >
                  Explore Events
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate('/about')}
                  className="h-12 px-8 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold rounded-full cursor-pointer hover:bg-white/10 transition-colors"
                >
                  About YP Section
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED UPCOMING EVENTS ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto my-12 px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-ieee-teal uppercase text-xs font-bold tracking-widest mb-2">Upcoming Highlights</div>
            <h2 className="text-3xl font-extrabold text-white font-display">Featured Events</h2>
          </div>
          <Button 
            type="link" 
            onClick={() => navigate('/public-events')} 
            className="text-ieee-teal hover:text-white font-bold flex items-center gap-1.5 p-0 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Events</span>
            <ArrowRightOutlined />
          </Button>
        </div>

        {loadingEvents ? (
          <div className="text-center py-16">
            <Spin size="large" />
          </div>
        ) : featuredEvents.length === 0 ? (
          <div className="bg-[#0b0f19]/45 border border-dashed border-white/10 rounded-2xl text-center py-12 px-6">
            <Empty description={<span className="text-gray-400">No upcoming events scheduled right now. Check back soon!</span>} />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {featuredEvents.map((event, idx) => (
              <Col xs={24} md={8} key={event.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="h-full"
                >
                  <Card
                    hoverable
                    onClick={() => navigate(`/public-events/${event.id}`)}
                    className="bg-[#0b0f19]/45 backdrop-blur-md border border-white/5 hover:border-ieee-teal/30 rounded-2xl overflow-hidden h-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(0,178,169,0.15)] transition-all duration-300"
                    styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' } }}
                  >
                    {/* Banner Image Container */}
                    <div className="relative h-44 overflow-hidden rounded-xl mb-5 group">
                      <img 
                        src={event.bannerUrl || '/pics/p1.PNG'} 
                        alt={event.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <Tag color="cyan" className="border-none font-bold text-[9px] uppercase px-2.5 py-0.5 rounded-full">Upcoming</Tag>
                      </div>
                    </div>

                    <div className="flex flex-col grow">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-ieee-teal text-xs font-semibold mb-3">
                        <CalendarOutlined />
                        <span>{dayjs(event.eventDate).format('MMMM DD, YYYY')}</span>
                      </div>
                      
                      {/* Event Title */}
                      <h3 className="text-lg font-bold text-white mb-2 font-display leading-snug group-hover:text-ieee-teal transition-colors">
                        {event.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 grow line-clamp-2">
                        {event.shortDescription}
                      </p>

                      {/* Card Footer */}
                      <div className="border-t border-white/5 pt-4 flex justify-between items-center mt-auto">
                        <span className="flex items-center gap-1.5 text-gray-500 text-xs truncate max-w-[160px]">
                          <EnvironmentOutlined />
                          <span className="truncate">{event.venue}</span>
                        </span>
                        <span className="text-ieee-teal hover:text-white font-bold text-xs flex items-center gap-1 transition-colors">
                          Register <ArrowRightOutlined className="text-[10px]" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* ── MISSION BRIEF SECTION ────────────────────────────────────── */}
      <section className="bg-slate-950/40 border-y border-white/5 py-20 px-4 md:px-8 my-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="text-ieee-teal uppercase text-xs font-bold tracking-widest mb-3">Who We Are</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 font-display">
            Advancing Technology for Humanity in Pune
          </h2>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl mx-auto mb-8 font-sans">
            The IEEE Pune Section Young Professionals Affinity Group is dedicated to helping graduates and early-career members make a smooth transition from college to a successful professional career. We provide tools, resources, events, and mentorship to nurture engineering capabilities.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={() => navigate('/about')} 
              className="bg-ieee-teal text-white border-none font-bold h-11 px-8 rounded-full shadow-[0_0_15px_rgba(0,178,169,0.3)] hover:shadow-[0_0_25px_rgba(0,178,169,0.45)] cursor-pointer"
            >
              Learn More About Us
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── LATEST BLOGS ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto my-12 px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-ieee-teal uppercase text-xs font-bold tracking-widest mb-2">Insightful Articles</div>
            <h2 className="text-3xl font-extrabold text-white font-display">Latest Blogs & News</h2>
          </div>
          <Button 
            type="link" 
            onClick={() => navigate('/public-blogs')} 
            className="text-ieee-teal hover:text-white font-bold flex items-center gap-1.5 p-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Read All Blogs</span>
            <ArrowRightOutlined />
          </Button>
        </div>

        {loadingBlogs ? (
          <div className="text-center py-16">
            <Spin size="large" />
          </div>
        ) : latestBlogs.length === 0 ? (
          <div className="bg-[#0b0f19]/45 border border-dashed border-white/10 rounded-2xl text-center py-12 px-6">
            <Empty description={<span className="text-gray-400">No blog posts published yet.</span>} />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {latestBlogs.map((blog, idx) => (
              <Col xs={24} md={8} key={blog.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="h-full"
                >
                  <Card
                    hoverable
                    onClick={() => navigate(`/public-blogs/${blog.id}`)}
                    className="bg-[#0b0f19]/45 backdrop-blur-md border border-white/5 hover:border-ieee-teal/30 rounded-2xl overflow-hidden h-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(0,178,169,0.15)] transition-all duration-300"
                    styles={{ body: { padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' } }}
                  >
                    {/* Cover Photo */}
                    <div className="relative h-44 overflow-hidden rounded-xl mb-5 group">
                      <img 
                        src={blog.thumbnailUrl || '/pics/p2.PNG'} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="flex flex-col grow">
                      {/* Tag */}
                      <span className="text-ieee-teal text-xs font-bold uppercase tracking-wider mb-2.5">
                        {blog.tags && blog.tags.length > 0 ? blog.tags[0] : 'Technology'}
                      </span>
                      
                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-6 font-display leading-snug">
                        {blog.title}
                      </h3>
                      
                      {/* Footer */}
                      <div className="border-t border-white/5 pt-4 flex justify-between items-center mt-auto text-xs text-gray-500">
                        <span>By {blog.author_name || 'IEEE Author'}</span>
                        <span>{dayjs(blog.createdAt).format('MMM DD, YYYY')}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* ── CSS FOR MARQUEE TICKER ────────────────────────────────────── */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
      `}</style>
    </div>
  );
};
