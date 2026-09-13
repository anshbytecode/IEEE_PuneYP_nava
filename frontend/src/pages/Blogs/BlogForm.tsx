import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, Card, Upload, Row, Col, Typography, message, Spin } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, FileImageOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService } from '../../services/blogService';
import { RichTextEditor } from '../../components/Common/RichTextEditor';

const { Title } = Typography;

export const BlogForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [content, setContent] = useState('');
  
  // Thumbnail Media Preview
  const [existingThumbnail, setExistingThumbnail] = useState('');
  const [thumbFileList, setThumbFileList] = useState<any[]>([]);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchBlogDetails = async () => {
        try {
          setLoading(true);
          const res = await blogService.getBlogById(id);
          if (res.success && res.blog) {
            const blog = res.blog;
            form.setFieldsValue({
              title: blog.title,
              publish_status: blog.publishStatus,
              tags: blog.tags
            });
            setContent(blog.content);
            setExistingThumbnail(blog.thumbnailUrl);
          }
        } catch (error) {
          console.error(error);
          message.error('Failed to load blog article details.');
          navigate('/blogs');
        } finally {
          setLoading(false);
        }
      };
      fetchBlogDetails();
    }
  }, [id, isEditMode]);

  const onFinish = async (values: any) => {
    if (!content.trim()) {
      return message.error('Blog content cannot be empty.');
    }

    setSubmitLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', content);
      formData.append('publish_status', values.publish_status || 'Draft');
      
      if (values.tags) {
        formData.append('tags', JSON.stringify(values.tags));
      }

      // Add thumbnail file
      if (thumbFileList.length > 0) {
        formData.append('thumbnail', thumbFileList[0].originFileObj);
      }

      if (isEditMode && id) {
        const res = await blogService.updateBlog(id, formData);
        if (res.success) {
          message.success('Blog post updated successfully!');
          navigate('/blogs');
        }
      } else {
        const res = await blogService.createBlog(formData);
        if (res.success) {
          message.success('Blog post published successfully!');
          navigate('/blogs');
        }
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Failed to submit blog post.';
      message.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '16px' }}>
        <Spin size="large" />
        <div style={{ color: 'var(--text-muted)' }}>Loading blog form...</div>
      </div>
    );
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/blogs')}>
          Back to List
        </Button>
      </Space>

      <div style={{ marginBottom: '24px' }}>
        <Title level={3} style={{ color: 'var(--text-main)', margin: 0 }}>
          {isEditMode ? 'Edit Blog Article' : 'Compose Blog Article'}
        </Title>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ publish_status: 'Published' }}
        size="large"
      >
        <Row gutter={24}>
          <Col xs={24} lg={16}>
            <Card
              title="Article Content"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', marginBottom: 24 }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              <Form.Item
                name="title"
                label={<span style={{ color: 'var(--text-main)' }}>Article Title</span>}
                rules={[{ required: true, message: 'Please enter article title!' }]}
              >
                <Input placeholder="Enter title..." style={{ color: 'var(--text-main)', background: 'transparent', borderColor: 'var(--border-color)' }} />
              </Form.Item>

              <Form.Item
                label={<span style={{ color: 'var(--text-main)' }}>Content Body</span>}
                required
              >
                <RichTextEditor value={content} onChange={setContent} placeholder="Compose markdown text of the article..." rows={16} />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              title="Publish Parameters"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', marginBottom: 24 }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              <Form.Item
                name="publish_status"
                label={<span style={{ color: 'var(--text-main)' }}>Publish Status</span>}
              >
                <Select>
                  <Select.Option value="Draft">Draft</Select.Option>
                  <Select.Option value="Published">Published</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="tags"
                label={<span style={{ color: 'var(--text-main)' }}>Tags</span>}
              >
                <Select mode="tags" placeholder="Press enter to add tag" tokenSeparators={[',']}>
                  {/* Default options */}
                  <Select.Option value="Tech">Tech</Select.Option>
                  <Select.Option value="Career">Career</Select.Option>
                  <Select.Option value="IEEE YP">IEEE YP</Select.Option>
                  <Select.Option value="Workshop">Workshop</Select.Option>
                </Select>
              </Form.Item>
            </Card>

            <Card
              title="Thumbnail Image"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', marginBottom: 24 }}
              styles={{ header: { color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' } }}
            >
              {existingThumbnail && (
                <div style={{ marginBottom: 16, border: '1px solid var(--border-color)', borderRadius: '8px', padding: 8 }}>
                  <img src={existingThumbnail} alt="Thumbnail Preview" style={{ width: '100%', height: 'auto', borderRadius: 4 }} />
                  <div style={{ fontSize: 11, textAlign: 'center', marginTop: 4, color: 'var(--text-muted)' }}>Current Thumbnail</div>
                </div>
              )}
              <Form.Item required={false}>
                <Upload.Dragger
                  maxCount={1}
                  fileList={thumbFileList}
                  onChange={({ fileList }) => setThumbFileList(fileList)}
                  beforeUpload={() => false}
                  listType="picture"
                >
                  <p className="ant-upload-drag-icon"><FileImageOutlined style={{ fontSize: 24 }} /></p>
                  <p className="ant-upload-text" style={{ color: 'var(--text-main)', fontSize: '13px' }}>Drag or click thumbnail to upload</p>
                  <p className="ant-upload-hint" style={{ color: 'var(--text-muted)', fontSize: 11 }}>JPEG, PNG format up to 10MB</p>
                </Upload.Dragger>
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
              Save Blog Article
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
