/**
 * @generated SignedSource<<674734650ee4d01679a95aa36c463419>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FilterIs = "NOT_NULL" | "NULL" | "%future added value";
export type OrderByDirection = "AscNullsFirst" | "AscNullsLast" | "DescNullsFirst" | "DescNullsLast" | "%future added value";
export type ProductsCommunitiesFilter = {
  and?: ReadonlyArray<ProductsCommunitiesFilter> | null | undefined;
  communityId?: BigIntFilter | null | undefined;
  createdAt?: DatetimeFilter | null | undefined;
  id?: BigIntFilter | null | undefined;
  nodeId?: IDFilter | null | undefined;
  not?: ProductsCommunitiesFilter | null | undefined;
  or?: ReadonlyArray<ProductsCommunitiesFilter> | null | undefined;
  productId?: BigIntFilter | null | undefined;
};
export type BigIntFilter = {
  eq?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  in?: ReadonlyArray<string> | null | undefined;
  is?: FilterIs | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  neq?: string | null | undefined;
};
export type DatetimeFilter = {
  eq?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  in?: ReadonlyArray<string> | null | undefined;
  is?: FilterIs | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  neq?: string | null | undefined;
};
export type IDFilter = {
  eq?: string | null | undefined;
};
export type ProductsCommunitiesOrderBy = {
  communityId?: OrderByDirection | null | undefined;
  createdAt?: OrderByDirection | null | undefined;
  id?: OrderByDirection | null | undefined;
  productId?: OrderByDirection | null | undefined;
};
export type MarketplaceWrapperQueryQuery$variables = {
  count?: number | null | undefined;
  cursor?: string | null | undefined;
  filter?: ProductsCommunitiesFilter | null | undefined;
  orderBy?: ReadonlyArray<ProductsCommunitiesOrderBy> | null | undefined;
};
export type MarketplaceWrapperQueryQuery$data = {
  readonly categoriesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly name: string;
        readonly nodeId: string;
      };
    }>;
  } | null | undefined;
  readonly " $fragmentSpreads": FragmentRefs<"MarketplacePaginationFragment">;
};
export type MarketplaceWrapperQueryQuery = {
  response: MarketplaceWrapperQueryQuery$data;
  variables: MarketplaceWrapperQueryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "count"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cursor"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filter"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orderBy"
  }
],
v1 = {
  "kind": "Variable",
  "name": "filter",
  "variableName": "filter"
},
v2 = {
  "kind": "Variable",
  "name": "orderBy",
  "variableName": "orderBy"
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "nodeId",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "CategoriesConnection",
  "kind": "LinkedField",
  "name": "categoriesCollection",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CategoriesEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Categories",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v3/*: any*/),
            (v4/*: any*/),
            (v5/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v1/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  (v2/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MarketplaceWrapperQueryQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "MarketplacePaginationFragment"
      },
      (v6/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MarketplaceWrapperQueryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "ProductsCommunitiesConnection",
        "kind": "LinkedField",
        "name": "productsCommunitiesCollection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ProductsCommunitiesEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ProductsCommunities",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Products",
                    "kind": "LinkedField",
                    "name": "product",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "description",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "price",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "image",
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isPublic",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "categoryId",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "condition",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "userId",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Profiles",
                        "kind": "LinkedField",
                        "name": "user",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "avatarUrl",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "username",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "firstName",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "lastName",
                            "storageKey": null
                          },
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 1
                          },
                          {
                            "kind": "Literal",
                            "name": "orderBy",
                            "value": [
                              {
                                "displayOrder": "AscNullsLast"
                              }
                            ]
                          }
                        ],
                        "concreteType": "ProductImagesConnection",
                        "kind": "LinkedField",
                        "name": "productImagesCollection",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ProductImagesEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "ProductImages",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "imageUrl",
                                    "storageKey": null
                                  },
                                  (v5/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "productImagesCollection(first:1,orderBy:[{\"displayOrder\":\"AscNullsLast\"}])"
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v7/*: any*/),
        "filters": [
          "filter",
          "orderBy"
        ],
        "handle": "connection",
        "key": "Marketplace_productsCommunitiesCollection",
        "kind": "LinkedHandle",
        "name": "productsCommunitiesCollection"
      },
      (v6/*: any*/)
    ]
  },
  "params": {
    "cacheID": "8d08ad49c5fcd5d628a643cf26916cec",
    "id": null,
    "metadata": {},
    "name": "MarketplaceWrapperQueryQuery",
    "operationKind": "query",
    "text": "query MarketplaceWrapperQueryQuery(\n  $count: Int\n  $cursor: Cursor\n  $filter: ProductsCommunitiesFilter\n  $orderBy: [ProductsCommunitiesOrderBy!]\n) {\n  ...MarketplacePaginationFragment_1FfpYs\n  categoriesCollection {\n    edges {\n      node {\n        id\n        name\n        nodeId\n      }\n    }\n  }\n}\n\nfragment MarketplacePaginationFragment_1FfpYs on Query {\n  productsCommunitiesCollection(first: $count, after: $cursor, filter: $filter, orderBy: $orderBy) {\n    edges {\n      node {\n        nodeId\n        product {\n          ...ProductCardFragmentQuery\n          name\n          isPublic\n          categoryId\n          condition\n          nodeId\n        }\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ProductCardFragmentQuery on Products {\n  name\n  description\n  price\n  image\n  id\n  isPublic\n  categoryId\n  condition\n  userId\n  user {\n    avatarUrl\n    username\n    firstName\n    lastName\n    nodeId\n  }\n  productImagesCollection(first: 1, orderBy: [{displayOrder: AscNullsLast}]) {\n    edges {\n      node {\n        imageUrl\n        nodeId\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fdfff4d0ef1ee5eaa015e86edb3e9edf";

export default node;
