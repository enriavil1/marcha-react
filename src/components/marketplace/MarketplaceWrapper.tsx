import graphql from 'babel-plugin-relay/macro';
import React from 'react';
import {
  EntryPointComponent,
  PreloadedQuery,
  usePreloadedQuery,
} from 'react-relay';

import MarketplaceContainer from './MarketplaceContainer';
import type { MarketplaceWrapperQueryQuery } from './__generated__/MarketplaceWrapperQueryQuery.graphql';

export const marketplaceWrapperQuery = graphql`
  query MarketplaceWrapperQueryQuery(
    $filter: ProductsFilter
    $orderBy: [ProductsOrderBy!]
  ) {
    productsCollection(filter: $filter, orderBy: $orderBy) {
      edges {
        node {
          ...ProductCardFragmentQuery
          category {
            id
            name
          }
        }
      }
    }
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

  return <MarketplaceContainer data={data} />;
};

export default MarketplaceWrapper;
