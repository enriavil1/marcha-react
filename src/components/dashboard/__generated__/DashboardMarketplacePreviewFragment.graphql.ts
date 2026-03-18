/**
 * @generated SignedSource<<a043cc18b03c146b4527972d7ac7c4e6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DashboardMarketplacePreviewFragment$data = {
  readonly productsCollection: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly createdAt: string;
        readonly id: string;
        readonly image: string;
        readonly name: string;
        readonly price: number;
      };
    }>;
  } | null | undefined;
  readonly " $fragmentType": "DashboardMarketplacePreviewFragment";
};
export type DashboardMarketplacePreviewFragment$key = {
  readonly " $data"?: DashboardMarketplacePreviewFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"DashboardMarketplacePreviewFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DashboardMarketplacePreviewFragment",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "filter",
          "value": {
            "isPublic": {
              "eq": true
            }
          }
        },
        {
          "kind": "Literal",
          "name": "first",
          "value": 3
        },
        {
          "kind": "Literal",
          "name": "orderBy",
          "value": [
            {
              "createdAt": "DescNullsLast"
            }
          ]
        }
      ],
      "concreteType": "ProductsConnection",
      "kind": "LinkedField",
      "name": "productsCollection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ProductsEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Products",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "createdAt",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "productsCollection(filter:{\"isPublic\":{\"eq\":true}},first:3,orderBy:[{\"createdAt\":\"DescNullsLast\"}])"
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "0a483838b7dfab804b378191f17d30fb";

export default node;
