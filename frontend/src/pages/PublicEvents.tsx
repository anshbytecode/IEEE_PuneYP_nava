import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Tag, Input, Radio, Spin, message } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, SearchOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { eventService, EventItem } from '../services/eventService';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

const { Title, Paragraph } = Typography;


export const PublicEvents: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await eventService.getEvents();
        if (res.success && res.events) {
          // Sort events by date descending
          const sorted = res.events
            .filter(e => !e.isDeleted)
            .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
          setEvents(sorted);
        }
      } catch (err) {
        console.error(err);
        message.error('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on active tab and search query
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'All') return matchesSearch;
    return event.status === filterStatus && matchesSearch;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0B1120',
        color: '#F8FAFC',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        paddingBottom: '80px'
      }}
    >
      {/* Dynamic Glowing background nodes */}
      <motion.div
        animate={{
          x: [0, 20, -15, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ position: 'absolute', top: '10%', left: '15%', width: 280, height: 280, background: '#00629B', opacity: 0.15, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }}
      />
      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ position: 'absolute', top: '40%', right: '10%', width: 320, height: 320, background: '#00B5E2', opacity: 0.1, borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none' }}
      />



      {/* HERO SECTION */}
      <section style={{ padding: '60px 24px', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 14px',
                background: 'rgba(0, 181, 226, 0.08)',
                border: '1px solid rgba(0, 181, 226, 0.2)',
                borderRadius: '30px',
                color: '#00B5E2',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '20px'
              }}
            >
              <TrophyOutlined style={{ marginRight: '6px' }} /> Events Portal
            </div>
            
            <Title level={1} style={{ color: '#F8FAFC', fontSize: '42px', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '16px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Explore Our Latest{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #00B5E2 0%, #00629B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Activities & Programs
              </span>
            </Title>
            
            <Paragraph style={{ color: '#94A3B8', fontSize: '16px', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 40px auto' }}>
              Connect with global technology leaders, participate in hand-on workshops, and build your technical expertise through events organized by IEEE Pune Young Professionals.
            </Paragraph>
          </motion.div>
        </div>
      </section>

      {/* SEARCH & FILTERS BAR */}
      <section style={{ padding: '0 24px', marginBottom: '40px' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            background: 'rgba(23, 34, 55, 0.4)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          {/* Status Tabs */}
          <Radio.Group
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            optionType="button"
            buttonStyle="solid"
            size="large"
          >
            <Radio.Button value="All" style={{ background: filterStatus === 'All' ? '#00629B' : 'transparent', color: '#F8FAFC', borderColor: 'rgba(255,255,255,0.08)' }}>All Events</Radio.Button>
            <Radio.Button value="Upcoming" style={{ background: filterStatus === 'Upcoming' ? '#00629B' : 'transparent', color: '#F8FAFC', borderColor: 'rgba(255,255,255,0.08)' }}>Upcoming</Radio.Button>
            <Radio.Button value="Completed" style={{ background: filterStatus === 'Completed' ? '#00629B' : 'transparent', color: '#F8FAFC', borderColor: 'rgba(255,255,255,0.08)' }}>Completed</Radio.Button>
          </Radio.Group>

          {/* Search Box */}
          <Input
            placeholder="Search events by name, category..."
            prefix={<SearchOutlined style={{ color: '#64748B' }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              maxWidth: 360,
              height: '42px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              color: '#F8FAFC'
            }}
          />
        </div>
      </section>

      {/* EVENT LIST GRID */}
      <main style={{ padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
              <Spin size="large" />
              <div style={{ color: '#64748B', marginTop: '16px' }}>Loading public events list...</div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <div style={{ color: '#64748B', fontSize: '15px' }}>No events found matching criteria.</div>
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {filteredEvents.map((event, idx) => (
                <Col xs={24} md={12} lg={8} key={event.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                  >
                    <Card
                      hoverable
                      onClick={() => navigate(`/public-events/${event.id}`)}
                      style={{
                        background: 'rgba(23, 34, 55, 0.4)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        height: '100%',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                      }}
                      styles={{ body: { padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' } }}
                    >
                      {/* Banner Wrapper */}
                      <div style={{ margin: '-20px -20px 18px -20px', height: '180px', position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={event.bannerUrl || 'https://via.placeholder.com/600x400?text=IEEE+Event'}
                          alt={event.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Status Tag */}
                        <div style={{ position: 'absolute', top: 12, right: 12 }}>
                          <Tag
                            color={event.status === 'Upcoming' ? 'cyan' : 'default'}
                            style={{
                              borderRadius: '4px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              fontSize: '10px',
                              padding: '2px 8px',
                              border: 'none',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                            }}
                          >
                            {event.status}
                          </Tag>
                        </div>
                        {/* Category Tag */}
                        <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                          <Tag
                            color="blue"
                            style={{
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '10px',
                              padding: '2px 8px',
                              border: 'none',
                              boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                            }}
                          >
                            {event.category}
                          </Tag>
                        </div>
                      </div>

                      {/* Content details */}
                      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00B5E2', fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
                          <CalendarOutlined />
                          <span>{dayjs(event.eventDate).format('MMMM DD, YYYY')}</span>
                        </div>

                        <Title level={4} style={{ color: '#F8FAFC', margin: '0 0 10px 0', fontSize: '18px', fontWeight: 700, lineHeight: 1.35, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {event.title}
                        </Title>

                        <Paragraph style={{ color: '#94A3B8', fontSize: '13px', lineHeight: 1.5, margin: '0 0 20px 0', flexGrow: 1 }} ellipsis={{ rows: 3 }}>
                          {event.shortDescription}
                        </Paragraph>

                        {/* Card Footer */}
                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B', fontSize: '12px', fontWeight: 500 }}>
                            <EnvironmentOutlined />
                            <span style={{ maxWidth: '140px' }} className="truncate">{event.venue}</span>
                          </span>
                          <span style={{ color: '#00B5E2', fontWeight: 700, fontSize: '13px' }}>View Details &rarr;</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </main>
    </div>
  );
};
