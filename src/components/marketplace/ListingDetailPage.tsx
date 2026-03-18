// src/components/marketplace/ListingDetailPage.tsx
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckOutlined,
  DeleteOutlined,
  MessageOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Modal,
  Popconfirm,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import {
  BRAND_GRADIENT_SIMPLE,
  BRAND_PRIMARY,
  NEUTRAL_400,
  NEUTRAL_700,
  RADIUS_LG,
  RADIUS_XL,
  SHADOW_CARD,
} from '../../design';
import { supabase } from '../../lib/supabase';
import fetchFromStorage from '../../utils/fetch_from_storage';
import type { Product } from './types';
import { CONDITION_COLORS, CONDITION_LABELS } from './types';

const { Title, Text, Paragraph } = Typography;

const ListingDetailPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const fetchProduct = useCallback(async () => {
    if (!listingId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(
        `
        id, created_at, name, price, image, description,
        user_id, category_id, condition, is_public,
        category:categories(id, name),
        user:profiles!products_user_id_fkey(id, username, first_name, last_name, avatar_url)
      `
      )
      .eq('id', listingId)
      .single();

    if (error || !data) {
      message.error('Listing not found');
      navigate(-1);
    } else {
      setProduct(data as unknown as Product);
    }
    setLoading(false);
  }, [listingId, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    if (product?.image) {
      fetchFromStorage(product.image, 'product-images').then((blob) => {
        if (blob) setImageUrl(URL.createObjectURL(blob));
      });
    }
    if (product?.user?.avatar_url) {
      fetchFromStorage(product.user.avatar_url, 'avatars').then((blob) => {
        if (blob) setAvatarUrl(URL.createObjectURL(blob));
      });
    }
  }, [product?.image, product?.user?.avatar_url]);

  const isOwner = userId === product?.user_id;

  const sellerName =
    product?.user?.first_name && product?.user?.last_name
      ? `${product.user.first_name} ${product.user.last_name}`
      : product?.user?.username ?? 'Anonymous';

  const handleDelete = async () => {
    if (!product) return;
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id);
    if (error) {
      message.error('Failed to delete listing');
    } else {
      message.success('Listing deleted');
      navigate(-1);
    }
  };

  const handleMarkSold = async () => {
    if (!product) return;
    const { error } = await supabase
      .from('products')
      .update({ is_public: false })
      .eq('id', product.id);
    if (error) {
      message.error('Failed to mark as sold');
    } else {
      message.success('Marked as sold');
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: 300 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!product) return null;

  const formattedDate = new Date(product.created_at).toLocaleDateString(
    'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <>
      <style>{`
        .listing-detail-image {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: ${RADIUS_LG};
        }
        @media (max-width: 767px) {
          .listing-detail-image {
            max-height: 260px;
            border-radius: 0;
          }
          .listing-detail-container {
            padding: 0 !important;
          }
          .listing-detail-body {
            padding: 16px !important;
          }
        }
      `}</style>
      <div
        className="listing-detail-container"
        style={{ maxWidth: 800, margin: '0 auto' }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16, padding: '4px 0' }}
        >
          Back to Marketplace
        </Button>

        {imageUrl ? (
          <img
            className="listing-detail-image"
            src={imageUrl}
            alt={product.name}
          />
        ) : (
          <div
            style={{
              height: 300,
              background: '#f0f0f0',
              borderRadius: RADIUS_LG,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: NEUTRAL_400,
            }}
          >
            No Image
          </div>
        )}

        <div className="listing-detail-body" style={{ padding: '24px 0' }}>
          <Flex justify="space-between" align="flex-start" wrap="wrap" gap={12}>
            <div style={{ flex: 1 }}>
              <Title level={3} style={{ margin: 0 }}>
                {product.name}
              </Title>
              <Title
                level={2}
                style={{ color: BRAND_PRIMARY, margin: '8px 0' }}
              >
                {product.price === 0 ? 'Free' : `£${product.price.toFixed(2)}`}
              </Title>
            </div>
            {isOwner && (
              <Flex gap={8}>
                <Button icon={<CheckOutlined />} onClick={handleMarkSold}>
                  Mark as Sold
                </Button>
                <Popconfirm
                  title="Delete this listing?"
                  description="This action cannot be undone."
                  onConfirm={handleDelete}
                  okText="Delete"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Flex>
            )}
          </Flex>

          <Flex gap={8} style={{ marginTop: 8 }}>
            <Tag color={CONDITION_COLORS[product.condition]}>
              {CONDITION_LABELS[product.condition]}
            </Tag>
            {product.category && <Tag>{product.category.name}</Tag>}
            <Flex align="center" gap={4}>
              <CalendarOutlined style={{ color: NEUTRAL_400, fontSize: 12 }} />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {formattedDate}
              </Text>
            </Flex>
          </Flex>

          <Divider />

          <Title level={5}>Description</Title>
          <Paragraph
            style={{ fontSize: 15, lineHeight: 1.7, color: NEUTRAL_700 }}
          >
            {product.description}
          </Paragraph>

          <Divider />

          <Card
            style={{
              borderRadius: RADIUS_XL,
              boxShadow: SHADOW_CARD,
            }}
          >
            <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
              <Flex align="center" gap={12}>
                <Avatar
                  size={48}
                  src={avatarUrl}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: BRAND_PRIMARY }}
                />
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    {sellerName}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Seller
                  </Text>
                </div>
              </Flex>
              {!isOwner && (
                <Button
                  type="primary"
                  icon={<MessageOutlined />}
                  size="large"
                  onClick={() => setContactModalOpen(true)}
                  style={{
                    background: BRAND_GRADIENT_SIMPLE,
                    border: 'none',
                  }}
                >
                  Contact Seller
                </Button>
              )}
            </Flex>
          </Card>
        </div>

        <Modal
          title="Contact Seller"
          open={contactModalOpen}
          onCancel={() => setContactModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setContactModalOpen(false)}>
              Close
            </Button>,
            <Button
              key="message"
              type="primary"
              icon={<MessageOutlined />}
              onClick={() => {
                message.info(
                  'Messaging feature coming soon! For now, reach out through the community.'
                );
                setContactModalOpen(false);
              }}
            >
              Send Message
            </Button>,
          ]}
        >
          <Flex vertical gap={16} style={{ padding: '16px 0' }}>
            <Flex align="center" gap={12}>
              <Avatar
                size={40}
                src={avatarUrl}
                icon={<UserOutlined />}
                style={{ backgroundColor: BRAND_PRIMARY }}
              />
              <div>
                <Text strong>{sellerName}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Listing: {product.name}
                </Text>
              </div>
            </Flex>
            <Text type="secondary">
              The in-app messaging feature is coming soon. In the meantime, you
              can reach out to {sellerName} through your community&apos;s
              messaging channels.
            </Text>
          </Flex>
        </Modal>
      </div>
    </>
  );
};

export default ListingDetailPage;
