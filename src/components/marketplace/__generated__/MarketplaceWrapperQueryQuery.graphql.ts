/**
 * @generated SignedSource<<30bee90384b3f79e572768f8af80445b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */

/* eslint-disable */
// @ts-nocheck
import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from 'relay-runtime';

export type FilterIs = 'NOT_NULL' | 'NULL' | '%future added value';
export type OrderByDirection =
  | 'AscNullsFirst'
  | 'AscNullsLast'
  | 'DescNullsFirst'
  | 'DescNullsLast'
  | '%future added value';
export type ProductCondition =
  | 'Good'
  | 'Like_new'
  | 'New'
  | 'Used'
  | '%future added value';
export type ProductsFilter = {
  and?: ReadonlyArray<ProductsFilter> | null | undefined;
  categoryId?: UUIDFilter | null | undefined;
  condition?: ProductConditionFilter | null | undefined;
  createdAt?: DatetimeFilter | null | undefined;
  description?: StringFilter | null | undefined;
  id?: BigIntFilter | null | undefined;
  image?: StringFilter | null | undefined;
  isPublic?: BooleanFilter | null | undefined;
  name?: StringFilter | null | undefined;
  nodeId?: IDFilter | null | undefined;
  not?: ProductsFilter | null | undefined;
  or?: ReadonlyArray<ProductsFilter> | null | undefined;
  price?: FloatFilter | null | undefined;
  userId?: UUIDFilter | null | undefined;
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
export type StringFilter = {
  eq?: string | null | undefined;
  gt?: string | null | undefined;
  gte?: string | null | undefined;
  ilike?: string | null | undefined;
  in?: ReadonlyArray<string> | null | undefined;
  iregex?: string | null | undefined;
  is?: FilterIs | null | undefined;
  like?: string | null | undefined;
  lt?: string | null | undefined;
  lte?: string | null | undefined;
  neq?: string | null | undefined;
  regex?: string | null | undefined;
  startsWith?: string | null | undefined;
};
export type FloatFilter = {
  eq?: number | null | undefined;
  gt?: number | null | undefined;
  gte?: number | null | undefined;
  in?: ReadonlyArray<number> | null | undefined;
  is?: FilterIs | null | undefined;
  lt?: number | null | undefined;
  lte?: number | null | undefined;
  neq?: number | null | undefined;
};
export type UUIDFilter = {
  eq?: string | null | undefined;
  in?: ReadonlyArray<string> | null | undefined;
  is?: FilterIs | null | undefined;
  neq?: string | null | undefined;
};
export type ProductConditionFilter = {
  eq?: ProductCondition | null | undefined;
  in?: ReadonlyArray<ProductCondition> | null | undefined;
  is?: FilterIs | null | undefined;
  neq?: ProductCondition | null | undefined;
};
export type BooleanFilter = {
  eq?: boolean | null | undefined;
  is?: FilterIs | null | undefined;
};
export type IDFilter = {
  eq?: string | null | undefined;
};
export type ProductsOrderBy = {
  categoryId?: OrderByDirection | null | undefined;
  condition?: OrderByDirection | null | undefined;
  createdAt?: OrderByDirection | null | undefined;
  description?: OrderByDirection | null | undefined;
  id?: OrderByDirection | null | undefined;
  image?: OrderByDirection | null | undefined;
  isPublic?: OrderByDirection | null | undefined;
  name?: OrderByDirection | null | undefined;
  price?: OrderByDirection | null | undefined;
  userId?: OrderByDirection | null | undefined;
};
export type MarketplaceWrapperQueryQuery$variables = {
  filter?: ProductsFilter | null | undefined;
  orderBy?: ReadonlyArray<ProductsOrderBy> | null | undefined;
};
export type MarketplaceWrapperQueryQuery$data = {
  readonly categoriesCollection:
    | {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly id: string;
            readonly name: string;
            readonly nodeId: string;
          };
        }>;
      }
    | null
    | undefined;
  readonly productsCollection:
    | {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly category:
              | {
                  readonly id: string;
                  readonly name: string;
                }
              | null
              | undefined;
            readonly ' $fragmentSpreads': FragmentRefs<'ProductCardFragmentQuery'>;
          };
        }>;
      }
    | null
    | undefined;
};
export type MarketplaceWrapperQueryQuery = {
  response: MarketplaceWrapperQueryQuery$data;
  variables: MarketplaceWrapperQueryQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'filter',
      },
      {
        defaultValue: null,
        kind: 'LocalArgument',
        name: 'orderBy',
      },
    ],
    v1 = [
      {
        kind: 'Variable',
        name: 'filter',
        variableName: 'filter',
      },
      {
        kind: 'Variable',
        name: 'orderBy',
        variableName: 'orderBy',
      },
    ],
    v2 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'id',
      storageKey: null,
    },
    v3 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'name',
      storageKey: null,
    },
    v4 = {
      alias: null,
      args: null,
      kind: 'ScalarField',
      name: 'nodeId',
      storageKey: null,
    },
    v5 = [v2 /*: any*/, v3 /*: any*/, v4 /*: any*/],
    v6 = {
      alias: null,
      args: null,
      concreteType: 'CategoriesConnection',
      kind: 'LinkedField',
      name: 'categoriesCollection',
      plural: false,
      selections: [
        {
          alias: null,
          args: null,
          concreteType: 'CategoriesEdge',
          kind: 'LinkedField',
          name: 'edges',
          plural: true,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: 'Categories',
              kind: 'LinkedField',
              name: 'node',
              plural: false,
              selections: v5 /*: any*/,
              storageKey: null,
            },
          ],
          storageKey: null,
        },
      ],
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Fragment',
      metadata: null,
      name: 'MarketplaceWrapperQueryQuery',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'ProductsConnection',
          kind: 'LinkedField',
          name: 'productsCollection',
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: 'ProductsEdge',
              kind: 'LinkedField',
              name: 'edges',
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: 'Products',
                  kind: 'LinkedField',
                  name: 'node',
                  plural: false,
                  selections: [
                    {
                      args: null,
                      kind: 'FragmentSpread',
                      name: 'ProductCardFragmentQuery',
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: 'Categories',
                      kind: 'LinkedField',
                      name: 'category',
                      plural: false,
                      selections: [v2 /*: any*/, v3 /*: any*/],
                      storageKey: null,
                    },
                  ],
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        v6 /*: any*/,
      ],
      type: 'Query',
      abstractKey: null,
    },
    kind: 'Request',
    operation: {
      argumentDefinitions: v0 /*: any*/,
      kind: 'Operation',
      name: 'MarketplaceWrapperQueryQuery',
      selections: [
        {
          alias: null,
          args: v1 /*: any*/,
          concreteType: 'ProductsConnection',
          kind: 'LinkedField',
          name: 'productsCollection',
          plural: false,
          selections: [
            {
              alias: null,
              args: null,
              concreteType: 'ProductsEdge',
              kind: 'LinkedField',
              name: 'edges',
              plural: true,
              selections: [
                {
                  alias: null,
                  args: null,
                  concreteType: 'Products',
                  kind: 'LinkedField',
                  name: 'node',
                  plural: false,
                  selections: [
                    v3 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      kind: 'ScalarField',
                      name: 'description',
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: 'ScalarField',
                      name: 'price',
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      kind: 'ScalarField',
                      name: 'image',
                      storageKey: null,
                    },
                    v2 /*: any*/,
                    {
                      alias: null,
                      args: null,
                      concreteType: 'Profiles',
                      kind: 'LinkedField',
                      name: 'user',
                      plural: false,
                      selections: [
                        {
                          alias: null,
                          args: null,
                          kind: 'ScalarField',
                          name: 'avatarUrl',
                          storageKey: null,
                        },
                        {
                          alias: null,
                          args: null,
                          kind: 'ScalarField',
                          name: 'username',
                          storageKey: null,
                        },
                        v4 /*: any*/,
                      ],
                      storageKey: null,
                    },
                    {
                      alias: null,
                      args: null,
                      concreteType: 'Categories',
                      kind: 'LinkedField',
                      name: 'category',
                      plural: false,
                      selections: v5 /*: any*/,
                      storageKey: null,
                    },
                    v4 /*: any*/,
                  ],
                  storageKey: null,
                },
              ],
              storageKey: null,
            },
          ],
          storageKey: null,
        },
        v6 /*: any*/,
      ],
    },
    params: {
      cacheID: '69fef7f38b8d331faf568640f8719870',
      id: null,
      metadata: {},
      name: 'MarketplaceWrapperQueryQuery',
      operationKind: 'query',
      text: 'query MarketplaceWrapperQueryQuery(\n  $filter: ProductsFilter\n  $orderBy: [ProductsOrderBy!]\n) {\n  productsCollection(filter: $filter, orderBy: $orderBy) {\n    edges {\n      node {\n        ...ProductCardFragmentQuery\n        category {\n          id\n          name\n          nodeId\n        }\n        nodeId\n      }\n    }\n  }\n  categoriesCollection {\n    edges {\n      node {\n        id\n        name\n        nodeId\n      }\n    }\n  }\n}\n\nfragment ProductCardFragmentQuery on Products {\n  name\n  description\n  price\n  image\n  id\n  user {\n    avatarUrl\n    username\n    nodeId\n  }\n}\n',
    },
  };
})();

(node as any).hash = '6bd2444871db7d735219396b893aafc6';

export default node;
