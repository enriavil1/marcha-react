// src/components/marketplace/ListingCard.tsx
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Flex, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  BRAND_PRIMARY,
  NEUTRAL_400,
  NEUTRAL_700,
  RADIUS_LG,
  SHADOW_CARD,
} from '../../design';
import fetchFromStorage from '../../utils/fetch_from_storage';
import type { Product } from './types';
import { CONDITION_COLORS, CONDITION_LABELS } from './types';

const { Text, Title } = Typography;

interface ListingCardProps {
  product: Product;
}

const ListingCard: React.FC<ListingCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (product.image) {
      fetchFromStorage(product.image, 'product-images').then((blob) => {
        if (blob) setImageUrl(URL.createObjectURL(blob));
      });
    }
    if (product.user?.avatar_url) {
      fetchFromStorage(product.user.avatar_url, 'avatars').then((blob) => {
        if (blob) setAvatarUrl(URL.createObjectURL(blob));
      });
    }
  }, [product.image, product.user?.avatar_url]);

  const sellerName =
    product.user?.first_name && product.user?.last_name
      ? `${product.user.first_name} ${product.user.last_name}`
      : product.user?.username ?? 'Anonymous';

  return (
    <>
      <style>{`
        .listing-card {
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .listing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
        }
        .listing-card .ant-card-cover img {
          height: 200px;
          object-fit: cover;
        }
      `}</style>
      <Card
        className="listing-card"
        hoverable
        onClick={() => navigate(`listing/${product.id}`)}
        style={{
          borderRadius: RADIUS_LG,
          overflow: 'hidden',
          boxShadow: SHADOW_CARD,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        styles={{ body: { padding: 16, flex: 1 } }}
        cover={
          imageUrl ? (
            <img
              alt={product.name}
              src={imageUrl}
              style={{ height: 200, objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                height: 200,
                background: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: NEUTRAL_400,
                fontSize: 14,
              }}
            >
              No Image
            </div>
          )
        }
      >
        <Flex vertical gap={8} style={{ height: '100%' }}>
          <Flex justify="space-between" align="center">
            <Title
              level={5}
              style={{
                margin: 0,
                fontSize: 16,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {product.name}
            </Title>
          </Flex>

          <Text
            strong
            style={{ fontSize: 18, color: BRAND_PRIMARY, margin: 0 }}
          >
            {product.price === 0 ? 'Free' : `£${product.price.toFixed(2)}`}
          </Text>

          <Flex gap={4} wrap="wrap">
            <Tag color={CONDITION_COLORS[product.condition]}>
              {CONDITION_LABELS[product.condition]}
            </Tag>
            {product.category && (
              <Tag style={{ margin: 0 }}>{product.category.name}</Tag>
            )}
          </Flex>

          <Text
            type="secondary"
            style={{
              fontSize: 13,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.description}
          </Text>

          <Flex
            align="center"
            gap={8}
            style={{ marginTop: 'auto', paddingTop: 8 }}
          >
            <Avatar
              size={24}
              src={avatarUrl}
              icon={<UserOutlined />}
              style={{ backgroundColor: BRAND_PRIMARY }}
            />
            <Text style={{ fontSize: 12, color: NEUTRAL_700 }}>
              {sellerName}
            </Text>
          </Flex>
        </Flex>
      </Card>
    </>
  );
};

export default ListingCard;
