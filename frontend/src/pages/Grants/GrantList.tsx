import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Space, Tag, Modal, Form, message, Card, Typography, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, TrophyOutlined, ReloadOutlined } from '@ant-design/icons';
import { grantService, GrantItem } from '../../services/grantService';

const { Title, Text } = Typography;
const { Option } = Select;

export const GrantList: React.FC = () => {
  const [grants, setGrants] = useState<GrantItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrant, setEditingGrant] = useState<GrantItem | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchGrants = async () => {
    try {
      setLoading(true);
      const res = await grantService.getGrants(selectedCategory, searchText);
      if (res.success && res.grants) {
        setGrants(res.grants);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to fetch grants and awards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, [selectedCategory]);

  const handleSearch = () => {
    fetchGrants();
  };

  const handleOpenCreateModal = () => {
    setEditingGrant(null);
    form.resetFields();
    form.setFieldsValue({
      category: 'Grants & Funding',
      status: 'Active Grant',
      icon: 'Award',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (grant: GrantItem) => {
    setEditingGrant(grant);
    form.setFieldsValue({
      title: grant.title,
      category: grant.category,
      organization: grant.organization,
      amount: grant.amount,
      year: grant.year,
      status: grant.status,
      icon: grant.icon,
      description: grant.description,
      impact: grant.impact,
      badgeColor: grant.badgeColor,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setGrants(prev => prev.filter(g => g.id !== id));
      const res = await grantService.deleteGrant(id);
      if (res.success) {
        message.success('Grant or award deleted successfully');
        fetchGrants();
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to delete entry');
      fetchGrants();
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      setSubmitLoading(true);
      if (editingGrant) {
        const res = await grantService.updateGrant(editingGrant.id, values);
        if (res.success) {
          message.success('Grant or award updated successfully!');
          setIsModalOpen(false);
          fetchGrants();
        }
      } else {
        const res = await grantService.createGrant(values);
        if (res.success) {
          message.success('New Grant or award created successfully!');
          setIsModalOpen(false);
          fetchGrants();
        }
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: GrantItem) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>{text}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.organization}</Text>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => {
        let color = 'blue';
        if (cat === 'Awards & Recognition') color = 'gold';
        if (cat === 'Sponsorships') color = 'cyan';
        if (cat === 'Grants & Funding') color = 'green';
        return <Tag color={color}>{cat}</Tag>;
      },
    },
    {
      title: 'Value / Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: string) => <strong>{amount}</strong>,
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <Tag color="blue">{status}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: GrantItem) => (
        <Space size="middle">
          <Tooltip title="Edit Entry">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#0284c7' }} />}
              onClick={() => handleOpenEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Grant / Award?"
            description={`Are you sure you want to delete "${record.title}"?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Entry">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrophyOutlined style={{ color: '#00629B' }} /> Grants & Awards Management
          </Title>
          <Text type="secondary">Manage global IEEE funding, research grants, and regional awards.</Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ backgroundColor: '#00629B', borderRadius: '8px' }}
          onClick={handleOpenCreateModal}
        >
          Add Grant / Award
        </Button>
      </div>

      {/* Filters Bar */}
      <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
        <Space flex-wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="Search title or organization..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 280, borderRadius: '8px' }}
            />
            <Select
              value={selectedCategory}
              onChange={(val) => setSelectedCategory(val)}
              style={{ width: 200, borderRadius: '8px' }}
            >
              <Option value="All">All Categories</Option>
              <Option value="Grants & Funding">Grants & Funding</Option>
              <Option value="Awards & Recognition">Awards & Recognition</Option>
              <Option value="Sponsorships">Sponsorships</Option>
            </Select>
            <Button icon={<SearchOutlined />} onClick={handleSearch}>
              Search
            </Button>
          </Space>

          <Button icon={<ReloadOutlined />} onClick={fetchGrants}>
            Refresh
          </Button>
        </Space>
      </Card>

      {/* Grants Table */}
      <Card style={{ borderRadius: '12px' }}>
        <Table
          columns={columns}
          dataSource={grants}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={editingGrant ? 'Edit Grant / Award' : 'Add New Grant / Award'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          style={{ marginTop: '16px' }}
        >
          <Form.Item
            name="title"
            label="Grant / Award Title"
            rules={[{ required: true, message: 'Please enter title' }]}
          >
            <Input placeholder="e.g. IEEE CODEBhoomi Rural Literacy Grant" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Grants & Funding">Grants & Funding</Option>
                <Option value="Awards & Recognition">Awards & Recognition</Option>
                <Option value="Sponsorships">Sponsorships</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status Tag"
              rules={[{ required: true }]}
            >
              <Input placeholder="e.g. Active Grant, Award Winner" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="organization"
              label="Granting Body / Organization"
              rules={[{ required: true, message: 'Please enter organization' }]}
            >
              <Input placeholder="e.g. IEEE HAC / IEEE Region 10" />
            </Form.Item>

            <Form.Item
              name="amount"
              label="Amount / Award Value"
              rules={[{ required: true, message: 'Please enter value' }]}
            >
              <Input placeholder="e.g. USD $5,000 or Regional Trophy" />
            </Form.Item>
          </div>

          <Form.Item
            name="year"
            label="Year / Tenure"
            rules={[{ required: true, message: 'Please enter year' }]}
          >
            <Input placeholder="e.g. 2024 – 2026" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Detailed explanation of the grant or award..." />
          </Form.Item>

          <Form.Item name="impact" label="Impact / Outcome Highlight">
            <Input placeholder="e.g. Impacted 1,200+ rural students" />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitLoading} style={{ backgroundColor: '#00629B' }}>
              {editingGrant ? 'Update Entry' : 'Create Entry'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
