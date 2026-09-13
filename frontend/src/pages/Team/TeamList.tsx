import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Avatar, InputNumber, Typography, message, Popconfirm, Modal, Form, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { teamService, TeamMemberItem, ChairMessageItem } from '../../services/teamService';
import { TableSkeleton } from '../../components/Common/LoadingSkeleton';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const TeamList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamMemberItem[]>([]);
  const [orderChanges, setOrderChanges] = useState<{ [id: string]: number }>({});
  const [savingOrder, setSavingOrder] = useState(false);

  // Chair Message Modal state
  const [isChairModalOpen, setIsChairModalOpen] = useState(false);
  const [chairLoading, setChairLoading] = useState(false);
  const [chairSubmitLoading, setChairSubmitLoading] = useState(false);
  const [chairForm] = Form.useForm();

  const navigate = useNavigate();

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await teamService.getTeam();
      if (res.success) {
        setTeam(res.teamMembers);
        setOrderChanges({});
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load team roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openChairModal = async () => {
    setIsChairModalOpen(true);
    try {
      setChairLoading(true);
      const res = await teamService.getChairMessage();
      if (res.success && res.chairMessage) {
        chairForm.setFieldsValue(res.chairMessage);
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch current chair message');
    } finally {
      setChairLoading(false);
    }
  };

  const handleSaveChairMessage = async (values: Partial<ChairMessageItem>) => {
    try {
      setChairSubmitLoading(true);
      const res = await teamService.updateChairMessage(values);
      if (res.success) {
        message.success('Message from Chair updated successfully!');
        setIsChairModalOpen(false);
      }
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'Failed to update chair message');
    } finally {
      setChairSubmitLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await teamService.deleteMember(id);
      if (res.success) {
        message.success('Team member profile deleted.');
        fetchTeam();
      }
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'Failed to delete member.');
    }
  };

  const handleOrderChange = (id: string, val: number | null) => {
    if (val === null) return;
    setOrderChanges(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const saveOrderReindexing = async () => {
    const payloads = Object.keys(orderChanges).map(id => ({
      id,
      order_index: orderChanges[id]
    }));

    if (payloads.length === 0) return;

    setSavingOrder(true);
    try {
      const res = await teamService.reorderTeam(payloads);
      if (res.success) {
        message.success('Team member indexes saved successfully!');
        fetchTeam();
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to save team sorting indices.');
    } finally {
      setSavingOrder(false);
    }
  };

  const columns = [
    {
      title: 'Order Index',
      dataIndex: 'orderIndex',
      key: 'orderIndex',
      width: '15%',
      sorter: (a: TeamMemberItem, b: TeamMemberItem) => a.orderIndex - b.orderIndex,
      render: (index: number, record: TeamMemberItem) => (
        <InputNumber
          min={0}
          value={orderChanges[record.id] !== undefined ? orderChanges[record.id] : index}
          onChange={(val) => handleOrderChange(record.id, val)}
          style={{ width: 70 }}
        />
      )
    },
    {
      title: 'Member',
      key: 'member',
      render: (_: any, record: TeamMemberItem) => (
        <Space size="middle">
          <Avatar src={record.profileImageUrl} size={48} shape="square" />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{record.position}</div>
            {record.affiliation && (
              <div style={{ fontSize: '11px', color: '#00B5E2' }}>{record.affiliation}</div>
            )}
          </div>
        </Space>
      )
    },
    {
      title: 'Contact',
      dataIndex: 'contact',
      key: 'contact',
      render: (contact: string) => <span style={{ color: 'var(--text-muted)' }}>{contact || 'N/A'}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_: any, record: TeamMemberItem) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/team/edit/${record.id}`)}
            style={{ color: '#00B5E2' }}
          />
          
          <Popconfirm
            title="Are you sure you want to remove this team member?"
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
        </Space>
      )
    }
  ];

  if (loading && team.length === 0) {
    return <TableSkeleton />;
  }

  const hasOrderChanges = Object.keys(orderChanges).length > 0;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
            Executive Committee & Team Roster
          </Title>
          <Text type="secondary" style={{ fontSize: '13px' }}>
            Manage ExeCom office bearers, coordinators, and the official Message from the Chair.
          </Text>
        </div>

        <Space wrap>
          <Button
            icon={<MessageOutlined />}
            onClick={openChairModal}
            style={{ borderColor: '#00629B', color: '#00629B', height: '40px', fontWeight: 600 }}
          >
            Edit Message from Chair
          </Button>

          {hasOrderChanges && (
            <Button
              icon={<SaveOutlined />}
              onClick={saveOrderReindexing}
              loading={savingOrder}
              style={{ background: '#2ec4b6', border: 'none', color: '#FFF', height: '40px' }}
            >
              Save Order
            </Button>
          )}

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/team/new')}
            style={{ background: '#00629B', border: 'none', height: '40px', fontWeight: 600 }}
          >
            Add Team Member
          </Button>
        </Space>
      </div>

      <Table
        dataSource={team}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading}
        style={{ background: 'var(--bg-surface)', borderRadius: '8px', overflow: 'hidden' }}
      />

      {/* Edit Message from Chair Modal */}
      <Modal
        title="Edit Official Message from the Chair"
        open={isChairModalOpen}
        onCancel={() => setIsChairModalOpen(false)}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={chairForm}
          layout="vertical"
          onFinish={handleSaveChairMessage}
          style={{ marginTop: 16 }}
          disabled={chairLoading}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              name="name"
              label="Chairperson Name"
              rules={[{ required: true, message: 'Please enter Chair name' }]}
            >
              <Input placeholder="e.g. Dr. Amar Buchade" />
            </Form.Item>

            <Form.Item
              name="position"
              label="Position / Title"
              rules={[{ required: true, message: 'Please enter position' }]}
            >
              <Input placeholder="e.g. Chairperson, IEEE Pune Section YP AG" />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="affiliation" label="Affiliation / Institute">
              <Input placeholder="e.g. PICT Pune / IEEE Pune Section" />
            </Form.Item>

            <Form.Item name="photoUrl" label="Chair Photo URL">
              <Input placeholder="https://images.unsplash.com/photo-..." />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item name="email" label="Contact Email">
              <Input placeholder="e.g. chair.yp@ieee.org" />
            </Form.Item>

            <Form.Item name="linkedinUrl" label="LinkedIn Profile URL">
              <Input placeholder="https://linkedin.com/in/..." />
            </Form.Item>
          </div>

          <Form.Item
            name="title"
            label="Message Heading"
            rules={[{ required: true, message: 'Please enter message heading' }]}
          >
            <Input placeholder="e.g. Fostering Next-Generation Engineering Leadership" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message Content"
            rules={[{ required: true, message: 'Please enter the chair message' }]}
          >
            <TextArea rows={5} placeholder="Write the full address from the Chairperson..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button onClick={() => setIsChairModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={chairSubmitLoading}
              style={{ background: '#00629B' }}
            >
              Save Message
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};
