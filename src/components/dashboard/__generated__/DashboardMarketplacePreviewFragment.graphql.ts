/**
 * @generated SignedSource<<70b62ac7224591734e8c740d28299805>>
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
        readonly productImagesCollection: {
          readonly edges: ReadonlyArray<{
            readonly node: {
              readonly imageUrl: string;
            };
          }>;
        } | null | undefined;
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
                            }
                          ],
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "storageKey": "productImagesCollection(first:1,orderBy:[{\"displayOrder\":\"AscNullsLast\"}])"
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

(node as any).hash = "5f6482eb76dd51306a1d87f448f288ad";

export default node;
