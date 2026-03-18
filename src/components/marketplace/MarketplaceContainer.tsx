import { PlusOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Flex, Row, Spin, Typography } from 'antd';
import React, { Suspense, useCallback } from 'react';
import { usePaginationFragment } from 'react-relay';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  BRAND_GRADIENT,
  NEUTRAL_500,
  OVERLAY_BORDER,
  OVERLAY_TEXT,
  RADIUS_LG,
  WHITE,
} from '../../design';
import { Paths } from '../../views/paths';
import ProductCard from '../Products/ProductCard';
import MarketplaceFilters from './MarketplaceFilters';
import { marketplacePaginationFragment } from './MarketplacePaginationFragment';
import type { MarketplacePaginationFragment$key } from './__generated__/MarketplacePaginationFragment.graphql';
import type { MarketplacePaginationQuery } from './__generated__/MarketplacePaginationQuery.graphql';
import type { MarketplaceWrapperQueryQuery$data } from './__generated__/MarketplaceWrapperQueryQuery.graphql';

/**
 * The page size used for both the initial load and each "Load More" request.
 * 12 fills a 4-column grid with exactly 3 rows.
 */
const PAGE_SIZE = 12;

type Category = {
  id: string;
  name: string;
};

type Props = {
  /**
   * The fragment ref comes from the root query data returned by
   * usePreloadedQuery in MarketplaceWrapper. It satisfies the
   * MarketplacePaginationFragment$key type because the root query spreads
   * ...MarketplacePaginationFragment.
   */
  queryRef: MarketplaceWrapperQueryQuery$data &
    MarketplacePaginationFragment$key;
  categories: Category[];
};

const MarketplaceContainer = ({
  queryRef,
  categories,
}: Props): React.ReactElement => {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();
  const [, setSearchParams] = useSearchParams();
  const basePath = `/portal/${communityId}`;

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    MarketplacePaginationQuery,
    MarketplacePaginationFragment$key
  >(marketplacePaginationFragment, queryRef);

  const edges = data.productsCollection?.edges ?? [];

  /**
   * When the user clicks "Load More" we:
   *  1. Ask Relay to fetch the next page (loadNext appends edges to the
   *     @connection store).
   *  2. Store the current endCursor in the URL so the page is bookmarkable
   *     and shareable at the current scroll position.
   */
  const handleLoadMore = useCallback(() => {
    loadNext(PAGE_SIZE, {
      onComplete: () => {
        // After Relay appends the new page, update the URL cursor param so
        // the current position is reflected in the address bar.
        const endCursor = data.productsCollection?.pageInfo?.endCursor;
        if (endCursor) {
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set('cursor', endCursor);
            return next;
          });
        }
      },
    });
  }, [loadNext, data.productsCollection, setSearchParams]);

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

      {/* Load More */}
      {hasNext && (
        <Flex justify="center" style={{ marginTop: 32 }}>
          <Button
            size="large"
            onClick={handleLoadMore}
            loading={isLoadingNext}
            disabled={isLoadingNext}
            style={{ minWidth: 160 }}
          >
            {isLoadingNext ? 'Loading\u2026' : 'Load More'}
          </Button>
        </Flex>
      )}

      {/* Subtle spinner shown below the grid while fetching the next page */}
      {isLoadingNext && (
        <Flex justify="center" align="center" style={{ marginTop: 16 }}>
          <Spin size="small" />
          <Typography.Text style={{ marginLeft: 8, color: NEUTRAL_500 }}>
            Loading more listings\u2026
          </Typography.Text>
        </Flex>
      )}
    </div>
  );
};

export default MarketplaceContainer;
