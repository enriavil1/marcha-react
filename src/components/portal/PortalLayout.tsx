import { Grid } from 'antd';
import React from 'react';

import DesktopLayout from './layouts/DesktopLayout';
import MobileLayout from './layouts/MobileLayout';

const { useBreakpoint } = Grid;

type Props = {
  communityId: string;
};

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
