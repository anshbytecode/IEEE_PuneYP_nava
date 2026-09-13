import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Switch, Space, Modal, Form, Typography, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { announcementService, AnnouncementItem } from '../../services/announcementService';
import { TableSkeleton } from '../../components/Common/LoadingSkeleton';

const { Title } = Typography;

export const AnnouncementList: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await announcementService.getAnnouncements();
      if (res.success) {
        setAnnouncements(res.announcements);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load announcements ticker.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleToggleActive = async (record: AnnouncementItem, checked: boolean) => {
    try {
      const res = await announcementService.updateAnnouncement(record.id, {
        is_active: checked // Mapping camelCase database.
      });
      if (res.success) {
        message.success(`Announcement ${checked ? 'activated' : 'deactivated'}.`);
        fetchAnnouncements();
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to toggle active status.');
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleOpenEdit = (record: AnnouncementItem) => {
    setEditingItem(record);
    form.setFieldsValue({
      title: record.title,
      content: record.content,
      link: record.link,
      is_active: record.isActive
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await announcementService.deleteAnnouncement(id);
      if (res.success) {
        message.success('Announcement alert removed.');
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to delete announcement.');
    }
  };

  const onFinish = async (values: any) => {
    setSubmitLoading(true);
    try {
      if (editingItem) {
        // Edit Mode
        const res = await announcementService.updateAnnouncement(editingItem.id, {
          title: values.title,
          content: values.content,
          link: values.link || null,
          is_active: values.is_active
        });
        if (res.success) {
          message.success('Announcement updated successfully.');
          setModalVisible(false);
          fetchAnnouncements();
        }
      } else {
        // Create Mode
        const res = await announcementService.createAnnouncement({
          title: values.title,
          content: values.content,
          link: values.link || null,
          isActive: values.is_active !== undefined ? values.is_active : true
        });
        if (res.success) {
          message.success('Announcement alert registered.');
          setModalVisible(false);
          fetchAnnouncements();
        }
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to save announcement.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '10%',
      render: (active: boolean, record: AnnouncementItem) => (
        <Switch
          checked={active}
          onChange={(checked) => handleToggleActive(record, checked)}
        />
      )
    },
    {
      title: 'Announcement Info',
      dataIndex: 'title',
      key: 'title',
      width: '45%',
      render: (text: string, record: AnnouncementItem) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{text}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{record.content}</span>
        </Space>
      )
    },
    {
      title: 'Action Link',
      dataIndex: 'link',
      key: 'link',
      render: (text?: string) => (
        text ? (
          <a href={text} target="_blank" rel="noopener noreferrer" style={{ color: '#00B5E2', fontSize: '12px' }}>
            {text}
          </a>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>None</span>
        )
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: AnnouncementItem) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleOpenEdit(record)}
            style={{ color: '#00629B' }}
          />
          <Popconfirm
            title="Delete this announcement ticker?"
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

  if (loading && announcements.length === 0) {
    return <TableSkeleton />;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
          Homepage Announcements
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
          style={{ background: '#00629B', border: 'none', height: '40px', fontWeight: 600 }}
        >
          Add Announcement
        </Button>
      </div>

      <Table
        dataSource={announcements}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        loading={loading}
        style={{ background: 'var(--bg-surface)', borderRadius: '8px', overflow: 'hidden' }}
      />

      {/* Editor Modal */}
      <Modal
        title={
          <span style={{ color: 'var(--text-main)' }}>
            {editingItem ? 'Edit Announcement alert' : 'Add Announcement alert'}
          </span>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={submitLoading}
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ is_active: true }}
          style={{ paddingTop: 12 }}
        >
          <Form.Item
            name="title"
            label={<span style={{ color: 'var(--text-main)' }}>Alert Title</span>}
            rules={[{ required: true, message: 'Please enter title!' }]}
          >
            <Input placeholder="E.g., Call for IEEE Pune YP Volunteers 2026" />
          </Form.Item>

          <Form.Item
            name="content"
            label={<span style={{ color: 'var(--text-main)' }}>Alert Content / Ticker Text</span>}
            rules={[{ required: true, message: 'Please enter content!' }]}
          >
            <Input.TextArea placeholder="Enter details..." rows={3} />
          </Form.Item>

          <Form.Item
            name="link"
            label={<span style={{ color: 'var(--text-main)' }}>Target Link URL (Optional)</span>}
          >
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item
            name="is_active"
            label={<span style={{ color: 'var(--text-main)' }}>Status Active</span>}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
