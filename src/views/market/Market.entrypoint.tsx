import { Flex, Spin } from 'antd';
import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import {
  EntryPointContainer,
  useEntryPointLoader,
  useRelayEnvironment,
} from 'react-relay';
import { useSearchParams } from 'react-router-dom';

import MarketplaceWrapperQueryQuery from '../../components/marketplace/__generated__/MarketplaceWrapperQueryQuery.graphql';
import { PAGE_SIZE } from '../../components/marketplace/constants';
import { createEntryPoint } from '../../utils/create_entrypoint';
import JSResource from '../../utils/make_resource';

type EntryPointParams = {
  q?: string;
  category?: string;
  condition?: string;
  cursor?: string;
};

const MarketplaceEntryPoint = createEntryPoint({
  root: JSResource('MarketplaceWrapper', () =>
    import('../../components/marketplace/MarketplaceWrapper').then(
      (module) => module.default
    )
  ),
  getPreloadProps(params: EntryPointParams) {
    // Build the ProductsFilter from URL search params
    const filters: Record<string, unknown>[] = [];

    // Always show only public listings
    filters.push({ isPublic: { eq: true } });

    if (params.q) {
      filters.push({ name: { ilike: `%${params.q}%` } });
    }
    if (params.category) {
      filters.push({ categoryId: { eq: params.category } });
    }
    if (params.condition) {
      filters.push({ condition: { eq: params.condition } });
    }

    const filter = filters.length > 0 ? { and: filters } : undefined;

    return {
      queries: {
        marketplaceQuery: {
          parameters: MarketplaceWrapperQueryQuery,
          variables: {
            count: PAGE_SIZE,
            // `cursor` is the opaque Relay cursor stored in the URL after the
            // user loads more pages. When present, the initial query starts
            // from that position so a bookmarked/shared URL restores the page.
            cursor: params.cursor ?? null,
            filter,
            orderBy: [{ createdAt: 'DescNullsLast' }],
          },
        },
      },
    } as const;
  },
});

const Market = (): React.ReactElement | null => {
  const relayEnvironment = useRelayEnvironment();
  const [searchParams] = useSearchParams();

  const environmentProvider = useMemo(
    () => ({ getEnvironment: () => relayEnvironment }),
    [relayEnvironment]
  );

  const [entryPointRef, loadEntryPoint] = useEntryPointLoader(
    environmentProvider,
    MarketplaceEntryPoint
  );

  // Extract filter + pagination params from URL
  const q = searchParams.get('q') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const condition = searchParams.get('condition') ?? undefined;
  const cursor = searchParams.get('cursor') ?? undefined;

  // Track previous filter values so we only reload when they actually change.
  // Using refs avoids stale-closure issues and prevents double-firing in
  // React Strict Mode (which runs effects twice in development).
  const prevFiltersRef = useRef<string | null>(null);

  useEffect(() => {
    // Serialize current filter state for comparison
    const currentFilters = JSON.stringify({ q, category, condition, cursor });

    // On the initial mount (entryPointRef is null) OR when filters change,
    // load/reload the entrypoint. This matches the pattern used by Dashboard,
    // Profile, CommunitiesFeed, and all other entrypoints in the codebase.
    if (entryPointRef == null || prevFiltersRef.current !== currentFilters) {
      prevFiltersRef.current = currentFilters;
      loadEntryPoint({ q, category, condition, cursor });
    }
  }, [q, category, condition, cursor]);

  if (!entryPointRef) return null;

  return (
    <Suspense
      fallback={
        <Flex justify="center" align="center" style={{ height: '40vh' }}>
          <Spin tip="Loading Marketplace..." size="large" />
        </Flex>
      }
    >
      <EntryPointContainer entryPointReference={entryPointRef} props={{}} />
    </Suspense>
  );
};

export default Market;
