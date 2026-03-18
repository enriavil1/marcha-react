import graphql from 'babel-plugin-relay/macro';
import React from 'react';
import {
  EntryPointComponent,
  PreloadedQuery,
  usePreloadedQuery,
} from 'react-relay';

import MarketplaceContainer from './MarketplaceContainer';
import type { MarketplaceWrapperQueryQuery } from './__generated__/MarketplaceWrapperQueryQuery.graphql';

/**
 * Root query for the marketplace page.
 *
 * $count / $cursor are forwarded into the @refetchable pagination fragment
 * via @arguments so Relay knows the initial page size and starting cursor.
 * $filter / $orderBy are product filter and sort, driven by URL search params.
 *
 * The productsCollection is owned by MarketplacePaginationFragment (spread
 * below) so usePaginationFragment can manage cursor-based pagination inside
 * MarketplaceContainer.
 *
 * categoriesCollection is fetched here (non-paginated) to populate the
 * category filter dropdown.
 */
export const marketplaceWrapperQuery = graphql`
  query MarketplaceWrapperQueryQuery(
    $count: Int
    $cursor: Cursor
    $filter: ProductsFilter
    $orderBy: [ProductsOrderBy!]
  ) {
    ...MarketplacePaginationFragment
      @arguments(
        count: $count
        cursor: $cursor
        filter: $filter
        orderBy: $orderBy
      )
    categoriesCollection {
      edges {
        node {
          id
          name
          nodeId
        }
      }
    }
  }
`;

type Props = {
  queries: {
    marketplaceQuery: PreloadedQuery<MarketplaceWrapperQueryQuery>;
  };
};

const MarketplaceWrapper: EntryPointComponent<
  {
    marketplaceQuery: MarketplaceWrapperQueryQuery;
  },
  Record<string, never>,
  Record<string, never>
> = (props: Props): React.ReactElement => {
  const data = usePreloadedQuery<MarketplaceWrapperQueryQuery>(
    marketplaceWrapperQuery,
    props.queries.marketplaceQuery
  );

  const categories =
    data.categoriesCollection?.edges?.map((e) => ({
      id: e.node.id,
      name: e.node.name,
    })) ?? [];

  return <MarketplaceContainer fragmentRef={data} categories={categories} />;
};

export default MarketplaceWrapper;
