import { UserOutlined } from '@ant-design/icons';
import { Avatar, Typography } from 'antd';
import graphql from 'babel-plugin-relay/macro';
import React, { useEffect, useState } from 'react';
import { useFragment } from 'react-relay';
import { useNavigate } from 'react-router';

import { useAuth } from '../../contexts/AuthContext';
import {
  BRAND_PRIMARY,
  COLOR_SUCCESS,
  COLOR_WARNING,
  NEUTRAL_100,
  NEUTRAL_500,
  NEUTRAL_700,
  RADIUS_LG,
  RADIUS_SM,
  SHADOW_CARD,
  WHITE,
} from '../../design';
import fetchFromStorage from '../../utils/fetch_from_storage';
import { AVATAR_DEFAULT } from '../marketplace/constants';
import { ProductCardFragmentQuery$key } from './__generated__/ProductCardFragmentQuery.graphql';

type Props = {
  fragmentRef: ProductCardFragmentQuery$key;
  hoverable?: boolean;
};

const productFragmentQuery = graphql`
  fragment ProductCardFragmentQuery on Products {
    name
    description
    price
    image
    id
    isPublic
    categoryId
    condition
    userId
    user {
      avatarUrl
      username
      firstName
      lastName
    }
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
`;

/** Derive a status badge from the product's public flag and price. */
function getStatusBadge(
  isPublic: boolean,
  price: number
): { label: string; color: string; bg: string } {
  if (!isPublic) {
    return { label: 'Unlisted', color: NEUTRAL_500, bg: '#f0f0f0' };
  }
  if (price === 0) {
    return { label: 'Free', color: COLOR_SUCCESS, bg: '#f6ffed' };
  }
  return { label: 'Available', color: COLOR_SUCCESS, bg: '#f6ffed' };
}

const ProductCard = ({
  fragmentRef,
  hoverable = true,
}: Props): React.ReactElement => {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [hovered, setHovered] = useState(false);

  const product = useFragment(productFragmentQuery, fragmentRef);
  const navigation = useNavigate();
  const { userId } = useAuth();

  const isOwnListing = userId != null && product.userId === userId;

  useEffect(() => {
    const firstProductImage =
      product.productImagesCollection?.edges?.[0]?.node?.imageUrl;
    const imagePath = firstProductImage || product.image;

    if (imagePath) {
      fetchFromStorage(imagePath, 'product-images').then((blob) => {
        if (blob) setImageBlob(blob);
      });
    }

    if (product.user?.avatarUrl) {
      fetchFromStorage(product.user.avatarUrl, 'avatars').then((blob) => {
        if (blob) setAvatarBlob(blob);
      });
    }
  }, [product]);

  const status = getStatusBadge(product.isPublic, product.price);

  // Seller display: prefer firstName, fall back to username
  const user = product.user;
  const sellerName = user?.firstName || user?.username || 'Seller';
  const sellerLine = sellerName;

  // Price display
  const isFree = product.price === 0;
  const priceDisplay = isFree ? 'Free' : `£${product.price}`;
  const priceColor = isFree ? COLOR_SUCCESS : BRAND_PRIMARY;

  const cardStyle: React.CSSProperties = {
    background: WHITE,
    borderRadius: RADIUS_LG,
    boxShadow:
      hovered && hoverable
        ? '0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)'
        : SHADOW_CARD,
    border: 'none',
    overflow: 'hidden',
    cursor: hoverable ? 'pointer' : 'default',
    transform: hovered && hoverable ? 'translateY(-2px)' : 'none',
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    width: '100%',
  };

  return (
    <div
      style={cardStyle}
      onClick={() => hoverable && navigation(`${product.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role={hoverable ? 'button' : undefined}
      tabIndex={hoverable ? 0 : undefined}
      onKeyDown={(e) => {
        if (hoverable && (e.key === 'Enter' || e.key === ' ')) {
          navigation(`${product.id}`);
        }
      }}
    >
      {/* ── Image area ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '75%', // 4:3 aspect ratio
          background: NEUTRAL_100,
          overflow: 'hidden',
        }}
      >
        {imageBlob ? (
          <img
            src={URL.createObjectURL(imageBlob)}
            alt={product.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          /* Placeholder icon when no image is loaded yet */
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="#bfbfbf"
                strokeWidth="1.5"
              />
              <circle
                cx="8.5"
                cy="8.5"
                r="1.5"
                stroke="#bfbfbf"
                strokeWidth="1.5"
              />
              <path
                d="M3 15l5-5 4 4 3-3 6 6"
                stroke="#bfbfbf"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* "Your listing" badge — top-left */}
        {isOwnListing && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: BRAND_PRIMARY,
              color: WHITE,
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: 11,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              lineHeight: '18px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
            }}
          >
            <UserOutlined style={{ fontSize: 10 }} />
            Your listing
          </div>
        )}

        {/* Status badge — top-right */}
        <div
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: status.bg,
            color: status.color,
            borderRadius: 20,
            padding: '3px 10px',
            fontSize: 11,
            fontWeight: 600,
            lineHeight: '18px',
            border: `1px solid ${status.color}33`,
          }}
        >
          {status.label}
        </div>
      </div>

      {/* ── Card body ──────────────────────────────────────────────────── */}
      <div style={{ padding: '12px 14px 14px' }}>
        {/* Product name */}
        <Typography.Text
          strong
          style={{
            display: 'block',
            fontSize: 14,
            color: NEUTRAL_700,
            lineHeight: '20px',
            marginBottom: 4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={product.name}
        >
          {product.name}
        </Typography.Text>

        {/* Price */}
        <Typography.Text
          style={{
            display: 'block',
            fontSize: 20,
            fontWeight: 700,
            color: priceColor,
            lineHeight: '26px',
            marginBottom: 8,
          }}
        >
          {priceDisplay}
        </Typography.Text>

        {/* Seller row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Avatar
            size={22}
            src={avatarBlob ? URL.createObjectURL(avatarBlob) : AVATAR_DEFAULT}
            icon={<UserOutlined />}
            style={{ flexShrink: 0 }}
          />
          <Typography.Text
            style={{
              fontSize: 12,
              color: NEUTRAL_500,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {sellerLine}
          </Typography.Text>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
