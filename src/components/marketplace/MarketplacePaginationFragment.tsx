import graphql from 'babel-plugin-relay/macro';

/**
 * Relay pagination fragment for the marketplace product list.
 *
 * - @refetchable generates `MarketplacePaginationQuery` automatically.
 * - @connection tells Relay to merge paginated edges under a stable key so
 *   `usePaginationFragment` can append new pages to the existing list.
 * - @argumentDefinitions declares the variables forwarded from the parent query.
 *
 * pageInfo is included so the endCursor is available in the fragment data
 * without needing `as any` casts in MarketplaceContainer.
 */
export const marketplacePaginationFragment = graphql`
  fragment MarketplacePaginationFragment on Query
  @refetchable(queryName: "MarketplacePaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 12 }
    cursor: { type: "Cursor" }
    filter: { type: "ProductsFilter" }
    orderBy: { type: "[ProductsOrderBy!]" }
  ) {
    productsCollection(
      first: $count
      after: $cursor
      filter: $filter
      orderBy: $orderBy
    ) @connection(key: "Marketplace_productsCollection") {
      edges {
        node {
          ...ProductCardFragmentQuery
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
