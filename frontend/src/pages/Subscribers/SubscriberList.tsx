import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, message } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { newsletterService, SubscriberItem } from '../../services/newsletterService';
import { TableSkeleton } from '../../components/Common/LoadingSkeleton';

const { Title } = Typography;

export const SubscriberList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  const fetchSubscribers = async (page = 1) => {
    try {
      setLoading(true);
      const data = await newsletterService.getSubscribers({
        page,
        limit: pagination.pageSize
      });

      if (data.success) {
        setSubscribers(data.subscribers);
        setPagination(prev => ({
          ...prev,
          current: data.pagination.currentPage,
          total: data.pagination.totalItems
        }));
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to retrieve subscribers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(1);
  }, []);

  const handleTableChange = (paginationInfo: any) => {
    fetchSubscribers(paginationInfo.current);
  };

  const handleExportCSV = async () => {
    setExportLoading(true);
    try {
      const blob = await newsletterService.exportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'newsletter_subscribers.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      message.success('Subscribers CSV generated and downloaded!');
    } catch (err) {
      console.error(err);
      message.error('Failed to export subscriber database.');
    } finally {
      setExportLoading(false);
    }
  };

  const columns = [
    {
      title: 'Subscriber Email',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{text}</span>
    },
    {
      title: 'Subscribed On',
      dataIndex: 'subscribedAt',
      key: 'subscribedAt',
      render: (dateStr: string) => {
        const d = new Date(dateStr);
        return <span style={{ color: 'var(--text-muted)' }}>{d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>;
      }
    }
  ];

  if (loading && subscribers.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
            Newsletter Subscribers
          </Title>
        </div>
        <Button
          type="primary"
          icon={<FileExcelOutlined />}
          onClick={handleExportCSV}
          loading={exportLoading}
          disabled={subscribers.length === 0}
          style={{ background: '#2ec4b6', border: 'none', height: '40px', fontWeight: 600 }}
        >
          Export Database CSV
        </Button>
      </div>

      <Table
        dataSource={subscribers}
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
    </div>
  );
};
