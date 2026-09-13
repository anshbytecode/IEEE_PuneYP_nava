import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Tag, Card, Modal, Tooltip, message, Typography, Popconfirm } from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { eventService, EventItem } from '../../services/eventService';
import { TableSkeleton } from '../../components/Common/LoadingSkeleton';

const { Title } = Typography;

export const EventList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Registrations Modal State
  const [regModalVisible, setRegModalVisible] = useState(false);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regLoading, setRegLoading] = useState(false);

  const navigate = useNavigate();

  const fetchEvents = async (page = 1, currentSearch = search, currentCat = category, currentStatus = status) => {
    try {
      setLoading(true);
      const data = await eventService.getEvents({
        page,
        limit: pagination.pageSize,
        search: currentSearch || undefined,
        category: currentCat || undefined,
        status: currentStatus || undefined
      });

      if (data.success) {
        setEvents(data.events);
        setPagination(prev => ({
          ...prev,
          current: data.pagination.currentPage,
          total: data.pagination.totalItems
        }));
      }
    } catch (error) {
      console.error('Failed to load events:', error);
      message.error('Could not fetch events list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(1);
  }, [category, status]);

  const handleTableChange = (paginationInfo: any) => {
    fetchEvents(paginationInfo.current);
  };

  const handleSearch = () => {
    fetchEvents(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await eventService.deleteEvent(id);
      if (res.success) {
        message.success('Event soft-deleted successfully.');
        fetchEvents(pagination.current);
      }
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  const handleOpenRegistrations = async (eventId: string, title: string) => {
    setSelectedEventTitle(title);
    setRegModalVisible(true);
    setRegLoading(true);
    try {
      const data = await eventService.getRegistrations(eventId);
      if (data.success) {
        setRegistrations(data.registrations);
      }
    } catch (error) {
      console.error('Failed to load event registrations:', error);
      message.error('Failed to fetch event signups.');
    } finally {
      setRegLoading(false);
    }
  };

  const exportRegToCSV = () => {
    if (registrations.length === 0) return;
    
    let csv = 'Name,Email,Contact,Registered At\n';
    registrations.forEach(r => {
      const date = new Date(r.registeredAt).toISOString().split('T')[0];
      csv += `"${r.name}","${r.email}","${r.contact || ''}","${date}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedEventTitle.replace(/\s+/g, '_')}_registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = [
    {
      title: 'Event Title',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (text: string, record: EventItem) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{text}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{record.category}</span>
        </Space>
      )
    },
    {
      title: 'Event Date',
      dataIndex: 'eventDate',
      key: 'eventDate',
      render: (dateStr: string) => {
        const d = new Date(dateStr);
        return <span style={{ color: 'var(--text-main)' }}>{d.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>;
      }
    },
    {
      title: 'Venue',
      dataIndex: 'venue',
      key: 'venue',
      render: (text: string) => <span style={{ color: 'var(--text-main)' }}>{text}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => (
        <Tag color={text === 'Upcoming' ? 'cyan' : 'default'}>
          {text.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Signups',
      dataIndex: 'registration_count',
      key: 'registration_count',
      align: 'center' as const,
      render: (count: number, record: EventItem) => (
        <Button
          type="text"
          icon={<TeamOutlined />}
          onClick={() => handleOpenRegistrations(record.id, record.title)}
          style={{ color: '#00629B', fontWeight: 600 }}
        >
          {count || 0}
        </Button>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: EventItem) => (
        <Space size="middle">
          <Tooltip title="Edit Event">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/events/edit/${record.id}`)}
              style={{ color: '#00B5E2' }}
            />
          </Tooltip>
          
          <Tooltip title="Soft Delete">
            <Popconfirm
              title="Are you sure you want to delete this event? (This can be reversed)"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  if (loading && events.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
            Event Management
          </Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/events/new')}
          style={{ background: '#00629B', border: 'none', height: '40px', fontWeight: 600 }}
        >
          Create Event
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          marginBottom: '24px'
        }}
        styles={{ body: { padding: '16px' } }}
      >
        <Space direction="horizontal" size={16} style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Space size={12} style={{ flexWrap: 'wrap' }}>
            <Input
              placeholder="Search title, venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 220, background: 'transparent', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
              suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />}
            />
            
            <Select
              placeholder="Category"
              value={category}
              onChange={setCategory}
              allowClear
              style={{ width: 140 }}
              styles={{ popup: { root: { background: 'var(--bg-surface)' } } }}
            >
              <Select.Option value="Workshop">Workshop</Select.Option>
              <Select.Option value="Seminar">Seminar</Select.Option>
              <Select.Option value="Conference">Conference</Select.Option>
              <Select.Option value="Social">Social</Select.Option>
            </Select>

            <Select
              placeholder="Status"
              value={status}
              onChange={setStatus}
              allowClear
              style={{ width: 140 }}
            >
              <Select.Option value="Upcoming">Upcoming</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
            </Select>
          </Space>
          
          <Button onClick={() => { setSearch(''); setCategory(undefined); setStatus(undefined); fetchEvents(1, '', undefined, undefined); }}>
            Reset Filters
          </Button>
        </Space>
      </Card>

      {/* Events Table */}
      <Table
        dataSource={events}
        columns={columns}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false
        }}
        loading={loading}
        onChange={handleTableChange}
        style={{ background: 'var(--bg-surface)', borderRadius: '8px', overflow: 'hidden' }}
      />

      {/* Registrations Modal */}
      <Modal
        title={
          <div style={{ color: 'var(--text-main)' }}>
            Signups for: <strong>{selectedEventTitle}</strong>
          </div>
        }
        open={regModalVisible}
        onCancel={() => setRegModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setRegModalVisible(false)}>
            Close
          </Button>,
          <Button
            key="export"
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={exportRegToCSV}
            disabled={registrations.length === 0}
            style={{ background: '#2ec4b6', border: 'none' }}
          >
            Export CSV
          </Button>
        ]}
        width={700}
        styles={{ body: { maxHeight: '450px', overflowY: 'auto' } }}
      >
        <Table
          dataSource={registrations}
          rowKey="id"
          loading={regLoading}
          size="small"
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              key: 'name',
              render: (text: string) => <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{text}</span>
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
              render: (text: string) => <span style={{ color: 'var(--text-main)' }}>{text}</span>
            },
            {
              title: 'Contact',
              dataIndex: 'contact',
              key: 'contact',
              render: (text: string) => <span style={{ color: 'var(--text-muted)' }}>{text || 'N/A'}</span>
            },
            {
              title: 'Signup Date',
              dataIndex: 'registeredAt',
              key: 'registeredAt',
              render: (dateStr: string) => {
                const d = new Date(dateStr);
                return <span style={{ color: 'var(--text-muted)' }}>{d.toLocaleDateString(undefined, { dateStyle: 'short' })}</span>;
              }
            }
          ]}
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </div>
  );
};
