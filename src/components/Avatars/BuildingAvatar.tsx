import { HomeOutlined } from '@ant-design/icons';
import { Flex } from 'antd';

import { BRAND_PRIMARY, RADIUS_LG, WHITE } from '../../design';

type Props = {
  communityImg?: string | null;
};

const BuildingAvatar = ({ communityImg = null }: Props) => {
  return (
    <>
      {communityImg != null ? (
        <img
          src={communityImg}
          alt="community logo"
          style={{
            width: 48,
            height: 48,
            borderRadius: RADIUS_LG,
            objectFit: 'cover',
          }}
        />
      ) : (
        <Flex
          align="center"
          justify="center"
          style={{
            width: 48,
            height: 48,
            borderRadius: RADIUS_LG,
            background: BRAND_PRIMARY,
          }}
        >
          <HomeOutlined style={{ fontSize: 24, color: WHITE }} />
        </Flex>
      )}
    </>
  );
};

export default BuildingAvatar;
