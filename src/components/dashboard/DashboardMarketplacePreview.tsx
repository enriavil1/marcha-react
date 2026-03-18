// src/components/dashboard/DashboardMarketplacePreview.tsx
import { ShopOutlined } from '@ant-design/icons';
import { Avatar, Card, List, Tag, Typography } from 'antd';
import graphql from 'babel-plugin-relay/macro';
import React, { useEffect, useState } from 'react';
import { useFragment } from 'react-relay';

import {
  BRAND_PRIMARY,
  NEUTRAL_500,
  NEUTRAL_900,
  RADIUS_LG,
  RADIUS_SM,
} from '../../design';
import fetchFromStorage from '../../utils/fetch_from_storage';
import type { DashboardMarketplacePreviewFragment$key } from './__generated__/DashboardMarketplacePreviewFragment.graphql';

/**
 * Fragment on Query that fetches the 3 most recent public marketplace listings.
 * Spread this fragment in the parent DashboardComponentQuery so the data is
 * co-located with the component that uses it.
 */
export const dashboardMarketplacePreviewFragment = graphql`
  fragment DashboardMarketplacePreviewFragment on Query {
    productsCollection(
      first: 3
      orderBy: [{ createdAt: DescNullsLast }]
      filter: { isPublic: { eq: true } }
    ) {
      edges {
        node {
          id
          name
          price
          image
          createdAt
        }
      }
    }
  }
`;

/** A listing is "New" if it was created within the last 7 days. */
const isNewListing = (createdAt: string): boolean => {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return new Date(createdAt).getTime() > sevenDaysAgo;
};

type ListingRowProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  createdAt: string;
  onNavigate: (id: string) => void;
};

/**
 * A single compact listing row: thumbnail | name + price | optional New badge.
 */
const ListingRow: React.FC<ListingRowProps> = ({
  id,
  name,
  price,
  image,
  createdAt,
  onNavigate,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchFromStorage(image, 'product-images').then((blob) => {
      if (blob) setImageUrl(URL.createObjectURL(blob));
    });
  }, [image]);

  return (
    <List.Item
      style={{
        padding: '8px 0',
        cursor: 'pointer',
        borderBottom: `1px solid #f0f0f0`,
      }}
      onClick={() => onNavigate(id)}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            src={imageUrl ?? undefined}
            icon={!imageUrl ? <ShopOutlined /> : undefined}
            shape="square"
            size={44}
            style={{
              borderRadius: RADIUS_SM,
              backgroundColor: '#f5f5f5',
              flexShrink: 0,
            }}
          />
        }
        title={
          <Typography.Text
            strong
            style={{
              fontSize: 13,
              color: NEUTRAL_900,
              display: 'block',
              lineHeight: '1.3',
              marginBottom: 2,
            }}
            ellipsis
          >
            {name}
          </Typography.Text>
        }
        description={
          <Typography.Text
            style={{ fontSize: 13, color: BRAND_PRIMARY, fontWeight: 600 }}
          >
            £{price.toFixed(2)}
          </Typography.Text>
        }
      />
      {isNewListing(createdAt) && (
        <Tag
          color="green"
          style={{
            fontSize: 11,
            padding: '0 6px',
            lineHeight: '18px',
            borderRadius: RADIUS_SM,
            marginLeft: 8,
            flexShrink: 0,
          }}
        >
          New
        </Tag>
      )}
    </List.Item>
  );
};

type Props = {
  fragmentRef: DashboardMarketplacePreviewFragment$key;
  onBrowse: () => void;
  onNavigateToListing: (id: string) => void;
};

/**
 * Dashboard right-column card showing the 3 most recent marketplace listings.
 *
 * Design spec:
 * - Section header "MARKETPLACE" (uppercase, matching other section headers)
 *   with a "Browse" link on the right
 * - 2-3 compact rows: square thumbnail | product name (bold) | price in brand
 *   orange | "New" badge for listings added within the last 7 days
 * - Hidden on mobile (controlled by the parent Col xs/lg breakpoints)
 */
const DashboardMarketplacePreview: React.FC<Props> = ({
  fragmentRef,
  onBrowse,
  onNavigateToListing,
}) => {
  const data = useFragment(dashboardMarketplacePreviewFragment, fragmentRef);
  const listings = data.productsCollection?.edges ?? [];

  return (
    <Card
      title={
        <Typography.Text
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: NEUTRAL_500,
          }}
        >
          Marketplace
        </Typography.Text>
      }
      extra={
        <Typography.Link
          onClick={onBrowse}
          style={{ fontSize: 13, color: BRAND_PRIMARY }}
        >
          Browse
        </Typography.Link>
      }
      style={{ borderRadius: RADIUS_LG, marginBottom: 24 }}
      styles={{ body: { padding: '0 16px' } }}
    >
      {listings.length === 0 ? (
        <Typography.Text
          type="secondary"
          style={{
            display: 'block',
            padding: '16px 0',
            fontSize: 13,
            textAlign: 'center',
          }}
        >
          No marketplace items yet
        </Typography.Text>
      ) : (
        <List
          dataSource={[...listings]}
          renderItem={(edge) => (
            <ListingRow
              key={edge.node.id}
              id={edge.node.id}
              name={edge.node.name}
              price={edge.node.price}
              image={edge.node.image}
              createdAt={edge.node.createdAt}
              onNavigate={onNavigateToListing}
            />
          )}
        />
      )}
    </Card>
  );
};

export default DashboardMarketplacePreview;
