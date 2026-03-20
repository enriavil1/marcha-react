import graphql from 'babel-plugin-relay/macro';

/**
 * Relay pagination fragment for the marketplace product list.
 *
 * Queries `productsCommunitiesCollection` to scope products to the current
 * community. Product data is accessed through the nested `product` relation.
 *
 * - @refetchable generates `MarketplacePaginationQuery` automatically.
 * - @connection tells Relay to merge paginated edges under a stable key so
 *   `usePaginationFragment` can append new pages to the existing list.
 * - @argumentDefinitions declares the variables forwarded from the parent query.
 *
 * pageInfo is included so the endCursor is available in the fragment data
 * without needing `as any` casts in MarketplaceContainer.
 *
 * Product-level fields (name, isPublic, categoryId, condition) are fetched
 * alongside the fragment spread to enable client-side filtering.
 */
export const marketplacePaginationFragment = graphql`
  fragment MarketplacePaginationFragment on Query
  @refetchable(queryName: "MarketplacePaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 12 }
    cursor: { type: "Cursor" }
    filter: { type: "ProductsCommunitiesFilter" }
    orderBy: { type: "[ProductsCommunitiesOrderBy!]" }
  ) {
    productsCommunitiesCollection(
      first: $count
      after: $cursor
      filter: $filter
      orderBy: $orderBy
    ) @connection(key: "Marketplace_productsCommunitiesCollection") {
      edges {
        node {
          nodeId
          product {
            ...ProductCardFragmentQuery
            name
            categoryId
            condition
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
