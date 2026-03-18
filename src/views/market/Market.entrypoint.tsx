import { Flex, Spin } from 'antd';
import React, { Suspense, useEffect, useMemo } from 'react';
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
            // user clicks "Load More". When present, the initial query starts
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

  useEffect(() => {
    // Reload the entrypoint whenever filters or cursor change.
    // When filters change, MarketplaceFilters clears `cursor` from the URL
    // first, so this will always start from page 1 for new filter combos.
    loadEntryPoint({ q, category, condition, cursor });
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
