import { Col, Row, Space, Typography } from 'antd';
import graphql from 'babel-plugin-relay/macro';
import { useEffect, useState } from 'react';
import {
  EntryPointComponent,
  PreloadedQuery,
  usePreloadedQuery,
} from 'react-relay';
import { useNavigate } from 'react-router-dom';

import fetchFromStorage from '../../utils/fetch_from_storage';
import ProductActions from './ProductActions';
import ProductImageCard from './ProductImageCard';
import ProductInfo from './ProductInfo';
import SellerInfoCard from './SellerInfoCard';
import { ProductDetailPageQuery } from './__generated__/ProductDetailPageQuery.graphql';

const { Title } = Typography;

const productDetailQuery = graphql`
  query ProductDetailPageQuery($id: BigInt) {
    productsCollection(filter: { id: { eq: $id } }) {
      edges {
        node {
          id
          name
          description
          price
          image
          createdAt
          condition
          user {
            id
            username
            avatarUrl
          }
        }
      }
    }
  }
`;

type Props = {
  queries: {
    productDetailPageQuery: PreloadedQuery<ProductDetailPageQuery>;
  };
};

const ProductDetailPage: EntryPointComponent<
  {
    productDetailPageQuery: ProductDetailPageQuery;
  },
  Record<string, never>,
  Record<string, never>
> = (props: Props): React.ReactElement => {
  const navigate = useNavigate();

  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);

  const data = usePreloadedQuery<ProductDetailPageQuery>(
    productDetailQuery,
    props.queries.productDetailPageQuery
  );

  const product = data?.productsCollection?.edges?.[0]?.node;

  useEffect(() => {
    if (product) {
      fetchFromStorage(product.image, 'product-images').then((blob) =>
        setImageBlob(blob)
      );
      fetchFromStorage(product.user?.avatarUrl ?? '', 'avatars').then((blob) =>
        setAvatarBlob(blob)
      );
    }
  }, [product]);

  if (!product) {
    navigate('/feed');
    return <></>;
  }

  return (
    <Row gutter={[32, 32]}>
      {/* Product Image */}
      <Col xs={24} md={12}>
        <ProductImageCard name={product.name} imageBlob={imageBlob} />
      </Col>

      {/* Product Details */}
      <Col xs={24} md={12}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ marginBottom: '8px' }}>
            {product.name}
          </Title>

          <ProductActions />

          <ProductInfo
            price={product.price}
            condition={product.condition ?? null}
            description={product.description}
          />

          <SellerInfoCard
            username={product.user?.username ?? null}
            avatarBlob={avatarBlob}
          />
        </Space>
      </Col>
    </Row>
  );
};

export default ProductDetailPage;
