import { MenuOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Flex, Grid, Layout, Typography } from 'antd';
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { BORDER_LIGHT, BRAND_PRIMARY, RADIUS_MD, WHITE } from '../../design';
import Dashboard from '../../views/dashboard/Dashboard.entrypoint';
import { Paths } from '../../views/paths';
import Profile from '../../views/profile/Profile.entrypoint';
import AppSidebar from './AppSidebar';

const { Content, Header } = Layout;
const { useBreakpoint } = Grid;

type Props = {
  communityId: string;
};

const PortalLayout = ({ communityId }: Props): React.ReactElement => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const screens = useBreakpoint();

  // md breakpoint (>= 768px) means desktop — show sidebar; below means mobile — show drawer
  const isMobile = !screens.md;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Mobile-only header with hamburger menu */}
      {isMobile && (
        <Header
          style={{
            background: WHITE,
            borderBottom: `1px solid ${BORDER_LIGHT}`,
            padding: '0 16px',
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
        </Header>
      )}

      <style>{`
        @media (max-width: 767px) {
          .portal-content-layout {
            padding: 8px !important;
          }
          .portal-content {
            padding: 12px !important;
          }
        }
      `}</style>

      {/* Mobile-only Drawer — rendered as an overlay, does NOT affect layout */}
      {isMobile && (
        <Drawer
          placement="left"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={280}
          closable={false}
          styles={{
            body: { padding: 0 },
          }}
        >
          <AppSidebar
            communityId={communityId}
            onNavigate={() => setDrawerOpen(false)}
          />
        </Drawer>
      )}

      <Layout>
        {/* Desktop-only sidebar — conditionally rendered, NOT just hidden via CSS */}
        {!isMobile && <AppSidebar communityId={communityId} />}

        <Layout className="portal-content-layout" style={{ padding: '24px' }}>
          <Content
            className="portal-content"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: WHITE,
              borderRadius: RADIUS_MD,
            }}
          >
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
              <Route
                path={Paths.Messages}
                element={<div>Messages - Coming Soon</div>}
              />
              <Route
                path={Paths.Community}
                element={<div>Noticeboard - Coming Soon</div>}
              />
              <Route
                path={Paths.Market}
                element={<div>Marketplace - Coming Soon</div>}
              />
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
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default PortalLayout;
