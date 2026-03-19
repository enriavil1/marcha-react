import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row } from 'antd';
import React, { Suspense } from 'react';

import ProductCard from '../Products/ProductCard';
import type { ProductCardFragmentQuery$key } from '../Products/__generated__/ProductCardFragmentQuery.graphql';

type Edge = {
  readonly node: {
    readonly product:
      | (ProductCardFragmentQuery$key & { readonly name: string })
      | null
      | undefined;
  };
};

type MarketplaceProductGridProps = {
  edges: readonly Edge[];
  onCreateListing: () => void;
};

/**
 * Responsive grid of product cards with an empty-state fallback.
 *
 * Each edge comes from productsCommunitiesCollection, so the product
 * fragment ref is accessed via `edge.node.product`.
 */
const MarketplaceProductGrid: React.FC<MarketplaceProductGridProps> = ({
  edges,
  onCreateListing,
}) => {
  const validEdges = edges.filter((edge) => edge.node.product != null);

  return (
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      {validEdges.length > 0 ? (
        validEdges.map((edge, i) => (
          <Col xs={24} sm={12} md={8} lg={6} key={i}>
            <Suspense fallback={<Card loading />}>
              <ProductCard
                fragmentRef={edge.node.product as ProductCardFragmentQuery$key}
                hoverable
              />
            </Suspense>
          </Col>
        ))
      ) : (
        <Col span={24}>
          <Empty description="No listings found" style={{ padding: '48px 0' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreateListing}
            >
              Create the first listing
            </Button>
          </Empty>
        </Col>
      )}
    </Row>
  );
};

export default MarketplaceProductGrid;
