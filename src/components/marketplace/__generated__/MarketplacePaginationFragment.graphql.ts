/**
 * @generated SignedSource<<d6ca4362fc71ccb73fe24c90564c2723>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type ProductCondition = "Good" | "Like_new" | "New" | "Used" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type MarketplacePaginationFragment$data = {
  readonly productsCommunitiesCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly nodeId: string;
        readonly product: {
          readonly categoryId: string;
          readonly condition: ProductCondition;
          readonly isPublic: boolean;
          readonly name: string;
          readonly " $fragmentSpreads": FragmentRefs<"ProductCardFragmentQuery">;
        } | null | undefined;
      };
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null | undefined;
      readonly hasNextPage: boolean;
    };
  } | null | undefined;
  readonly " $fragmentType": "MarketplacePaginationFragment";
};
export type MarketplacePaginationFragment$key = {
  readonly " $data"?: MarketplacePaginationFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MarketplacePaginationFragment">;
};

const node: ReaderFragment = (function(){
var v0 = [
  "productsCommunitiesCollection"
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": 12,
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
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": require('./MarketplacePaginationQuery.graphql')
    }
  },
  "name": "MarketplacePaginationFragment",
  "selections": [
    {
      "alias": "productsCommunitiesCollection",
      "args": [
        {
          "kind": "Variable",
          "name": "filter",
          "variableName": "filter"
        },
        {
          "kind": "Variable",
          "name": "orderBy",
          "variableName": "orderBy"
        }
      ],
      "concreteType": "ProductsCommunitiesConnection",
      "kind": "LinkedField",
      "name": "__Marketplace_productsCommunitiesCollection_connection",
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "nodeId",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "Products",
                  "kind": "LinkedField",
                  "name": "product",
                  "plural": false,
                  "selections": [
                    {
                      "args": null,
                      "kind": "FragmentSpread",
                      "name": "ProductCardFragmentQuery"
                    },
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "name",
                      "storageKey": null
                    },
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
                    }
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
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "94d4ed5af2ea144168436de2654fb102";

export default node;
