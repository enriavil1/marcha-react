import {
  ArrowLeftOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Row,
  Tag,
  Typography,
  message,
} from 'antd';
import graphql from 'babel-plugin-relay/macro';
import React, { useCallback, useEffect, useState } from 'react';
import {
  EntryPointComponent,
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
} from 'react-relay';
import { useNavigate, useParams } from 'react-router-dom';

import {
  BRAND_PRIMARY,
  COLOR_SUCCESS,
  COLOR_WARNING,
  NEUTRAL_500,
  NEUTRAL_900,
  RADIUS_LG,
  RADIUS_SM,
} from '../../design';
import fetchFromStorage from '../../utils/fetch_from_storage';
import { Paths } from '../../views/paths';
import EditListingModal from './EditListingModal';
import type { ListingData } from './EditListingModal';
import type { MyListingsPageQuery } from './__generated__/MyListingsPageQuery.graphql';
import UpdateProductMutation from './graphql/UpdateProductMutation.graphql';
import type { UpdateProductMutationMutation } from './graphql/__generated__/UpdateProductMutationMutation.graphql';

export const myListingsPageQuery = graphql`
  query MyListingsPageQuery($userId: UUIDFilter!) {
    productsCollection(
      filter: { userId: $userId }
      orderBy: [{ createdAt: DescNullsLast }]
    ) {
      edges {
        node {
          id
          name
          description
          price
          image
          condition
          categoryId
          isPublic
          createdAt
          productImagesCollection(
            first: 1
            orderBy: [{ displayOrder: AscNullsLast }]
          ) {
            edges {
              node {
                imageUrl
              }
            }
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

type ListingNode = NonNullable<
  NonNullable<
    NonNullable<
      ReturnType<typeof usePreloadedQuery<MyListingsPageQuery>>
    >['productsCollection']
  >['edges']
>[number]['node'];

/** Derive a status label from the listing data. */
const getStatus = (listing: ListingNode): { label: string; color: string } => {
  if (!listing.isPublic) {
    return { label: 'Unlisted', color: 'default' };
  }
  return { label: 'Active', color: 'success' };
};

type ListingCardProps = {
  listing: ListingNode;
  onEdit: (listing: ListingNode) => void;
  onToggleVisibility: (listing: ListingNode) => void;
};

/**
 * A single listing card in the My Listings grid.
 * Shows image, name, price, status badge, and action buttons.
 */
const MyListingCard: React.FC<ListingCardProps> = ({
  listing,
  onEdit,
  onToggleVisibility,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const status = getStatus(listing);

  useEffect(() => {
    const firstProductImage =
      listing.productImagesCollection?.edges?.[0]?.node?.imageUrl;
    const imagePath = firstProductImage || listing.image;

    if (imagePath) {
      fetchFromStorage(imagePath, 'product-images').then((blob) => {
        if (blob) setImageUrl(URL.createObjectURL(blob));
      });
    }
  }, [listing]);

  return (
    <Card
      style={{ borderRadius: RADIUS_LG, overflow: 'hidden' }}
      styles={{ body: { padding: 0 } }}
    >
      {/* Image */}
      <div
        style={{
          height: 180,
          background: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Avatar
            icon={<ShopOutlined />}
            size={64}
            style={{ backgroundColor: '#e8e8e8' }}
          />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '12px 16px' }}>
        <Flex justify="space-between" align="start" style={{ marginBottom: 4 }}>
          <Typography.Text
            strong
            style={{
              fontSize: 14,
              color: NEUTRAL_900,
              display: 'block',
              lineHeight: '1.3',
            }}
            ellipsis
          >
            {listing.name}
          </Typography.Text>
          <Tag
            color={status.color}
            style={{
              fontSize: 11,
              padding: '0 6px',
              lineHeight: '18px',
              borderRadius: RADIUS_SM,
              marginLeft: 8,
              flexShrink: 0,
            }}
          >
            {status.label}
          </Tag>
        </Flex>

        <Typography.Text
          style={{
            fontSize: 16,
            color: BRAND_PRIMARY,
            fontWeight: 600,
            display: 'block',
            marginBottom: 12,
          }}
        >
          £{listing.price.toFixed(2)}
        </Typography.Text>

        {/* Actions */}
        <Flex gap={8}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(listing)}
            style={{ flex: 1 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            icon={listing.isPublic ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            onClick={() => onToggleVisibility(listing)}
            style={{ flex: 1 }}
            type={listing.isPublic ? 'default' : 'primary'}
          >
            {listing.isPublic ? 'Unlist' : 'Re-list'}
          </Button>
        </Flex>
      </div>
    </Card>
  );
};

type Props = {
  queries: {
    myListingsQuery: PreloadedQuery<MyListingsPageQuery>;
  };
};

const MyListingsPage: EntryPointComponent<
  {
    myListingsQuery: MyListingsPageQuery;
  },
  Record<string, never>,
  Record<string, never>
> = (props: Props): React.ReactElement => {
  const navigate = useNavigate();
  const { communityId } = useParams<{ communityId: string }>();
  const basePath = `/portal/${communityId}`;

  const data = usePreloadedQuery<MyListingsPageQuery>(
    myListingsPageQuery,
    props.queries.myListingsQuery
  );

  const listings = data.productsCollection?.edges ?? [];
  const categories =
    data.categoriesCollection?.edges?.map((e) => ({
      id: e.node.id,
      name: e.node.name,
    })) ?? [];

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<ListingData | null>(
    null
  );

  const [commitToggle] = useMutation<UpdateProductMutationMutation>(
    UpdateProductMutation
  );

  const handleEdit = useCallback((listing: ListingNode) => {
    setEditingListing({
      id: listing.id,
      name: listing.name,
      description: listing.description,
      price: listing.price,
      condition: listing.condition,
      categoryId: listing.categoryId ?? null,
      isPublic: listing.isPublic,
    });
    setEditModalOpen(true);
  }, []);

  const handleToggleVisibility = useCallback(
    (listing: ListingNode) => {
      const newIsPublic = !listing.isPublic;
      commitToggle({
        variables: {
          set: { isPublic: newIsPublic },
          filter: { id: { eq: listing.id } },
          atMost: 1,
        },
        onCompleted: () => {
          message.success(
            newIsPublic
              ? 'Listing is now visible in the marketplace.'
              : 'Listing has been unlisted.'
          );
        },
        onError: (err) => {
          message.error(`Failed to update listing: ${err.message}`);
        },
      });
    },
    [commitToggle]
  );

  const handleEditSuccess = useCallback(() => {
    // The Relay store will be updated by the mutation response
  }, []);

  const activeCount = listings.filter((e) => e.node.isPublic).length;
  const unlistedCount = listings.filter((e) => !e.node.isPublic).length;

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`${basePath}/${Paths.Market}`)}
        style={{ marginBottom: 16, paddingLeft: 0 }}
      >
        Back to Marketplace
      </Button>

      <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            My Listings
          </Typography.Title>
          <Typography.Text style={{ color: NEUTRAL_500, fontSize: 13 }}>
            {listings.length} listing{listings.length !== 1 ? 's' : ''} total
            {activeCount > 0 && (
              <span style={{ color: COLOR_SUCCESS, marginLeft: 8 }}>
                {activeCount} active
              </span>
            )}
            {unlistedCount > 0 && (
              <span style={{ color: COLOR_WARNING, marginLeft: 8 }}>
                {unlistedCount} unlisted
              </span>
            )}
          </Typography.Text>
        </div>
        <Button
          type="primary"
          onClick={() => navigate(`${basePath}/${Paths.Market}/new`)}
        >
          Create New Listing
        </Button>
      </Flex>

      {listings.length === 0 ? (
        <Empty
          description="You haven't created any listings yet"
          style={{ padding: '48px 0' }}
        >
          <Button
            type="primary"
            onClick={() => navigate(`${basePath}/${Paths.Market}/new`)}
          >
            Create Your First Listing
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {listings.map((edge) => (
            <Col xs={24} sm={12} md={8} lg={6} key={edge.node.id}>
              <MyListingCard
                listing={edge.node}
                onEdit={handleEdit}
                onToggleVisibility={handleToggleVisibility}
              />
            </Col>
          ))}
        </Row>
      )}

      <EditListingModal
        open={editModalOpen}
        listing={editingListing}
        categories={categories}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default MyListingsPage;
