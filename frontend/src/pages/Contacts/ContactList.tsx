import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Modal, Typography, Select, message } from 'antd';
import { EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { contactService, ContactItem } from '../../services/contactService';
import { TableSkeleton } from '../../components/Common/LoadingSkeleton';

const { Title, Text, Paragraph } = Typography;

export const ContactList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [isResolvedFilter, setIsResolvedFilter] = useState<string | undefined>('false'); // Default to unresolved queries
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Modal details
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchContacts = async (page = 1, filterVal = isResolvedFilter) => {
    try {
      setLoading(true);
      const data = await contactService.getContacts({
        page,
        limit: pagination.pageSize,
        is_resolved: filterVal || undefined
      });

      if (data.success) {
        setContacts(data.contacts);
        setPagination(prev => ({
          ...prev,
          current: data.pagination.currentPage,
          total: data.pagination.totalItems
        }));
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load contact inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(1);
  }, [isResolvedFilter]);

  const handleTableChange = (paginationInfo: any) => {
    fetchContacts(paginationInfo.current);
  };

  const handleOpenDetail = (record: ContactItem) => {
    setSelectedContact(record);
    setModalVisible(true);
  };

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      const res = await contactService.resolveContact(id);
      if (res.success) {
        message.success('Query marked as resolved.');
        // Update local modal if open
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact(prev => prev ? { ...prev, isResolved: true } : null);
        }
        fetchContacts(pagination.current);
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to resolve query.');
    } finally {
      setResolvingId(null);
    }
  };

  const columns = [
    {
      title: 'Sender',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: ContactItem) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{text}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{record.email}</span>
        </Space>
      )
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text?: string) => <span style={{ color: 'var(--text-main)' }}>{text || 'No Subject'}</span>
    },
    {
      title: 'Status',
      dataIndex: 'isResolved',
      key: 'isResolved',
      render: (resolved: boolean) => (
        <Tag color={resolved ? 'success' : 'warning'}>
          {resolved ? 'RESOLVED' : 'PENDING'}
        </Tag>
      )
    },
    {
      title: 'Received On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (dateStr: string) => {
        const d = new Date(dateStr);
        return <span style={{ color: 'var(--text-muted)' }}>{d.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ContactItem) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleOpenDetail(record)}
            style={{ color: '#00629B' }}
          >
            Read
          </Button>
          
          {!record.isResolved && (
            <Button
              type="text"
              icon={<CheckCircleOutlined />}
              onClick={() => handleResolve(record.id)}
              loading={resolvingId === record.id}
              style={{ color: '#2ec4b6' }}
            >
              Resolve
            </Button>
          )}
        </Space>
      )
    }
  ];

  if (loading && contacts.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
          Contact Requests
        </Title>
        <Select
          value={isResolvedFilter}
          onChange={setIsResolvedFilter}
          style={{ width: 180 }}
        >
          <Select.Option value="false">Pending Queries</Select.Option>
          <Select.Option value="true">Resolved Queries</Select.Option>
          <Select.Option value="">All Queries</Select.Option>
        </Select>
      </div>

      <Table
        dataSource={contacts}
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

      {/* Query Detail Modal */}
      <Modal
        title={<span style={{ color: 'var(--text-main)', fontWeight: 700, fontSize: '16px' }}>Message Details</span>}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
          selectedContact && !selectedContact.isResolved && (
            <Button
              key="resolve"
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleResolve(selectedContact.id)}
              loading={resolvingId === selectedContact.id}
              style={{ background: 'linear-gradient(90deg, var(--color-ieee-primary) 0%, var(--color-ieee-teal) 100%)', border: 'none' }}
            >
              Mark Resolved
            </Button>
          )
        ]}
        width={600}
      >
        {selectedContact && (
          <Space direction="vertical" size={18} style={{ width: '100%', paddingTop: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Sender</Text>
                <Text strong style={{ fontSize: 15, color: 'var(--text-main)', display: 'block', marginTop: 2 }}>{selectedContact.name}</Text>
                <Text type="secondary" style={{ display: 'block', fontSize: 13, marginTop: 1 }}>{selectedContact.email}</Text>
              </div>
              
              <div>
                <Text type="secondary" style={{ fontSize: 11, display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Received On</Text>
                <Text style={{ display: 'block', color: 'var(--text-main)', fontSize: 14, fontWeight: 550, marginTop: 4 }}>
                  {new Date(selectedContact.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Tag color={selectedContact.isResolved ? 'success' : 'warning'} style={{ borderRadius: '4px', fontWeight: 600 }}>
                    {selectedContact.isResolved ? 'RESOLVED' : 'PENDING'}
                  </Tag>
                </div>
              </div>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 11, display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Subject</Text>
              <Text strong style={{ color: 'var(--text-main)', fontSize: 14, display: 'block', marginTop: 2 }}>{selectedContact.subject || 'No Subject'}</Text>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: 11, display: 'block', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', marginBottom: 6 }}>Message Body</Text>
              <div style={{
                background: 'var(--bg-base)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px 20px',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)'
              }}>
                <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6' }}>
                  {selectedContact.message}
                </Paragraph>
              </div>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};
