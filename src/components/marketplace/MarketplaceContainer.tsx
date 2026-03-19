import { Flex, Spin, Typography } from 'antd';
import React, { useCallback, useMemo } from 'react';
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
 *
 * The pagination fragment now queries productsCommunitiesCollection,
 * so each edge contains a ProductsCommunities node with a nested `product`.
 * Client-side filtering is applied for search, category, and condition
 * since the join table doesn't support product-level filters.
 */
const MarketplaceContainer: React.FC<Props> = ({ fragmentRef, categories }) => {
  const { communityId } = useParams<{ communityId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const basePath = `/portal/${communityId}`;

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    MarketplacePaginationQuery,
    MarketplacePaginationFragment$key
  >(marketplacePaginationFragment, fragmentRef);

  const rawEdges = data.productsCommunitiesCollection?.edges ?? [];

  // ── Client-side filtering ─────────────────────────────────────────────
  // Since productsCommunitiesCollection doesn't support product-level filters,
  // we apply search, category, and condition filters on the client side.
  const q = searchParams.get('q')?.toLowerCase() ?? '';
  const categoryFilter = searchParams.get('category') ?? '';
  const conditionFilter = searchParams.get('condition') ?? '';

  const edges = useMemo(() => {
    return rawEdges.filter((edge) => {
      const product = edge.node.product;
      if (!product) return false;
      if (!product.isPublic) return false;
      if (q && !product.name.toLowerCase().includes(q)) return false;
      if (categoryFilter && product.categoryId !== categoryFilter) return false;
      if (conditionFilter && product.condition !== conditionFilter)
        return false;
      return true;
    });
  }, [rawEdges, q, categoryFilter, conditionFilter]);

  // ── Infinite scroll ───────────────────────────────────────────────────
  const handleLoadNext = useCallback(() => {
    if (!hasNext || isLoadingNext) return;

    loadNext(PAGE_SIZE, {
      onComplete: () => {
        const endCursor =
          data.productsCommunitiesCollection?.pageInfo?.endCursor;
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
    data.productsCommunitiesCollection,
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

  const navigateToMyListings = useCallback(
    () => navigate(`${basePath}/${Paths.Market}/my-listings`),
    [navigate, basePath]
  );

  return (
    <div>
      <MarketplaceHero
        onPostListing={navigateToNewListing}
        onMyListings={navigateToMyListings}
      />

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
