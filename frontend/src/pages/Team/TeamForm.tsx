import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Space, Card, Upload, Typography, message, Spin, Row, Col, AutoComplete } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { teamService } from '../../services/teamService';

const { Title } = Typography;

export const TeamForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Profile Image Preview
  const [existingPhoto, setExistingPhoto] = useState('');
  const [photoFileList, setPhotoFileList] = useState<any[]>([]);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchMemberDetails = async () => {
        try {
          setLoading(true);
          const res = await teamService.getTeam();
          if (res.success && res.teamMembers) {
            const member = res.teamMembers.find(m => m.id === id);
            if (member) {
              form.setFieldsValue({
                name: member.name,
                position: member.position,
                affiliation: member.affiliation,
                contact: member.contact,
                linkedin_url: member.linkedinUrl,
                order_index: member.orderIndex
              });
              setExistingPhoto(member.profileImageUrl);
            } else {
              message.error('Member details not found.');
              navigate('/team');
            }
          }
        } catch (error) {
          console.error(error);
          message.error('Failed to load team member details.');
          navigate('/team');
        } finally {
          setLoading(false);
        }
      };
      fetchMemberDetails();
    }
  }, [id, isEditMode]);

  const onFinish = async (values: any) => {
    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('position', values.position);
      formData.append('order_index', String(values.order_index || 0));
      
      if (values.affiliation) formData.append('affiliation', values.affiliation);
      if (values.contact) formData.append('contact', values.contact);
      if (values.linkedin_url) formData.append('linkedin_url', values.linkedin_url);

      // Add profile photo
      if (photoFileList.length > 0) {
        formData.append('profileImage', photoFileList[0].originFileObj);
      }

      if (isEditMode && id) {
        const res = await teamService.updateMember(id, formData);
        if (res.success) {
          message.success('Team member profile updated!');
          navigate('/team');
        }
      } else {
        const res = await teamService.createMember(formData);
        if (res.success) {
          message.success('Team member profile created successfully!');
          navigate('/team');
        }
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to submit profile.';
      message.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '16px' }}>
        <Spin size="large" />
        <div style={{ color: 'var(--text-muted)' }}>Loading team profile form...</div>
      </div>
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/team')}>
          Back to List
        </Button>
      </Space>

      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
          {isEditMode ? 'Edit Team Member Profile' : 'Add Executive Team Member'}
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ order_index: 0 }}
        size="large"
      >
        <Row gutter={24}>
          <Col xs={24} md={16}>
            <Card
              title="Personal Parameters"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', marginBottom: 24 }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              <Form.Item
                name="name"
                label={<span style={{ color: 'var(--text-main)' }}>Full Name</span>}
                rules={[{ required: true, message: 'Please enter name!' }]}
              >
                <Input placeholder="Enter member name..." style={{ color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
              </Form.Item>

              <Form.Item
                name="position"
                label={<span style={{ color: 'var(--text-main)' }}>Position / ExeCom Role</span>}
                rules={[{ required: true, message: 'Please enter position!' }]}
              >
                <AutoComplete
                  placeholder="E.g., Chairperson, Secretary, Webmaster..."
                  options={[
                    { value: 'Chairperson' },
                    { value: 'Vice Chairperson' },
                    { value: 'Secretary' },
                    { value: 'Treasurer' },
                    { value: 'Technical Activities Lead' },
                    { value: 'Membership Development Lead' },
                    { value: 'Webmaster & Digital Media Lead' },
                    { value: 'Student Branch Coordinator' },
                    { value: 'Industry Relations Lead' },
                    { value: 'Executive Member' }
                  ]}
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                name="affiliation"
                label={<span style={{ color: 'var(--text-main)' }}>Affiliation / College / Organization</span>}
              >
                <Input placeholder="E.g. COEP Technological University" style={{ color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="contact"
                    label={<span style={{ color: 'var(--text-main)' }}>Contact Phone/Email</span>}
                  >
                    <Input placeholder="E.g. contact@domain.com" style={{ color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
                  </Form.Item>
                </Col>
                
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="linkedin_url"
                    label={<span style={{ color: 'var(--text-main)' }}>LinkedIn Profile URL</span>}
                  >
                    <Input placeholder="https://linkedin.com/in/..." style={{ color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              title="Profile Image"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', marginBottom: 24 }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              {existingPhoto && (
                <div style={{ marginBottom: 16, textAlign: 'center', border: '1px solid var(--border-color)', padding: 12, borderRadius: '8px' }}>
                  <img src={existingPhoto} alt="Profile Preview" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ fontSize: 11, marginTop: 6, color: 'var(--text-muted)' }}>Current Profile Photo</div>
                </div>
              )}
              <Form.Item required={false}>
                <Upload.Dragger
                  maxCount={1}
                  fileList={photoFileList}
                  onChange={({ fileList }) => setPhotoFileList(fileList)}
                  beforeUpload={() => false}
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon"><UserOutlined style={{ fontSize: 24 }} /></p>
                  <p className="ant-upload-text" style={{ color: 'var(--text-main)', fontSize: '13px' }}>Select headshot photo</p>
                  <p className="ant-upload-hint" style={{ color: 'var(--text-muted)', fontSize: 11 }}>JPEG, PNG format up to 10MB</p>
                </Upload.Dragger>
              </Form.Item>
            </Card>

            <Card
              title="Ordering Settings"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', marginBottom: 24 }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              <Form.Item
                name="order_index"
                label={<span style={{ color: 'var(--text-main)' }}>Sort Order Index</span>}
                rules={[{ required: true, message: 'Please specify ordering index!' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Card>

            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={submitLoading}
              block
              style={{ height: '50px', background: '#00629B', border: 'none', fontWeight: 600, fontSize: '15px' }}
            >
              Save Profile Parameters
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
