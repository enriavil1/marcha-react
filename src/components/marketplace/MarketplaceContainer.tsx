import { PlusOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Flex, Row, Typography } from 'antd';
import React, { Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  BRAND_GRADIENT,
  OVERLAY_BORDER,
  OVERLAY_TEXT,
  RADIUS_LG,
  WHITE,
} from '../../design';
import { Paths } from '../../views/paths';
import ProductCard from '../Products/ProductCard';
import MarketplaceFilters from './MarketplaceFilters';
import type { MarketplaceWrapperQueryQuery$data } from './__generated__/MarketplaceWrapperQueryQuery.graphql';

type Props = {
  data: MarketplaceWrapperQueryQuery$data;
};

const MarketplaceContainer = ({ data }: Props): React.ReactElement => {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();
  const basePath = `/portal/${communityId}`;

  const edges = data.productsCollection?.edges ?? [];
  const categories =
    data.categoriesCollection?.edges?.map((e) => ({
      id: e.node.id,
      name: e.node.name,
    })) ?? [];

  return (
    <div>
      {/* Hero Card */}
      <Card
        style={{
          background: BRAND_GRADIENT,
          borderRadius: RADIUS_LG,
          border: `1px solid ${OVERLAY_BORDER}`,
          marginBottom: 24,
        }}
        styles={{ body: { padding: '32px 24px' } }}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <div>
            <Typography.Title
              level={3}
              style={{ color: WHITE, margin: 0, marginBottom: 4 }}
            >
              <ShopOutlined style={{ marginRight: 8 }} />
              Community Marketplace
            </Typography.Title>
            <Typography.Text style={{ color: OVERLAY_TEXT }}>
              Buy and sell items within your community
            </Typography.Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate(`${basePath}/${Paths.Market}/new`)}
            style={{
              background: WHITE,
              color: '#F06543',
              fontWeight: 600,
              border: 'none',
            }}
          >
            Post Listing
          </Button>
        </Flex>
      </Card>

      {/* Filters */}
      <MarketplaceFilters categories={categories} />

      {/* Product Grid */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        {edges.length > 0 ? (
          edges.map((edge, i) => (
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Suspense fallback={<Card loading />}>
                <ProductCard fragmentRef={edge.node} hoverable />
              </Suspense>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty
              description="No listings found"
              style={{ padding: '48px 0' }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate(`${basePath}/${Paths.Market}/new`)}
              >
                Create the first listing
              </Button>
            </Empty>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default MarketplaceContainer;
