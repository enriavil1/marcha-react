/**
 * Marcha Design System — Ant Design Theme Configuration
 *
 * Apply via <ConfigProvider theme={marchaTheme}> at the app root.
 */
import type { ThemeConfig } from 'antd';

import {
  BORDER_DEFAULT,
  BRAND_PRIMARY,
  BRAND_PRIMARY_DARK,
  BRAND_PRIMARY_HOVER,
  NEUTRAL_900,
  RADIUS_LG,
  RADIUS_MD,
  RADIUS_XL,
  WHITE,
} from './colors';

export const marchaTheme: ThemeConfig = {
  token: {
    // Brand
    colorPrimary: BRAND_PRIMARY,
    colorPrimaryHover: BRAND_PRIMARY_HOVER,
    colorPrimaryActive: BRAND_PRIMARY_DARK,

    // Typography
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    colorText: NEUTRAL_900,

    // Borders & Radius
    borderRadius: RADIUS_MD,
    borderRadiusLG: RADIUS_LG,

    // Misc
    colorBorder: BORDER_DEFAULT,
  },
  components: {
    Layout: {
      headerBg: WHITE,
    },
    Card: {
      borderRadiusLG: RADIUS_XL,
    },
    Button: {
      borderRadius: RADIUS_MD,
    },
    Input: {
      borderRadius: RADIUS_MD,
    },
    Menu: {
      itemSelectedBg: 'rgba(240, 101, 67, 0.08)',
      itemSelectedColor: BRAND_PRIMARY,
    },
  },
};
