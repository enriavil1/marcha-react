import { MenuOutlined } from '@ant-design/icons';
import { Avatar, Button, Drawer, Flex, Typography } from 'antd';
import { useState } from 'react';

import { BORDER_LIGHT, BRAND_PRIMARY, WHITE } from '../../../design';
import AppSidebar from '../AppSidebar';
import PortalRoutes from '../PortalRoutes';

type Props = { communityId: string };

const MobileLayout = ({ communityId }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <Drawer
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        size={280}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <AppSidebar
          communityId={communityId}
          onNavigate={() => setDrawerOpen(false)}
        />
      </Drawer>

      <Flex vertical style={{ width: '100%', minHeight: '100vh' }}>
        <Flex
          align="center"
          justify="space-between"
          style={{
            background: WHITE,
            borderBottom: `1px solid ${BORDER_LIGHT}`,
            padding: '0 16px',
            height: 64,
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
        </Flex>

        <Flex
          vertical
          style={{
            padding: 8,
          }}
        >
          <PortalRoutes />
        </Flex>
      </Flex>
    </>
  );
};

export default MobileLayout;
