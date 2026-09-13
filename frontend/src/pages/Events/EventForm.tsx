import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, Space, Card, Upload, Row, Col, Typography, message, Spin } from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { RichTextEditor } from '../../components/Common/RichTextEditor';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const sdgOptions = [
  'SDG 1 - No Poverty',
  'SDG 2 - Zero Hunger',
  'SDG 3 - Good Health and Well-being',
  'SDG 4 - Quality Education',
  'SDG 5 - Gender Equality',
  'SDG 6 - Clean Water and Sanitation',
  'SDG 7 - Affordable and Clean Energy',
  'SDG 8 - Decent Work and Economic Growth',
  'SDG 9 - Industry, Innovation and Infrastructure',
  'SDG 10 - Reduced Inequality',
  'SDG 11 - Sustainable Cities and Communities',
  'SDG 12 - Responsible Consumption and Production',
  'SDG 13 - Climate Action',
  'SDG 14 - Life Below Water',
  'SDG 15 - Life on Land',
  'SDG 16 - Peace & Justice Strong Institutions',
  'SDG 17 - Partnerships for the Goals'
];

export const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fullDescription, setFullDescription] = useState('');
  const [locationMode, setLocationMode] = useState<'Online' | 'Offline'>('Offline');

  // Current media URLs (Edit mode)
  const [existingBanner, setExistingBanner] = useState('');
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);
  
  // File inputs
  const [bannerFileList, setBannerFileList] = useState<any[]>([]);
  const [galleryFileList, setGalleryFileList] = useState<any[]>([]);
  const [videoFileList, setVideoFileList] = useState<any[]>([]);
  const [deleteVideoFlag, setDeleteVideoFlag] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchEventDetails = async () => {
        try {
          setLoading(true);
          const res = await eventService.getEventById(id);
          if (res.success && res.event) {
            const event = res.event;
            const isOnline = event.venue === 'Online';
            setLocationMode(isOnline ? 'Online' : 'Offline');
            form.setFieldsValue({
              title: event.title,
              short_description: event.shortDescription,
              event_date: event.eventDate ? dayjs(event.eventDate) : null,
              venue_mode: isOnline ? 'Online' : 'Offline',
              venue: isOnline ? '' : event.venue,
              registration_link: event.registrationLink,
              sdg_alignment: event.sdgAlignment,
              category: event.category,
              status: event.status,
            });
            setFullDescription(event.fullDescription);
            setExistingBanner(event.bannerUrl);
            setExistingGallery(event.galleryUrls || []);
            setExistingVideo(event.videoUrl || null);
          }
        } catch (error) {
          console.error(error);
          message.error('Failed to load event details.');
          navigate('/events');
        } finally {
          setLoading(false);
        }
      };
      fetchEventDetails();
    }
  }, [id, isEditMode]);

  const removeExistingGalleryImage = (url: string) => {
    setExistingGallery(prev => prev.filter(img => img !== url));
  };

  const handleRemoveExistingVideo = () => {
    setExistingVideo(null);
    setDeleteVideoFlag(true);
  };

  const onFinish = async (values: any) => {
    if (!isEditMode && bannerFileList.length === 0) {
      message.error('Please upload an event banner image.');
      return;
    }
    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('short_description', values.short_description);
      formData.append('full_description', fullDescription);
      
      if (values.event_date) {
        formData.append('event_date', values.event_date.toISOString());
      }
      
      const venueValue = values.venue_mode === 'Online' ? 'Online' : values.venue;
      formData.append('venue', venueValue || 'Online');
      formData.append('category', values.category);
      formData.append('status', values.status || 'Upcoming');
      
      if (values.registration_link) {
        formData.append('registration_link', values.registration_link);
      }
      
      if (values.sdg_alignment) {
        formData.append('sdg_alignment', JSON.stringify(values.sdg_alignment));
      }

      // Add Files
      if (bannerFileList.length > 0) {
        formData.append('banner', bannerFileList[0].originFileObj);
      }
      
      galleryFileList.forEach(file => {
        formData.append('gallery', file.originFileObj);
      });
      
      if (videoFileList.length > 0) {
        formData.append('video', videoFileList[0].originFileObj);
      }

      if (isEditMode && id) {
        // Send existing gallery URLs to keep
        formData.append('existing_gallery_urls', JSON.stringify(existingGallery));
        if (deleteVideoFlag) {
          formData.append('delete_video', 'true');
        }
        
        const res = await eventService.updateEvent(id, formData);
        if (res.success) {
          message.success('Event updated successfully!');
          navigate('/events');
        }
      } else {
        const res = await eventService.createEvent(formData);
        if (res.success) {
          message.success('Event created successfully!');
          navigate('/events');
        }
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to submit form.';
      message.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '16px' }}>
        <Spin size="large" />
        <div style={{ color: 'var(--text-muted)' }}>Loading event form details...</div>
      </div>
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/events')}>
          Back to List
        </Button>
      </Space>

      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
          {isEditMode ? 'Edit Event Details' : 'Register New Event'}
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'Upcoming' }}
        size="large"
      >
        <Row gutter={24}>
          {/* Main Info */}
          <Col xs={24} lg={16}>
            <Card
              title="Event Parameters"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', marginBottom: 24 }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              <Form.Item
                name="title"
                label={<span style={{ color: 'var(--text-main)' }}>Event Title</span>}
                rules={[{ required: true, message: 'Please enter event title!' }]}
              >
                <Input placeholder="Enter title (e.g. IEEE Pune Tech Fiesta)" style={{ color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
              </Form.Item>

              <Form.Item
                name="short_description"
                label={<span style={{ color: 'var(--text-main)' }}>Short Description</span>}
                rules={[{ required: true, message: 'Please enter short description!' }]}
              >
                <Input.TextArea placeholder="Enter brief summary (displayed in listing cards)..." rows={3} style={{ color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: 'var(--text-main)' }}>Full Event Details</span>}
                required
              >
                <RichTextEditor value={fullDescription} onChange={setFullDescription} placeholder="Compose markdown contents of the event page..." />
              </Form.Item>
            </Card>

            <Card
              title="Attachments & Media"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              {/* Banner Upload */}
              <Form.Item
                label={<span style={{ color: 'var(--text-main)' }}>Event Banner {isEditMode ? '(Upload to change)' : '(Required)'}</span>}
                required={!isEditMode}
              >
                {existingBanner && (
                  <div style={{ marginBottom: 16, border: '1px solid var(--border-color)', borderRadius: '8px', padding: 8, maxWidth: 300 }}>
                    <img src={existingBanner} alt="Banner Preview" style={{ width: '100%', height: 'auto', borderRadius: 4 }} />
                    <div style={{ fontSize: 11, textAlign: 'center', marginTop: 4, color: 'var(--text-muted)' }}>Current Banner</div>
                  </div>
                )}
                <Upload.Dragger
                  maxCount={1}
                  fileList={bannerFileList}
                  onChange={({ fileList }) => setBannerFileList(fileList)}
                  beforeUpload={() => false}
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon"><FileImageOutlined style={{ fontSize: 32 }} /></p>
                  <p className="ant-upload-text" style={{ color: 'var(--text-main)' }}>Click or drag banner file to this area</p>
                  <p className="ant-upload-hint" style={{ color: 'var(--text-muted)', fontSize: 11 }}>JPEG, PNG, or WEBP up to 10MB</p>
                </Upload.Dragger>
              </Form.Item>

              {/* Gallery Upload */}
              <Form.Item label={<span style={{ color: 'var(--text-main)' }}>Gallery Uploads</span>}>
                {existingGallery.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Current Gallery Images (Click trash to delete from database):</Text>
                    <Row gutter={[12, 12]}>
                      {existingGallery.map((url, idx) => (
                        <Col key={idx} xs={8} sm={6} md={4}>
                          <div style={{ position: 'relative', border: '1px solid var(--border-color)', padding: 4, borderRadius: 6 }}>
                            <img src={url} alt="Gallery item" style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: 4 }} />
                            <Button
                              type="primary"
                              danger
                              shape="circle"
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => removeExistingGalleryImage(url)}
                              style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, minWidth: 22 }}
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
                <Upload.Dragger
                  multiple
                  fileList={galleryFileList}
                  onChange={({ fileList }) => setGalleryFileList(fileList)}
                  beforeUpload={() => false}
                  listType="picture-card"
                >
                  <p className="ant-upload-text" style={{ color: 'var(--text-main)' }}>Upload gallery items</p>
                  <p className="ant-upload-hint" style={{ color: 'var(--text-muted)', fontSize: 11 }}>Supports up to 10 files</p>
                </Upload.Dragger>
              </Form.Item>

              {/* Video Upload */}
              <Form.Item label={<span style={{ color: 'var(--text-main)' }}>Event Video Clip</span>}>
                {existingVideo && (
                  <div style={{ marginBottom: 16, border: '1px solid var(--border-color)', borderRadius: '8px', padding: 8, maxWidth: 300, position: 'relative' }}>
                    <video src={existingVideo} style={{ width: '100%', height: 'auto', borderRadius: 4 }} controls />
                    <Button
                      type="primary"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleRemoveExistingVideo}
                      style={{ position: 'absolute', top: 12, right: 12 }}
                    >
                      Delete Video
                    </Button>
                  </div>
                )}
                <Upload.Dragger
                  maxCount={1}
                  fileList={videoFileList}
                  onChange={({ fileList }) => setVideoFileList(fileList)}
                  beforeUpload={() => false}
                >
                  <p className="ant-upload-drag-icon"><PlayCircleOutlined style={{ fontSize: 32 }} /></p>
                  <p className="ant-upload-text" style={{ color: 'var(--text-main)' }}>Upload video highlights</p>
                  <p className="ant-upload-hint" style={{ color: 'var(--text-muted)', fontSize: 11 }}>MP4 format up to 50MB</p>
                </Upload.Dragger>
              </Form.Item>
            </Card>
          </Col>

          {/* Sidebar / Meta Fields */}
          <Col xs={24} lg={8}>
            <Card
              title="Schedule & Logistics"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', marginBottom: 24 }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              <Form.Item
                name="event_date"
                label={<span style={{ color: 'var(--text-main)' }}>Event Date & Time</span>}
              >
                <DatePicker showTime style={{ width: '100%', color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
              </Form.Item>

              <Form.Item
                name="venue_mode"
                label={<span style={{ color: 'var(--text-main)' }}>Location Type</span>}
                rules={[{ required: true, message: 'Please select location type!' }]}
                initialValue="Offline"
              >
                <Select onChange={(val) => setLocationMode(val)} dropdownStyle={{ background: 'var(--bg-surface)' }}>
                  <Select.Option value="Online">Online (Virtual Meeting)</Select.Option>
                  <Select.Option value="Offline">Offline (Physical Venue)</Select.Option>
                </Select>
              </Form.Item>

              {locationMode === 'Offline' && (
                <Form.Item
                  name="venue"
                  label={<span style={{ color: 'var(--text-main)' }}>Physical Venue Location</span>}
                  rules={[{ required: true, message: 'Please enter physical venue location!' }]}
                >
                  <Input placeholder="E.g., IEEE Headquarters Hall" style={{ color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
                </Form.Item>
              )}

              <Form.Item
                name="registration_link"
                label={<span style={{ color: 'var(--text-main)' }}>Registration Portal Link</span>}
              >
                <Input placeholder="https://..." style={{ color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
              </Form.Item>

              <Form.Item
                name="category"
                label={<span style={{ color: 'var(--text-main)' }}>Category</span>}
                rules={[{ required: true, message: 'Please select a category!' }]}
              >
                <Select placeholder="Select category">
                  <Select.Option value="Workshop">Workshop</Select.Option>
                  <Select.Option value="Seminar">Seminar</Select.Option>
                  <Select.Option value="Conference">Conference</Select.Option>
                  <Select.Option value="Social">Social</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="status"
                label={<span style={{ color: 'var(--text-main)' }}>Event Status</span>}
              >
                <Select placeholder="Select status">
                  <Select.Option value="Upcoming">Upcoming</Select.Option>
                  <Select.Option value="Completed">Completed</Select.Option>
                </Select>
              </Form.Item>
            </Card>

            <Card
              title="SDG Alignment"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', marginBottom: 24 }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              <Form.Item name="sdg_alignment" label={<span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Choose matching United Nations SDGs</span>}>
                <Select mode="multiple" placeholder="Select SDGs" style={{ width: '100%' }}>
                  {sdgOptions.map((opt, idx) => (
                    <Select.Option key={idx} value={opt}>
                      {opt}
                    </Select.Option>
                  ))}
                </Select>
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
              Save Event Parameters
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
