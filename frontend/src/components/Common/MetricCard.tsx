import React from 'react';
import { Card, Space, theme } from 'antd';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, description }) => {
  const { token } = theme.useToken();

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          borderRadius: token.borderRadiusLG,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          position: 'relative'
        }}
        styles={{ body: { padding: '24px' } }}
      >
        {/* Glow effect at background corner */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            background: color,
            opacity: 0.05,
            filter: 'blur(30px)',
            borderRadius: '50%'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Space direction="vertical" size={4}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {title}
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'Outfit, sans-serif' }}>
              {value}
            </span>
          </Space>

          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              color: color
            }}
          >
            {icon}
          </div>
        </div>

        {description && (
          <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
            {description}
          </div>
        )}
      </Card>
    </motion.div>
  );
};
