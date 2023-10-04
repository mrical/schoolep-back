import React from 'react';

import { Layout } from 'antd';


export default function DashboardLayout({ children }) {
  return (
    <Layout className="site-layout">
      <Layout.Content
        className="dashboardSpacing"
        style={{
          width: '100%',
          maxWidth: '1100px',
        }}
      >
        {children}
      </Layout.Content>
    </Layout>
  );
}
