import { Flex, Spin, Typography } from 'antd';
import React, { useCallback } from 'react';
import { usePaginationFragment } from 'react-relay';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { NEUTRAL_500 } from '../../design';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { Paths } from '../../views/paths';
import MarketplaceFilters from './MarketplaceFilters';
import MarketplaceHero from './MarketplaceHero';
import { marketplacePaginationFragment } from './MarketplacePaginationFragment';
import MarketplaceProductGrid from './MarketplaceProductGrid';
import type { MarketplacePaginationFragment$key } from './__generated__/MarketplacePaginationFragment.graphql';
import type { MarketplacePaginationQuery } from './__generated__/MarketplacePaginationQuery.graphql';
import { PAGE_SIZE } from './constants';

type Category = {
  id: string;
  name: string;
};

type Props = {
  fragmentRef: MarketplacePaginationFragment$key;
  categories: Category[];
};

/**
 * Orchestrator for the marketplace browse page.
 *
 * Composes the hero banner, filter bar, paginated product grid, and
 * infinite-scroll sentinel into a single layout.
 */
const MarketplaceContainer: React.FC<Props> = ({ fragmentRef, categories }) => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams();
  const basePath = `/portal/${communityId}`;

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    MarketplacePaginationQuery,
    MarketplacePaginationFragment$key
  >(marketplacePaginationFragment, fragmentRef);

  const edges = data.productsCollection?.edges ?? [];

  // ── Infinite scroll ───────────────────────────────────────────────────
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

  const sentinelRef = useInfiniteScroll(
    handleLoadNext,
    hasNext && !isLoadingNext
  );

  const navigateToNewListing = useCallback(
    () => navigate(`${basePath}/${Paths.Market}/new`),
    [navigate, basePath]
  );

  return (
    <div>
      <MarketplaceHero onPostListing={navigateToNewListing} />

      <MarketplaceFilters categories={categories} />

      <MarketplaceProductGrid
        edges={edges}
        onCreateListing={navigateToNewListing}
      />

      {/* Sentinel — triggers next-page fetch when it enters the viewport */}
      {hasNext && <div ref={sentinelRef} style={{ height: 1 }} />}

      {/* Loading indicator while the next page is in-flight */}
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
