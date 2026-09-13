import React, { useEffect, useState } from 'react';
import { Table, Button, Space, Card, Input, Modal, Form, DatePicker, Select, Divider, message, Popconfirm, Tooltip, Row, Col, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UserAddOutlined, FileImageOutlined } from '@ant-design/icons';
import { studentBranchService, StudentBranch, BranchOfficer } from '../../services/studentBranchService';
import dayjs from 'dayjs';

export const AdminStudentBranches: React.FC = () => {
  const [branches, setBranches] = useState<StudentBranch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  
  // File Upload State
  const [logoFileList, setLogoFileList] = useState<any[]>([]);
  const [existingLogo, setExistingLogo] = useState<string>('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBranch, setEditingBranch] = useState<StudentBranch | null>(null);
  const [form] = Form.useForm();

  // Load branches from database
  const fetchBranches = async () => {
    try {
      setLoading(true);
      const res = await studentBranchService.getStudentBranches();
      if (res.success && res.branches) {
        setBranches(res.branches);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load student branches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Filter branches by search text
  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(searchText.toLowerCase()) || 
    (b.code && b.code.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Open modal for creating new branch
  const handleAdd = () => {
    setEditingBranch(null);
    setExistingLogo('');
    setLogoFileList([]);
    form.resetFields();
    form.setFieldsValue({
      officers: [{ name: '', role: 'Chair', ieeeNumber: '', email: '', year: new Date().getFullYear() }]
    });
    setIsModalOpen(true);
  };

  // Open modal for editing existing branch
  const handleEdit = (record: StudentBranch) => {
    setEditingBranch(record);
    setExistingLogo(record.logoUrl || '');
    setLogoFileList([]);
    form.resetFields();
    form.setFieldsValue({
      name: record.name,
      code: record.code,
      logoUrl: record.logoUrl || '',
      established: record.established ? dayjs(record.established) : null,
      officers: record.officers && record.officers.length > 0 
        ? record.officers.map(o => ({
            name: o.name,
            role: o.role,
            ieeeNumber: o.ieeeNumber || '',
            email: o.email || '',
            year: o.year
          }))
        : [{ name: '', role: 'Chair', ieeeNumber: '', email: '', year: new Date().getFullYear() }]
    });
    setIsModalOpen(true);
  };

  // Delete a student branch
  const handleDelete = async (id: string) => {
    try {
      const res = await studentBranchService.deleteStudentBranch(id);
      if (res.success) {
        message.success('Student branch deleted successfully.');
        fetchBranches();
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to delete student branch.');
    }
  };

  // Form submit handler
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      const formData = new FormData();
      formData.append('name', values.name);
      if (values.code) formData.append('code', values.code);
      if (values.established) formData.append('established', values.established.toISOString());
      
      const officersList = values.officers ? values.officers.filter((o: any) => o.name && o.role) : [];
      formData.append('officers', JSON.stringify(officersList));

      if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
        formData.append('logo', logoFileList[0].originFileObj);
      } else if (values.logoUrl) {
        formData.append('logo_url', values.logoUrl);
      } else if (existingLogo) {
        formData.append('logo_url', existingLogo);
      }

      if (editingBranch) {
        const res = await studentBranchService.updateStudentBranch(editingBranch.id, formData);
        if (res.success) {
          message.success('Student branch updated successfully.');
          setIsModalOpen(false);
          fetchBranches();
        }
      } else {
        const res = await studentBranchService.createStudentBranch(formData);
        if (res.success) {
          message.success('Student branch registered successfully.');
          setIsModalOpen(false);
          fetchBranches();
        }
      }
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Form validation failed.';
      message.error(errorMsg);
    }
  };

  // Table columns definition
  const columns = [
    {
      title: 'College Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: StudentBranch, b: StudentBranch) => a.name.localeCompare(b.name),
      render: (text: string, record: StudentBranch) => (
        <div>
          <strong style={{ color: 'var(--text-main)' }}>{text}</strong>
          {record.code && <span style={{ marginLeft: 8, fontSize: 11, background: 'var(--border-color)', padding: '2px 6px', borderRadius: 4, color: 'var(--text-muted)' }}>{record.code}</span>}
        </div>
      )
    },
    {
      title: 'Established On',
      dataIndex: 'established',
      key: 'established',
      width: 150,
      render: (val: string) => val ? dayjs(val).format('YYYY-MM-DD') : '-'
    },
    {
      title: 'Committee Strength',
      dataIndex: 'officers',
      key: 'officers',
      width: 180,
      render: (officers: BranchOfficer[]) => (
        <span style={{ color: 'var(--text-main)' }}>
          {officers ? `${officers.length} Officers` : 'No officers listed'}
        </span>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: StudentBranch) => (
        <Space size="middle">
          <Tooltip title="Edit Student Branch">
            <Button
              type="primary"
              ghost
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Student Branch">
            <Popconfirm
              title="Are you sure you want to delete this student branch?"
              description="This will also permanently delete all its associated officers."
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="primary"
                danger
                ghost
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card
        title={<span style={{ color: 'var(--text-main)' }}>Student Branches & ExCom Committees</span>}
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
        styles={{ header: { borderBottom: '1px solid var(--border-color)' } }}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Student Branch
          </Button>
        }
      >
        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search by college name or code..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            prefix={<SearchOutlined style={{ color: 'var(--text-muted)' }} />}
            style={{ width: 300, background: 'transparent', color: 'var(--text-main)', borderColor: 'var(--border-color)' }}
          />
        </Space>

        <Table
          columns={columns}
          dataSource={filteredBranches}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          style={{ background: 'transparent' }}
          className="custom-antd-table"
        />
      </Card>

      {/* Editor Modal */}
      <Modal
        title={editingBranch ? "Edit Student Branch Details" : "Register New Student Branch"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={850}
        okText="Save Parameters"
        destroyOnClose
        styles={{
          body: { maxHeight: '65vh', overflowY: 'auto', padding: '16px' }
        }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                name="name"
                label="College Name"
                rules={[{ required: true, message: 'Please enter the college name!' }]}
              >
                <Input placeholder="E.g., Pune Institute of Computer Technology" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="code" label="Short Code / Acronym">
                <Input placeholder="E.g., PICT" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="College Photo / Logo">
                {existingLogo && (
                  <div style={{ marginBottom: 12, border: '1px solid #e8e8e8', borderRadius: 8, padding: 6, maxWidth: 120 }}>
                    <img src={existingLogo} alt="Branch logo preview" style={{ width: '100%', height: 'auto', borderRadius: 4 }} />
                    <Button 
                      type="text" 
                      danger 
                      size="small" 
                      block 
                      icon={<DeleteOutlined />} 
                      onClick={() => {
                        setExistingLogo('');
                        form.setFieldsValue({ logoUrl: '' });
                      }}
                      style={{ padding: 0, height: 22, fontSize: 11, marginTop: 4 }}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Upload
                    maxCount={1}
                    fileList={logoFileList}
                    onChange={({ fileList }) => setLogoFileList(fileList)}
                    beforeUpload={() => false}
                    listType="picture"
                  >
                    <Button icon={<FileImageOutlined />}>Select College Image File</Button>
                  </Upload>
                  
                  <Form.Item name="logoUrl" label="Or Paste College Image URL" style={{ marginBottom: 0, marginTop: 4 }}>
                    <Input 
                      placeholder="https://..." 
                      onChange={(e) => {
                        setExistingLogo(e.target.value);
                      }}
                    />
                  </Form.Item>
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="established" label="Established Date">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" style={{ margin: '12px 0 20px' }}>
            Executive Committee (ExCom / Officers List)
          </Divider>

          <Form.List name="officers">
            {(fields, { add, remove }) => (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {fields.map(({ key, name, ...restField }) => (
                  <Card 
                    key={key} 
                    size="small" 
                    style={{ background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 8 }}
                    title={`Officer #${name + 1}`}
                    extra={
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    }
                  >
                    <Row gutter={12}>
                      <Col xs={24} sm={10}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[{ required: true, message: 'Missing officer name' }]}
                          label="Full Name"
                          style={{ marginBottom: 8 }}
                        >
                          <Input placeholder="E.g., Nidhi Dubey" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={7}>
                        <Form.Item
                          {...restField}
                          name={[name, 'role']}
                          rules={[{ required: true, message: 'Missing role' }]}
                          label="Officer Position"
                          style={{ marginBottom: 8 }}
                        >
                          <Select placeholder="Select position">
                            <Select.Option value="Counsellor">Counsellor / Advisor</Select.Option>
                            <Select.Option value="Chair">Chair</Select.Option>
                            <Select.Option value="Vice Chair">Vice Chair</Select.Option>
                            <Select.Option value="Secretary">Secretary</Select.Option>
                            <Select.Option value="Treasurer">Treasurer</Select.Option>
                            <Select.Option value="Webmaster">Webmaster</Select.Option>
                            <Select.Option value="Public Relations">Public Relations</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={7}>
                        <Form.Item
                          {...restField}
                          name={[name, 'year']}
                          rules={[{ required: true, message: 'Missing year' }]}
                          label="Committee Year"
                          style={{ marginBottom: 8 }}
                        >
                          <Select placeholder="Select year">
                            <Select.Option value={2026}>2026</Select.Option>
                            <Select.Option value={2025}>2025</Select.Option>
                            <Select.Option value={2024}>2024</Select.Option>
                            <Select.Option value={2023}>2023</Select.Option>
                            <Select.Option value={2022}>2022</Select.Option>
                            <Select.Option value={2021}>2021</Select.Option>
                            <Select.Option value={2020}>2020</Select.Option>
                            <Select.Option value={2019}>2019</Select.Option>
                            <Select.Option value={2018}>2018</Select.Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={12}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'ieeeNumber']}
                          label="IEEE Number (Optional)"
                          style={{ marginBottom: 4 }}
                        >
                          <Input placeholder="E.g., 98529243" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          {...restField}
                          name={[name, 'email']}
                          label="Email Address (Optional)"
                          style={{ marginBottom: 4 }}
                        >
                          <Input placeholder="E.g., officer@domain.org" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ name: '', role: 'Chair', ieeeNumber: '', email: '', year: new Date().getFullYear() })}
                  block
                  icon={<UserAddOutlined />}
                  style={{ height: '40px' }}
                >
                  Add Committee Member / Officer
                </Button>
              </div>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};
