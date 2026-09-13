import React from 'react';
import { Skeleton, Card, Row, Col } from 'antd';

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
      <Skeleton active paragraph={{ rows: 1 }} title={{ width: '30%' }} />
      <div style={{ marginTop: '24px' }}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <Skeleton active paragraph={{ rows: 2 }} title={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardGridSkeleton: React.FC<{ count?: number; cols?: number }> = ({ count = 4, cols = 6 }) => {
  return (
    <Row gutter={[24, 24]}>
      {Array.from({ length: count }).map((_, idx) => (
        <Col xs={24} sm={12} md={cols} key={idx}>
          <Card
            cover={<div style={{ height: 180, background: '#1e293b', opacity: 0.1, borderRadius: '8px 8px 0 0' }} />}
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            <Skeleton active paragraph={{ rows: 2 }} title={{ width: '60%' }} />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div>
      <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
        {Array.from({ length: 4 }).map((_, idx) => (
          <Col xs={24} sm={12} lg={6} key={idx}>
            <Card style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
              <Skeleton active paragraph={{ rows: 1 }} title={{ width: '40%' }} />
            </Card>
          </Col>
        ))}
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card style={{ height: 350, background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card style={{ height: 350, background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
