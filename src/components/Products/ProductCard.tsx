import { Tag } from 'antd';
import graphql from 'babel-plugin-relay/macro';
import { useEffect, useState } from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router';

import { useAuth } from '../../contexts/AuthContext';
import { BRAND_PRIMARY, RADIUS_SM } from '../../design';
import fetchFromStorage from '../../utils/fetch_from_storage';
import GeneralCard from '../Cards/GeneralCard';
import { ProductCardFragmentQuery$key } from './__generated__/ProductCardFragmentQuery.graphql';

type Props = {
  fragmentRef: ProductCardFragmentQuery$key;
  hoverable?: boolean;
};

const productFragmentQuery = graphql`
  fragment ProductCardFragmentQuery on Products {
    name
    description
    price
    image
    id
    isPublic
    categoryId
    condition
    userId
    user {
      avatarUrl
      username
    }
    productImagesCollection(
      first: 1
      orderBy: [{ displayOrder: AscNullsLast }]
    ) {
      edges {
        node {
          imageUrl
        }
      }
    }
  }
`;

const ProductCard = ({ fragmentRef, hoverable }: Props): React.ReactElement => {
  const [imageBlob, setImageBlob] = useState<Blob>(new Blob());
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);

  const product = useFragment(productFragmentQuery, fragmentRef);
  const navigation = useNavigate();
  const { userId } = useAuth();

  const isOwnListing = userId != null && product.userId === userId;

  useEffect(() => {
    // Prefer product_images table, fall back to legacy image field
    const firstProductImage =
      product.productImagesCollection?.edges?.[0]?.node?.imageUrl;
    const imagePath = firstProductImage || product.image;

    if (imagePath) {
      fetchFromStorage(imagePath, 'product-images').then((blob) =>
        setImageBlob(blob ?? imageBlob)
      );
    }

    if (product.user?.avatarUrl) {
      fetchFromStorage(product.user.avatarUrl, 'avatars').then((blob) =>
        setAvatarBlob(blob)
      );
    }
  }, [product]);

  return (
    <div style={{ position: 'relative' }}>
      {isOwnListing && (
        <Tag
          color={BRAND_PRIMARY}
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            fontSize: 11,
            padding: '0 8px',
            lineHeight: '20px',
            borderRadius: RADIUS_SM,
            fontWeight: 600,
          }}
        >
          Your listing
        </Tag>
      )}
      <GeneralCard
        name={product.name}
        description={product.description}
        onClick={() => navigation(`${product.id}`)}
        hoverable={hoverable}
        imageBlob={imageBlob}
        avatarBlob={avatarBlob}
        hasAvatar={true}
      />
    </div>
  );
};

export default ProductCard;
