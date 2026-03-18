import { Card, Image } from 'antd';
import React from 'react';

type ProductImageCardProps = {
  name: string;
  imageBlob: Blob | null;
};

/**
 * Full-width product image displayed on the detail page.
 */
const ProductImageCard: React.FC<ProductImageCardProps> = ({
  name,
  imageBlob,
}) => (
  <Card
    classNames={{ body: 'product-detail-image' }}
    styles={{ body: { padding: 0 } }}
  >
    <Image
      alt={name}
      src={imageBlob ? URL.createObjectURL(imageBlob) : ''}
      style={{ width: '100%' }}
    />
  </Card>
);

export default ProductImageCard;
