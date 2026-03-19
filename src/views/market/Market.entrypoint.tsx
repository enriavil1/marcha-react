import { Flex, Spin } from 'antd';
import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import {
  EntryPointContainer,
  useEntryPointLoader,
  useRelayEnvironment,
} from 'react-relay';
import { useParams, useSearchParams } from 'react-router-dom';

import MarketplaceWrapperQueryQuery from '../../components/marketplace/__generated__/MarketplaceWrapperQueryQuery.graphql';
import { PAGE_SIZE } from '../../components/marketplace/constants';
import { createEntryPoint } from '../../utils/create_entrypoint';
import JSResource from '../../utils/make_resource';

type EntryPointParams = {
  communityId?: string;
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
    // Build the ProductsCommunitiesFilter from URL search params.
    // The primary filter is communityId to scope products to the current community.
    const filter: Record<string, unknown> = {};

    if (params.communityId) {
      filter.communityId = { eq: params.communityId };
    }

    return {
      queries: {
        marketplaceQuery: {
          parameters: MarketplaceWrapperQueryQuery,
          variables: {
            count: PAGE_SIZE,
            cursor: params.cursor ?? null,
            filter: Object.keys(filter).length > 0 ? filter : undefined,
            orderBy: [{ createdAt: 'DescNullsLast' }],
          },
        },
      },
    } as const;
  },
});

const Market = (): React.ReactElement | null => {
  const relayEnvironment = useRelayEnvironment();
  const { communityId } = useParams<{ communityId: string }>();
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
  const prevFiltersRef = useRef<string | null>(null);

  useEffect(() => {
    const currentFilters = JSON.stringify({
      communityId,
      q,
      category,
      condition,
      cursor,
    });

    if (entryPointRef == null || prevFiltersRef.current !== currentFilters) {
      prevFiltersRef.current = currentFilters;
      loadEntryPoint({ communityId, q, category, condition, cursor });
    }
  }, [communityId, q, category, condition, cursor]);

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
