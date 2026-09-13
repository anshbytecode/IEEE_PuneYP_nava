import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Upload, Input, Space, Modal, Tag, message, Popconfirm, Typography } from 'antd';
import {
  UploadOutlined,
  SearchOutlined,
  PlayCircleOutlined,
  FilePdfOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { mediaService, MediaItem } from '../../services/mediaService';
import { eventService, EventItem } from '../../services/eventService';
import { CardGridSkeleton } from '../../components/Common/LoadingSkeleton';

const { Title, Text } = Typography;

export const GalleryManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  
  // Filters
  const [search, setSearch] = useState('');
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  const [fileType, setFileType] = useState<string | undefined>(undefined);
  
  // Pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0
  });

  // Upload fields
  const [uploadVisible, setUploadVisible] = useState(false);
  const [uploadEventId, setUploadEventId] = useState<string>('general');
  const [uploadFileList, setUploadFileList] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Preview Modal
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const fetchMedia = async (page = 1, currentSearch = search, currentEvent = eventId, currentType = fileType) => {
    try {
      setLoading(true);
      const data = await mediaService.getMedia({
        page,
        limit: pagination.pageSize,
        search: currentSearch || undefined,
        event_id: currentEvent || undefined,
        file_type: currentType || undefined
      });

      if (data.success) {
        setMedia(data.media);
        setPagination(prev => ({
          ...prev,
          current: data.pagination.currentPage,
          total: data.pagination.totalItems
        }));
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to load media gallery files.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await eventService.getEvents({ limit: 100 });
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchMedia(1);
  }, [eventId, fileType]);

  const handleSearch = () => {
    fetchMedia(1);
  };

  const handleUploadSubmit = async () => {
    if (uploadFileList.length === 0) {
      return message.error('Please select a file to upload!');
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFileList[0].originFileObj);
      formData.append('event_id', uploadEventId);

      const res = await mediaService.uploadMedia(formData);
      if (res.success) {
        message.success('File uploaded and cataloged successfully!');
        setUploadFileList([]);
        setUploadVisible(false);
        fetchMedia(1);
      }
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await mediaService.deleteMedia(id);
      if (res.success) {
        message.success('Media deleted from cloud and catalog.');
        fetchMedia(pagination.current);
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to delete media asset.');
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const renderMediaPreview = (item: MediaItem) => {
    switch (item.fileType) {
      case 'image':
        return (
          <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1120', position: 'relative' }}>
            <img src={item.fileUrl} alt={item.fileName} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
        );
      case 'video':
        return (
          <div style={{ height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#00B5E2' }}>
            <PlayCircleOutlined style={{ fontSize: 48, marginBottom: 8 }} />
            <Text style={{ fontSize: 11, color: '#00B5E2' }}>VIDEO HIGHLIGHT</Text>
          </div>
        );
      case 'pdf':
        return (
          <div style={{ height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#1e293b', color: '#ff1493' }}>
            <FilePdfOutlined style={{ fontSize: 48, marginBottom: 8 }} />
            <Text style={{ fontSize: 11, color: 'var(--text-muted)' }}>DOCUMENT PDF</Text>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
          Media Gallery
        </Title>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          onClick={() => setUploadVisible(true)}
          style={{ background: '#00629B', border: 'none', height: '40px', fontWeight: 600 }}
        >
          Upload Media
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
              placeholder="Search file name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 200, background: 'transparent', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
              suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />}
            />
            
            <Select
              placeholder="Organized by Event"
              value={eventId}
              onChange={setEventId}
              allowClear
              style={{ width: 220 }}
            >
              <Select.Option value="general">General Media (No Event)</Select.Option>
              {events.map(event => (
                <Select.Option key={event.id} value={event.id}>
                  {event.title}
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="File Type"
              value={fileType}
              onChange={setFileType}
              allowClear
              style={{ width: 140 }}
            >
              <Select.Option value="image">Images</Select.Option>
              <Select.Option value="video">Videos</Select.Option>
              <Select.Option value="pdf">PDF Documents</Select.Option>
            </Select>
          </Space>

          <Button onClick={() => { setSearch(''); setEventId(undefined); setFileType(undefined); fetchMedia(1, '', undefined, undefined); }}>
            Reset Filters
          </Button>
        </Space>
      </Card>

      {/* Media Grid */}
      {loading ? (
        <CardGridSkeleton count={8} cols={6} />
      ) : media.length > 0 ? (
        <Row gutter={[24, 24]}>
          {media.map((item) => (
            <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                style={{
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  borderRadius: 8,
                  overflow: 'hidden'
                }}
                styles={{ body: { padding: '12px 16px' } }}
                cover={renderMediaPreview(item)}
              >
                <div style={{ marginBottom: 12 }}>
                  <Text ellipsis style={{ display: 'block', fontWeight: 600, color: 'var(--text-main)', fontSize: '13px' }} title={item.fileName}>
                    {item.fileName}
                  </Text>
                  <Text style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Size: {formatBytes(item.fileSize)}
                  </Text>
                  {item.event_title && (
                    <div style={{ marginTop: 4 }}>
                      <Tag color="blue" style={{ fontSize: '10px' }}>{item.event_title}</Tag>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => { setPreviewItem(item); setPreviewVisible(true); }}
                    style={{ color: '#00B5E2' }}
                  >
                    View
                  </Button>

                  <Popconfirm
                    title="Delete this file from cloud storage?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', textAlign: 'center', padding: '48px 0' }}>
          <Text style={{ color: 'var(--text-muted)' }}>No media assets matched the selected filters.</Text>
        </Card>
      )}

      {/* Upload Media Modal */}
      <Modal
        title={<span style={{ color: 'var(--text-main)' }}>Upload Media Asset</span>}
        open={uploadVisible}
        onCancel={() => setUploadVisible(false)}
        onOk={handleUploadSubmit}
        confirmLoading={uploading}
        okText="Upload"
      >
        <Space direction="vertical" size={16} style={{ width: '100%', paddingTop: 12 }}>
          <div>
            <Text style={{ color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>Associate with Event Folder:</Text>
            <Select
              value={uploadEventId}
              onChange={setUploadEventId}
              style={{ width: '100%' }}
            >
              <Select.Option value="general">General / Unassociated</Select.Option>
              {events.map(event => (
                <Select.Option key={event.id} value={event.id}>
                  {event.title}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div>
            <Text style={{ color: 'var(--text-main)', display: 'block', marginBottom: 6 }}>Select File:</Text>
            <Upload
              maxCount={1}
              fileList={uploadFileList}
              onChange={({ fileList }) => setUploadFileList(fileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Select PDF, Image, or Video</Button>
            </Upload>
          </div>
        </Space>
      </Modal>

      {/* Full Preview Modal */}
      <Modal
        title={<span style={{ color: 'var(--text-main)' }}>{previewItem?.fileName}</span>}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Close
          </Button>,
          <Button key="download" type="primary" href={previewItem?.fileUrl} target="_blank" download style={{ background: '#00629B', border: 'none' }}>
            Open Original Link
          </Button>
        ]}
        width={750}
        styles={{ body: { display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#090d16', padding: 24 } }}
      >
        {previewItem?.fileType === 'image' && (
          <img src={previewItem.fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '480px', objectFit: 'contain' }} />
        )}
        {previewItem?.fileType === 'video' && (
          <video src={previewItem.fileUrl} style={{ width: '100%', maxHeight: '450px' }} controls autoPlay />
        )}
        {previewItem?.fileType === 'pdf' && (
          <iframe src={previewItem.fileUrl} style={{ width: '100%', height: '480px', border: 'none' }} title="PDF Preview" />
        )}
      </Modal>
    </div>
  );
};
