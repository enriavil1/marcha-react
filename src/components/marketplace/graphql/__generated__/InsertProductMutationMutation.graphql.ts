/**
 * @generated SignedSource<<0edc7597c497d5b8117889c89d27ef3d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */

/* eslint-disable */
// @ts-nocheck
import { ConcreteRequest, Mutation } from 'relay-runtime';

export type ProductCondition =
  | 'Good'
  | 'Like_new'
  | 'New'
  | 'Used'
  | '%future added value';
export type ProductsInsertInput = {
  categoryId?: string | null | undefined;
  condition?: ProductCondition | null | undefined;
  createdAt?: string | null | undefined;
  description?: string | null | undefined;
  image?: string | null | undefined;
  isPublic?: boolean | null | undefined;
  name?: string | null | undefined;
  price?: number | null | undefined;
  userId?: string | null | undefined;
};
export type InsertProductMutationMutation$variables = {
  objects: ReadonlyArray<ProductsInsertInput>;
};
export type InsertProductMutationMutation$data = {
  readonly insertIntoProductsCollection:
    | {
        readonly affectedCount: number;
        readonly records: ReadonlyArray<{
          readonly categoryId: string | null | undefined;
          readonly condition: ProductCondition;
          readonly description: string;
          readonly id: string;
          readonly image: string;
          readonly isPublic: boolean;
          readonly name: string;
          readonly price: number;
          readonly userId: string;
        }>;
      }
    | null
    | undefined;
};
export type InsertProductMutationMutation = {
  response: InsertProductMutationMutation$data;
  variables: InsertProductMutationMutation$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'objects',
      },
    ],
    v1 = [
      {
        kind: 'Variable',
        name: 'objects',
        variableName: 'objects',
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'affectedCount',
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'id',
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'name',
      storageKey: null,
    },
    v5 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'price',
      storageKey: null,
    },
    v6 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'image',
      storageKey: null,
    },
    v7 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'description',
      storageKey: null,
    },
    v8 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'condition',
      storageKey: null,
    },
    v9 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'categoryId',
      storageKey: null,
    },
    v10 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'userId',
      storageKey: null,
    },
    v11 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'isPublic',
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Fragment',
      metadata: null,
      name: 'InsertProductMutationMutation',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'ProductsInsertResponse',
          kind: 'LinkedField',
          name: 'insertIntoProductsCollection',
          plural: false,
          selections: [
            v2 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: 'Products',
              kind: 'LinkedField',
              name: 'records',
              plural: true,
              selections: [
                v3 /*: any*/,
                v4 /*: any*/,
                v5 /*: any*/,
                v6 /*: any*/,
                v7 /*: any*/,
                v8 /*: any*/,
                v9 /*: any*/,
                v10 /*: any*/,
                v11 /*: any*/,
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      type: 'Mutation',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Operation',
      name: 'InsertProductMutationMutation',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'ProductsInsertResponse',
          kind: 'LinkedField',
          name: 'insertIntoProductsCollection',
          plural: false,
          selections: [
            v2 /*: any*/,
            {
              alias: null,
              args: null,
              concreteType: 'Products',
              kind: 'LinkedField',
              name: 'records',
              plural: true,
              selections: [
                v3 /*: any*/,
                v4 /*: any*/,
                v5 /*: any*/,
                v6 /*: any*/,
                v7 /*: any*/,
                v8 /*: any*/,
                v9 /*: any*/,
                v10 /*: any*/,
                v11 /*: any*/,
                {
                  alias: null,
                  args: null,
                  kind: 'ScalarField',
                  name: 'nodeId',
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
    },
    params: {
      cacheID: 'f9ecadf4edd415b3ee1b627c08a88119',
      id: null,
      metadata: {},
      name: 'InsertProductMutationMutation',
      operationKind: 'mutation',
      text: 'mutation InsertProductMutationMutation(\n  $objects: [ProductsInsertInput!]!\n) {\n  insertIntoProductsCollection(objects: $objects) {\n    affectedCount\n    records {\n      id\n      name\n      price\n      image\n      description\n      condition\n      categoryId\n      userId\n      isPublic\n      nodeId\n    }\n  }\n}\n',
    },
  };
})();

(node as any).hash = 'c65ded89cba14d8a6da3f6621aa2b84a';

export default node;
