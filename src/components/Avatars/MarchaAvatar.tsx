import { Flex } from 'antd';

import { BRAND_PRIMARY, WHITE } from '../../design';

const MarchaAvatar = () => {
  return (
    <Flex
      align="center"
      justify="center"
      style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: BRAND_PRIMARY,
        color: WHITE,
        fontWeight: 'bold',
        fontSize: 18,
      }}
    >
      M
    </Flex>
  );
};

export default MarchaAvatar;
