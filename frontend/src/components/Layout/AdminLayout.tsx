import React, { useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  AlertOutlined,
  PictureOutlined,
  MailOutlined,
  MessageOutlined,
  LogoutOutlined,
  UserOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';

const { Header, Sider, Content, Footer } = Layout;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { admin, logout } = useAuth();
  const { mode } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
      navigate('/admin-portal');
    } else {
      navigate(key);
    }
  };

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/events',
      icon: <CalendarOutlined />,
      label: 'Events',
    },
    {
      key: '/blogs',
      icon: <FileTextOutlined />,
      label: 'Blogs',
    },
    {
      key: '/team',
      icon: <TeamOutlined />,
      label: 'Team Members',
    },
    {
      key: '/announcements',
      icon: <AlertOutlined />,
      label: 'Announcements',
    },
    {
      key: '/gallery',
      icon: <PictureOutlined />,
      label: 'Media Gallery',
    },
    {
      key: '/grants',
      icon: <TrophyOutlined />,
      label: 'Grants & Awards',
    },
    {
      key: '/subscribers',
      icon: <MailOutlined />,
      label: 'Subscribers',
    },
    {
      key: '/contacts',
      icon: <MessageOutlined />,
      label: 'Contact Requests',
    },
  ];

  const profileMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <div style={{ padding: '4px 8px' }}>
          <strong>{admin?.name}</strong>
          <div style={{ fontSize: '12px', color: token.colorTextSecondary }}>{admin?.email}</div>
          <div style={{ fontSize: '10px', color: token.colorPrimary, textTransform: 'uppercase', marginTop: '2px' }}>
            {admin?.role}
          </div>
        </div>
      ),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  // Resolve active key
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/events')) return '/events';
    if (path.startsWith('/blogs')) return '/blogs';
    if (path.startsWith('/team')) return '/team';
    if (path.startsWith('/announcements')) return '/announcements';
    if (path.startsWith('/gallery')) return '/gallery';
    if (path.startsWith('/subscribers')) return '/subscribers';
    if (path.startsWith('/contacts')) return '/contacts';
    return '/dashboard';
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--bg-base)', transition: 'background 0.3s' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: mode === 'dark' ? '#0B1120' : '#003D5C', // Solid IEEE Dark Navy in light mode
          borderRight: `1px solid var(--border-color)`,
          zIndex: 10,
          position: 'sticky',
          top: 0,
          height: '100vh'
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '0 24px',
            borderBottom: `1px solid var(--border-color)`,
            overflow: 'hidden',
            transition: 'all 0.2s',
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: collapsed ? '18px' : '16px',
              color: '#FFFFFF', // Always white for sidebar visibility
              whiteSpace: 'nowrap',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ color: '#00B5E2' }}>IEEE</span>
            {!collapsed && <span style={{ fontSize: '13px', fontWeight: 600, color: '#00B2A9' }}>Pune YP</span>}
          </div>
        </div>

        <Menu
          theme="dark" // Always use dark menu theme for white text on dark navy background
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          onClick={({ key }) => handleMenuClick({ key })}
          items={menuItems}
          style={{
            borderRight: 0,
            background: 'transparent',
            padding: '16px 0',
          }}
        />
      </Sider>

      <Layout style={{ background: 'transparent' }}>
        <Header
          style={{
            padding: '0 24px',
            background: mode === 'dark' ? '#0F172A' : '#FFFFFF',
            borderBottom: `1px solid var(--border-color)`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            height: 64
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 40,
              height: 40,
              color: 'var(--text-main)'
            }}
          />

          <Space size={18}>
            {/* Admin Profile Dropdown */}
            <Dropdown
              menu={{
                items: profileMenuItems,
                onClick: handleMenuClick
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar
                  style={{
                    backgroundColor: '#00629B',
                    verticalAlign: 'middle',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  icon={<UserOutlined />}
                />
                {!collapsed && (
                  <span style={{ fontWeight: 500, fontSize: '14px', color: 'var(--text-main)' }}>
                    {admin?.name}
                  </span>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content
          style={{
            margin: '24px',
            minHeight: 280,
            position: 'relative'
          }}
        >
          {children}
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '12px',
            borderTop: `1px solid var(--border-color)`,
            padding: '16px 24px',
            background: mode === 'dark' ? '#0F172A' : '#FFFFFF',
            marginTop: 'auto'
          }}
        >
          IEEE Pune Section Young Professionals ©{new Date().getFullYear()} - Content Management Panel
        </Footer>
      </Layout>
    </Layout>
  );
};
