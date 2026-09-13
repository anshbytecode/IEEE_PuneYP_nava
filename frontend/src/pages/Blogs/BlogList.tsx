import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Tag, Typography, message, Popconfirm, Tooltip, Card } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { blogService, BlogItem } from '../../services/blogService';
import { TableSkeleton } from '../../components/Common/LoadingSkeleton';

const { Title } = Typography;

export const BlogList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [tag, setTag] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const navigate = useNavigate();

  const fetchBlogs = async (page = 1, currentSearch = search, currentStatus = status, currentTag = tag) => {
    try {
      setLoading(true);
      const data = await blogService.getBlogs({
        page,
        limit: pagination.pageSize,
        search: currentSearch || undefined,
        status: currentStatus || undefined,
        tag: currentTag || undefined
      });

      if (data.success) {
        setBlogs(data.blogs);
        setPagination(prev => ({
          ...prev,
          current: data.pagination.currentPage,
          total: data.pagination.totalItems
        }));
      }
    } catch (error) {
      console.error('Failed to load blogs:', error);
      message.error('Failed to fetch blog posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(1);
  }, [status]);

  const handleTableChange = (paginationInfo: any) => {
    fetchBlogs(paginationInfo.current);
  };

  const handleSearch = () => {
    fetchBlogs(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await blogService.deleteBlog(id);
      if (res.success) {
        message.success('Blog article deleted successfully.');
        fetchBlogs(pagination.current);
      }
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'Failed to delete blog article.');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '35%',
      render: (text: string, record: BlogItem) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{text}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            By: {record.author_name || 'System Admin'}
          </span>
        </Space>
      )
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {(tags || []).map((t, idx) => (
            <Tag key={idx} color="blue" style={{ fontSize: '10px' }}>
              {t}
            </Tag>
          ))}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'publishStatus',
      key: 'publishStatus',
      render: (statusVal: string) => (
        <Tag color={statusVal === 'Published' ? 'success' : 'warning'}>
          {statusVal.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Created At',
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
      render: (_: any, record: BlogItem) => (
        <Space size="middle">
          <Tooltip title="Edit Post">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/blogs/edit/${record.id}`)}
              style={{ color: '#00B5E2' }}
            />
          </Tooltip>
          
          <Tooltip title="Delete Post">
            <Popconfirm
              title="Are you sure you want to permanently delete this blog post?"
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

  if (loading && blogs.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
          Blog Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/blogs/new')}
          style={{ background: '#00629B', border: 'none', height: '40px', fontWeight: 600 }}
        >
          Create Blog Post
        </Button>
      </div>

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
              placeholder="Search title, content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 200, background: 'transparent', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
              suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />}
            />
            
            <Input
              placeholder="Filter by tag..."
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 140, background: 'transparent', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
              suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />}
            />

            <Select
              placeholder="Status"
              value={status}
              onChange={setStatus}
              allowClear
              style={{ width: 130 }}
            >
              <Select.Option value="Published">Published</Select.Option>
              <Select.Option value="Draft">Draft</Select.Option>
            </Select>
          </Space>

          <Button onClick={() => { setSearch(''); setTag(''); setStatus(undefined); fetchBlogs(1, '', undefined, ''); }}>
            Reset Filters
          </Button>
        </Space>
      </Card>

      <Table
        dataSource={blogs}
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
