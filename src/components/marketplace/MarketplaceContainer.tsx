import { PlusOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Flex, Row, Spin, Typography } from 'antd';
import React, { Suspense, useCallback, useEffect, useRef } from 'react';
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
 * Number of listings fetched per page (initial load and each infinite-scroll
 * trigger). 12 fills a 4-column grid with exactly 3 rows.
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
   * Fetch the next page and write the resulting endCursor to the URL so the
   * current scroll position is bookmarkable / shareable.
   */
  const handleLoadNext = useCallback(() => {
    if (!hasNext || isLoadingNext) return;
    loadNext(PAGE_SIZE, {
      onComplete: () => {
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
  }, [
    hasNext,
    isLoadingNext,
    loadNext,
    data.productsCollection,
    setSearchParams,
  ]);

  /**
   * Sentinel element placed just below the product grid.
   * An IntersectionObserver watches it; when it enters the viewport we
   * trigger the next page load automatically.
   */
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadNext();
        }
      },
      {
        // Start loading when the sentinel is within 200 px of the viewport
        // bottom so the next batch arrives before the user actually hits the
        // end of the list.
        rootMargin: '0px 0px 200px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadNext]);

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

      {/*
       * Sentinel div — invisible, zero-height element at the bottom of the
       * list. The IntersectionObserver fires when this enters the viewport
       * (with a 200 px bottom margin) and triggers the next page fetch.
       * It is only rendered while there are more pages to load so the
       * observer is automatically disconnected once all pages are shown.
       */}
      {hasNext && <div ref={sentinelRef} style={{ height: 1 }} />}

      {/* Spinner shown while the next page is in-flight */}
      {isLoadingNext && (
        <Flex justify="center" align="center" style={{ marginTop: 24 }}>
          <Spin size="small" />
          <Typography.Text style={{ marginLeft: 8, color: NEUTRAL_500 }}>
            Loading more listings&hellip;
          </Typography.Text>
        </Flex>
      )}
    </div>
  );
};

export default MarketplaceContainer;
