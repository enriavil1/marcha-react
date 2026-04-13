import { Content } from 'antd/es/layout/layout';
import { Route, Routes } from 'react-router-dom';

import { RADIUS_MD, WHITE } from '../../design';
import Dashboard from '../../views/dashboard/Dashboard.entrypoint';
import EventDetail from '../../views/events/EventDetail.entrypoint';
import Events from '../../views/events/Events.entrypoint';
import Noticeboard from '../../views/noticeboard/Noticeboard.entrypoint';
import { Paths } from '../../views/paths';
import Profile from '../../views/profile/Profile.entrypoint';

/**
 * Shared route definitions used by both mobile and desktop layouts.
 */

const PortalRoutes = () => (
  <Content
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
      <Route path={Paths.Community} element={<Noticeboard />} />
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
      <Route path={Paths.Events} element={<Events />} />
      <Route path={Paths.EventDetail} element={<EventDetail />} />
      <Route path={Paths.Noticeboard} element={<Noticeboard />} />
    </Routes>
  </Content>
);

export default PortalRoutes;
