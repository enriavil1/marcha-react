import { Layout } from 'antd';
import Sider from 'antd/es/layout/Sider';

import { BORDER_LIGHT, WHITE } from '../../../design';
import AppSidebar from '../AppSidebar';
import PortalRoutes from '../PortalRoutes';

type Props = { communityId: string };

const DesktopLayout = ({ communityId }: Props) => (
  <Layout style={{ minHeight: '100vh' }}>
    <Layout>
      <Sider
        width={250}
        style={{
          background: WHITE,
          borderRight: `1px solid ${BORDER_LIGHT}`,
          height: '100vh',
          position: 'sticky',
        }}
      >
        <AppSidebar
          communityId={communityId}
          onNavigate={() => {
            return;
          }}
        />
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <PortalRoutes />
      </Layout>
    </Layout>
  </Layout>
);

export default DesktopLayout;
