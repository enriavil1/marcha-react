import { EditOutlined, ShopOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { usePreloadedQuery } from 'react-relay';

import {
  BRAND_PRIMARY,
  NEUTRAL_100,
  NEUTRAL_900,
  RADIUS_LG,
} from '../../../design';
import fetchFromStorage from '../../../utils/fetch_from_storage';
import { MyListingsPageQuery } from '../__generated__/MyListingsPageQuery.graphql';

export type ListingNode = NonNullable<
  NonNullable<
    NonNullable<
      ReturnType<typeof usePreloadedQuery<MyListingsPageQuery>>
    >['productsCollection']
  >['edges']
>[number]['node'];

type ListingCardProps = {
  listing: ListingNode;
  onEdit: (listing: ListingNode) => void;
};

const MyListingCard: React.FC<ListingCardProps> = ({ listing, onEdit }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const imagePath =
      listing.productImagesCollection?.edges?.[0]?.node?.imageUrl;

    if (imagePath) {
      fetchFromStorage(imagePath, 'product-images').then((blob) => {
        if (blob) setImageUrl(URL.createObjectURL(blob));
      });
    }
  }, [listing.productImagesCollection]);

  return (
    <Card
      style={{ borderRadius: RADIUS_LG, overflow: 'hidden' }}
      styles={{ body: { padding: 0 } }}
    >
      <Flex
        justify="center"
        align="center"
        style={{
          height: 180,
          background: NEUTRAL_100,
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
            style={{ backgroundColor: NEUTRAL_100 }}
          />
        )}
      </Flex>

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

        <Flex gap={8}>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(listing)}
            style={{ flex: 1 }}
          >
            Edit
          </Button>
        </Flex>
      </div>
    </Card>
  );
};

export default MyListingCard;
