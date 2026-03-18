import { Flex, Spin } from 'antd';
import React, { Suspense, useEffect, useMemo } from 'react';
import {
  EntryPointContainer,
  useEntryPointLoader,
  useRelayEnvironment,
} from 'react-relay';
import { useSearchParams } from 'react-router-dom';

import MarketplaceWrapperQueryQuery from '../../components/marketplace/__generated__/MarketplaceWrapperQueryQuery.graphql';
import { createEntryPoint } from '../../utils/create_entrypoint';
import JSResource from '../../utils/make_resource';

type EntryPointParams = {
  q?: string;
  category?: string;
  condition?: string;
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

  // Extract filter params from URL
  const q = searchParams.get('q') ?? undefined;
  const category = searchParams.get('category') ?? undefined;
  const condition = searchParams.get('condition') ?? undefined;

  useEffect(() => {
    // Reload the entrypoint whenever filters change
    loadEntryPoint({ q, category, condition });
  }, [q, category, condition]);

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
