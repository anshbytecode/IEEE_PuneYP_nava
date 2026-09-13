import React, { useState, useEffect } from 'react';
import { Row, Col, Card, List, Tag, Space, Typography, message, Empty } from 'antd';
import {
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  MailOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { dashboardService, DashboardStats, ActivityItem, ChartData } from '../services/dashboardService';
import { MetricCard } from '../components/Common/MetricCard';
import { DashboardSkeleton } from '../components/Common/LoadingSkeleton';
import { Line, Doughnut } from 'react-chartjs-2';
import { useThemeContext } from '../context/ThemeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [charts, setCharts] = useState<ChartData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const { mode } = useThemeContext();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, chartsRes, actRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getCharts(),
        dashboardService.getActivities()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (chartsRes.success) setCharts(chartsRes.charts);
      if (actRes.success) setActivities(actRes.activities);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      message.error('Could not load dashboard parameters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Registrations Chart Config
  const regChartData = {
    labels: charts?.registrationsTrend.map(r => r.month) || [],
    datasets: [
      {
        fill: true,
        label: 'Event Registrations',
        data: charts?.registrationsTrend.map(r => r.count) || [],
        borderColor: '#00B5E2',
        backgroundColor: 'rgba(0, 181, 226, 0.15)',
        tension: 0.4,
        pointBackgroundColor: '#00629B',
        pointHoverRadius: 6,
      }
    ]
  };

  const regChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: mode === 'dark' ? '#94A3B8' : '#64748B' }
      },
      y: {
        grid: { color: mode === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.1)' },
        ticks: { precision: 0, color: mode === 'dark' ? '#94A3B8' : '#64748B' }
      }
    }
  };

  // Category Breakdown Doughnut Config
  const categoryChartData = {
    labels: charts?.eventsByCategory.map(c => c.category) || [],
    datasets: [
      {
        data: charts?.eventsByCategory.map(c => c.count) || [],
        backgroundColor: [
          '#00629B', // IEEE Blue
          '#00B5E2', // IEEE Cyan
          '#FFC72C', // Gold
          '#E2E8F0', // Slate Gray
          '#2EC4B6', // Teal
        ],
        borderWidth: mode === 'dark' ? 2 : 1,
        borderColor: mode === 'dark' ? '#172237' : '#FFFFFF',
      }
    ]
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: mode === 'dark' ? '#94A3B8' : '#64748B',
          boxWidth: 12,
          padding: 16
        }
      }
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <Typography.Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
          Dashboard Overview
        </Typography.Title>
        <Typography.Text style={{ color: 'var(--text-muted)' }}>
          Welcome back! Here is a summary of the site metrics.
        </Typography.Text>
      </div>

      {/* KPI Cards Grid */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Total Events"
            value={stats?.totalEvents || 0}
            icon={<CalendarOutlined />}
            color="#00629B"
            description="Active events registered"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Total Blogs"
            value={stats?.totalBlogs || 0}
            icon={<FileTextOutlined />}
            color="#2EC4B6"
            description="Published / Draft articles"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Total Registrations"
            value={stats?.totalRegistrations || 0}
            icon={<MailOutlined />}
            color="#00B5E2"
            description="Participants signed up"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <MetricCard
            title="Team Members"
            value={stats?.totalTeamMembers || 0}
            icon={<TeamOutlined />}
            color="#FFC72C"
            description="Executive committee roster"
          />
        </Col>
      </Row>

      {/* Analytics Charts & Activity lists */}
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={16}>
          <Card
            title="Event Registrations Trend"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
            }}
            styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
          >
            <div style={{ height: 320 }}>
              {charts?.registrationsTrend && charts.registrationsTrend.length > 0 ? (
                <Line data={regChartData} options={regChartOptions} />
              ) : (
                <Empty description="No registration analytics available." style={{ padding: '48px 0' }} />
              )}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Events by Category"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
            }}
            styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
          >
            <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {charts?.eventsByCategory && charts.eventsByCategory.length > 0 ? (
                <Doughnut data={categoryChartData} options={categoryChartOptions} />
              ) : (
                <Empty description="No categorizations recorded." style={{ padding: '48px 0' }} />
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title="Recent Activity"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)'
            }}
            styles={{
              header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' },
              body: { padding: '8px 24px' }
            }}
          >
            {activities.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={activities}
                renderItem={(item) => (
                  <List.Item
                    extra={
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {new Date(item.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background:
                              item.type === 'event'
                                ? 'rgba(0,98,155,0.1)'
                                : item.type === 'blog'
                                ? 'rgba(46,196,182,0.1)'
                                : 'rgba(0,181,226,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color:
                              item.type === 'event'
                                ? '#00629B'
                                : item.type === 'blog'
                                ? '#2EC4B6'
                                : '#00B5E2'
                          }}
                        >
                          {item.type === 'event' ? (
                            <CalendarOutlined />
                          ) : item.type === 'blog' ? (
                            <FileTextOutlined />
                          ) : (
                            <MessageOutlined />
                          )}
                        </div>
                      }
                      title={<span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{item.title}</span>}
                      description={<span style={{ color: 'var(--text-muted)' }}>{item.description}</span>}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No recent activities." style={{ padding: '32px 0' }} />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Quick Stats Overview"
            style={{
              background: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
              height: '100%'
            }}
            styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
          >
            <Space direction="vertical" size={18} style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-main)' }}>Pending Contact Enquiries</span>
                <Tag color={stats?.pendingContacts ? 'warning' : 'success'}>
                  {stats?.pendingContacts || 0} Queries
                </Tag>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-main)' }}>Total Uploaded Media Files</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                  {stats?.totalMediaFiles || 0} Files
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-main)' }}>Platform Environment</span>
                <Tag color="cyan">Production READY</Tag>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
