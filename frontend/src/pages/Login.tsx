import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Alert, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { motion, Variants } from 'framer-motion';

const { Title, Text } = Typography;

export const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();


  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Track window resizing for responsive split screen
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isIEEEEmail = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    return trimmed.endsWith('@ieee.org') || trimmed.endsWith('@ieeepune.org');
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await authService.login({
        email: values.email,
        password: values.password
      });

      if (data.success) {
        login(data.token, data.admin);
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect');

        if (isIEEEEmail(data.admin.email)) {
          message.success('Welcome back to IEEE YP Admin Dashboard!');
          navigate(redirectTo || '/dashboard');
        } else {
          message.success('Logged in successfully!');
          navigate(redirectTo || '/');
        }
      } else {
        setErrorMsg(data.message || 'Login failed. Please verify credentials.');
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Connection error. Please try again later.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth response handler
  const handleGoogleResponse = async (response: any) => {
    setGoogleLoading(true);
    setErrorMsg(null);
    try {
      const data = await authService.googleLogin(response.credential);
      if (data.success) {
        login(data.token, data.admin);
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect');

        if (isIEEEEmail(data.admin.email)) {
          message.success('Successfully authenticated with Google!');
          navigate(redirectTo || '/dashboard');
        } else {
          message.success('Successfully logged in with Google!');
          navigate(redirectTo || '/');
        }
      } else {
        setErrorMsg(data.message || 'Google authentication failed.');
      }
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      const msg = error.response?.data?.message || 'Failed to authenticate with Google. Please try again.';
      setErrorMsg(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  // Google Mock Login Callback
  const handleMockGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrorMsg(null);
    message.loading({ content: 'Mocking Google login authentication...', key: 'mock_auth' });
    try {
      const data = await authService.googleLogin('mock-google-token');
      if (data.success) {
        login(data.token, data.admin);
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirect');

        if (isIEEEEmail(data.admin.email)) {
          message.success({ content: 'Successfully signed in as IEEE Developer (Mock Mode)!', key: 'mock_auth', duration: 3 });
          navigate(redirectTo || '/dashboard');
        } else {
          message.success({ content: 'Successfully signed in (Mock Mode)!', key: 'mock_auth', duration: 3 });
          navigate(redirectTo || '/');
        }
      } else {
        setErrorMsg(data.message || 'Mock Google login failed.');
        message.destroy('mock_auth');
      }
    } catch (error: any) {
      console.error('Mock Google Auth Error:', error);
      const msg = error.response?.data?.message || 'Mock Google authentication failed.';
      setErrorMsg(msg);
      message.destroy('mock_auth');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Initialize standard Google GIS script
  useEffect(() => {
    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            type: 'standard',
            theme: 'filled_blue',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 340,
          }
        );
      } catch (err) {
        console.error('Error rendering Google Sign-In Button:', err);
      }
    }
  }, [clientId, isMobile]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
        background: '#F8FAFC', // Slate background for light mode
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        overflow: 'hidden'
      }}
    >
      {/* LEFT PANEL - Premium Visual Hero (Hidden on Mobile) */}
      {!isMobile && (
        <div
          style={{
            flex: 1.1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 80px',
            background: 'linear-gradient(135deg, var(--color-ieee-dark) 0%, var(--color-ieee-primary) 100%)', // Core IEEE Dark/Blue brand gradient
            position: 'relative',
            overflow: 'hidden',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)'
          }}
        >
          {/* Animated Glowing blobs */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.05, 1],
              opacity: [0.12, 0.18, 0.12]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '15%',
              left: '10%',
              width: 320,
              height: 320,
              background: '#00629B',
              borderRadius: '50%',
              filter: 'blur(90px)',
              pointerEvents: 'none'
            }}
          />
          <motion.div
            animate={{
              y: [0, 25, 0],
              scale: [1, 1.08, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              width: 360,
              height: 360,
              background: '#00B5E2',
              borderRadius: '50%',
              filter: 'blur(110px)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 10, maxWidth: 540, alignSelf: 'center' }}>
            {/* Version Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '6px 14px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '30px',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '28px',
                boxShadow: '0 0 20px rgba(255, 255, 255, 0.05)'
              }}
            >
              IEEE Pune YP Console
            </div>

            <h1
              style={{
                color: '#F8FAFC',
                fontSize: '46px',
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-1.5px',
                marginBottom: '20px',
                fontFamily: "'Plus Jakarta Sans', sans-serif"
              }}
            >
              Inspiring & Supporting{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #00B2A9 0%, #00E5FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Young Innovators
              </span>
            </h1>

            <p
              style={{
                color: '#E8F4F8',
                fontSize: '17px',
                lineHeight: 1.65,
                marginBottom: '44px',
                fontWeight: 400
              }}
            >
              Access the central portal to manage events, publications, news releases, executive committees, and subscriber lists for the IEEE Young Professionals community.
            </p>

            {/* Premium Stats Showcase */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div style={{ color: '#00B5E2', fontSize: '32px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>500+</div>
                <div style={{ color: '#E8F4F8', opacity: 0.8, fontSize: '13px', marginTop: '6px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Registered Members
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                }}
              >
                <div style={{ color: '#00B5E2', fontSize: '32px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>20+</div>
                <div style={{ color: '#E8F4F8', opacity: 0.8, fontSize: '13px', marginTop: '6px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Annual Programs
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT PANEL - Authentication Form */}
      <div
        style={{
          width: isMobile ? '100%' : '50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: isMobile ? '40px 20px' : '60px 48px',
          background: '#F8FAFC', // Pure slate gray base
          position: 'relative',
          overflowY: 'auto'
        }}
      >
        {/* Animated Glow Blobs behind the card (subtle on light theme) */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 40, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: 280,
            height: 280,
            background: '#00B2A9',
            opacity: 0.04,
            borderRadius: '50%',
            filter: 'blur(90px)',
            pointerEvents: 'none'
          }}
        />
        <motion.div
          animate={{
            x: [0, -25, 30, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '10%',
            width: 300,
            height: 300,
            background: 'var(--color-ieee-primary)',
            opacity: 0.05,
            borderRadius: '50%',
            filter: 'blur(90px)',
            pointerEvents: 'none'
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            width: '100%',
            maxWidth: 420,
            zIndex: 5,
            background: '#FFFFFF', // Solid White Card
            border: '1px solid #E2E8F0', // Clean light border
            borderRadius: '24px',
            padding: '44px 36px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)' // Soft shadow
          }}
        >
          <motion.div variants={itemVariants} style={{ marginBottom: 32 }}>
            <Title level={2} style={{ color: '#0F172A', marginBottom: 6, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Sign In
            </Title>
            <Text style={{ color: '#64748B', fontSize: '14px', fontWeight: 500 }}>
              Enter credentials to access young professional portal.
            </Text>
          </motion.div>

          {errorMsg && (
            <motion.div variants={itemVariants}>
              <Alert
                message={errorMsg}
                type="error"
                showIcon
                style={{ marginBottom: 24, borderRadius: '10px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', color: '#DC2626' }}
              />
            </motion.div>
          )}

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <motion.div variants={itemVariants}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email!' },
                  { type: 'email', message: 'Please enter a valid email address!' }
                ]}
                style={{ marginBottom: 20 }}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#94A3B8' }} />}
                  placeholder="Email Address"
                  style={{
                    borderRadius: '10px',
                    height: '46px'
                  }}
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please enter your password!' }]}
                style={{ marginBottom: 24 }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#94A3B8' }} />}
                  placeholder="Password"
                  style={{
                    borderRadius: '10px',
                    height: '46px'
                  }}
                />
              </Form.Item>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Form.Item style={{ marginBottom: 20 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  style={{
                    height: '46px',
                    background: 'linear-gradient(90deg, var(--color-ieee-primary) 0%, var(--color-ieee-teal) 100%)', // Premium brand gradient
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 700,
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(0, 102, 153, 0.15)'
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </motion.div>
          </Form>

          {/* Divider */}
          <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', margin: '24px 0 20px 0', opacity: 0.8 }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            <span style={{ padding: '0 12px', color: '#64748B', fontSize: '12px', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
          </motion.div>

          {/* Google Button Section */}
          <motion.div variants={itemVariants} style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
            {clientId ? (
              <div id="google-signin-button" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
            ) : (
              <Button
                block
                onClick={handleMockGoogleLogin}
                loading={googleLoading}
                style={{
                  height: '42px',
                  background: '#FFFFFF',
                  color: '#1F2937',
                  border: '1px solid #D1D5DB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  borderRadius: '10px',
                  fontSize: '14px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '10px' }}>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google (Mock Mode)
              </Button>
            )}
          </motion.div>

          {/* Footer Link */}
          <motion.div variants={itemVariants} style={{ textAlign: 'center', marginTop: 12 }}>
            <Text style={{ color: '#64748B', fontWeight: 500 }}>Don't have an account? </Text>
            <Link to="/signup" style={{ color: 'var(--color-ieee-primary)', fontWeight: 700, marginLeft: '4px' }}>
              Sign Up
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
