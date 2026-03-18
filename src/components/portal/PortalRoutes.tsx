import { Content } from 'antd/es/layout/layout';
import { Navigate, Route, Routes } from 'react-router-dom';

import { RADIUS_MD, WHITE } from '../../design';
import Dashboard from '../../views/dashboard/Dashboard.entrypoint';
import CreateListing from '../../views/market/CreateListing.entrypoint';
import Market from '../../views/market/Market.entrypoint';
import ProductDetail from '../../views/market/Product.entrypoint';
import { Paths } from '../../views/paths';
import Profile from '../../views/profile/Profile.entrypoint';

/**
 * Shared route definitions used by both mobile and desktop layouts.
 *
 * All paths here are relative to the parent `/portal/:communityId/*` route.
 * React Router v6 matches routes by specificity: static segments beat dynamic
 * segments, so `market/new` always wins over `market/:product_id`.
 *
 * The index route redirects the bare `/portal/:communityId` URL to the
 * dashboard so users always land on a meaningful page.
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
      {/* Redirect bare /portal/:communityId to dashboard */}
      <Route index element={<Navigate to={Paths.Dashboard} replace />} />

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

      {/*
       * Marketplace routes — listed as siblings (not nested) so each path is
       * matched independently. React Router v6 only renders the first match
       * inside a <Routes>, so these three routes are mutually exclusive:
       *   market        → browse listings
       *   market/new    → create a listing
       *   market/:id    → view a listing detail
       */}
      <Route path={Paths.Market} element={<Market />} />
      <Route path={`${Paths.Market}/new`} element={<CreateListing />} />
      <Route path={`${Paths.Market}/:product_id`} element={<ProductDetail />} />

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
);

export default PortalRoutes;
