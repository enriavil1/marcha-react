import { MenuOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Flex, Grid, Layout, Typography } from 'antd';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { BORDER_LIGHT, BRAND_PRIMARY, RADIUS_MD, WHITE } from '../../design';
import Dashboard from '../../views/dashboard/Dashboard.entrypoint';
import { Paths } from '../../views/paths';
import Profile from '../../views/profile/Profile.entrypoint';
import AppSidebar from './AppSidebar';

const { Content } = Layout;
const { useBreakpoint } = Grid;

type Props = {
  communityId: string;
};

/**
 * Shared route definitions used by both mobile and desktop layouts.
 */
const AppRoutes = () => (
  <Routes>
    <Route path={Paths.Dashboard} element={<Dashboard />} />
    <Route
      path={Paths.Documents}
      element={<div>Documents - Coming Soon</div>}
    />
    <Route
      path={Paths.Maintenance}
      element={<div>Maintenance - Coming Soon</div>}
    />
    <Route
      path={Paths.ServiceCharges}
      element={<div>Service Charges - Coming Soon</div>}
    />
    <Route path={Paths.Messages} element={<div>Messages - Coming Soon</div>} />
    <Route
      path={Paths.Community}
      element={<div>Noticeboard - Coming Soon</div>}
    />
    <Route path={Paths.Market} element={<div>Marketplace - Coming Soon</div>} />
    <Route
      path={Paths.Subletting}
      element={<div>Subletting - Coming Soon</div>}
    />
    <Route path={Paths.Profile} element={<Profile />} />
    <Route
      path={Paths.Notifications}
      element={<div>Notifications - Coming Soon</div>}
    />
  </Routes>
);

/**
 * Mobile layout: plain divs + Drawer overlay.
 * No antd Layout/Sider at all — prevents any flex-direction:row side effects.
 */
const MobileLayout = ({ communityId }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Fixed top header bar */}
      <div
        style={{
          background: WHITE,
          borderBottom: `1px solid ${BORDER_LIGHT}`,
          padding: '0 16px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Flex align="center" gap={10}>
          <Avatar
            shape="circle"
            size={32}
            style={{ backgroundColor: BRAND_PRIMARY, fontWeight: 700 }}
          >
            M
          </Avatar>
          <Typography.Text strong style={{ fontSize: 16 }}>
            Marcha
          </Typography.Text>
        </Flex>
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: 20 }} />}
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
        />
      </div>

      {/* Drawer overlay — position:fixed, does NOT affect document flow */}
      <Drawer
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <AppSidebar
          communityId={communityId}
          onNavigate={() => setDrawerOpen(false)}
        />
      </Drawer>

      {/* Content area — takes 100% width, no sidebar offset */}
      <div
        style={{
          flex: 1,
          padding: 8,
        }}
      >
        <div
          style={{
            padding: 12,
            minHeight: 280,
            background: WHITE,
            borderRadius: RADIUS_MD,
          }}
        >
          <AppRoutes />
        </div>
      </div>
    </div>
  );
};

/**
 * Desktop layout: antd Layout with Sider.
 * The Sider is always present on desktop, so the has-sider flex-direction:row
 * works correctly here.
 */
const DesktopLayout = ({ communityId }: Props) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Layout>
      <AppSidebar communityId={communityId} />
      <Layout style={{ padding: '24px' }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: WHITE,
            borderRadius: RADIUS_MD,
          }}
        >
          <AppRoutes />
        </Content>
      </Layout>
    </Layout>
  </Layout>
);

const PortalLayout = ({ communityId }: Props): React.ReactElement => {
  const screens = useBreakpoint();

  // md breakpoint (>= 768px) means desktop.
  // On the very first render, all breakpoints are undefined (empty object),
  // so we default to mobile to avoid a flash of desktop layout on phones.
  const isMobile = !screens.md;

  return isMobile ? (
    <MobileLayout communityId={communityId} />
  ) : (
    <DesktopLayout communityId={communityId} />
  );
};

export default PortalLayout;
