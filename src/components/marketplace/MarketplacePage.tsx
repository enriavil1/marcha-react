// src/components/marketplace/MarketplacePage.tsx
import { PlusOutlined, ShopOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Empty, Flex, Row, Spin, Typography } from 'antd';
import React, { useCallback, useState } from 'react';

import {
  BRAND_GRADIENT_SIMPLE,
  BRAND_PRIMARY,
  RADIUS_LG,
  WHITE,
} from '../../design';
import CreateListingModal from './CreateListingModal';
import ListingCard from './ListingCard';
import MarketplaceFilters from './MarketplaceFilters';
import type { CreateListingFormValues } from './types';
import { useMarketplace } from './useMarketplace';

const { Title, Text } = Typography;

const MarketplacePage: React.FC = () => {
  const { products, categories, loading, error, fetchProducts, createListing } =
    useMarketplace();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value);
      fetchProducts({
        search: value,
        categoryId: selectedCategory,
        condition: selectedCondition,
      });
    },
    [fetchProducts, selectedCategory, selectedCondition]
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      setSelectedCategory(value);
      fetchProducts({
        search: searchValue,
        categoryId: value,
        condition: selectedCondition,
      });
    },
    [fetchProducts, searchValue, selectedCondition]
  );

  const handleConditionChange = useCallback(
    (value: string) => {
      setSelectedCondition(value);
      fetchProducts({
        search: searchValue,
        categoryId: selectedCategory,
        condition: value,
      });
    },
    [fetchProducts, searchValue, selectedCategory]
  );

  const handleClearFilters = useCallback(() => {
    setSearchValue('');
    setSelectedCategory('');
    setSelectedCondition('');
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateListing = useCallback(
    async (values: CreateListingFormValues, imageFile: File) => {
      const result = await createListing(values, imageFile);
      if (result) {
        fetchProducts();
        return true;
      }
      return false;
    },
    [createListing, fetchProducts]
  );

  return (
    <>
      <style>{`
        .marketplace-hero {
          background: ${BRAND_GRADIENT_SIMPLE};
          border-radius: ${RADIUS_LG};
          padding: 32px;
          margin-bottom: 24px;
          color: ${WHITE};
        }
        .marketplace-hero .ant-typography {
          color: ${WHITE} !important;
        }
        @media (max-width: 767px) {
          .marketplace-hero {
            padding: 20px 16px;
            margin-bottom: 16px;
            border-radius: 8px;
          }
          .marketplace-hero-title {
            font-size: 22px !important;
          }
        }
      `}</style>

      <div className="marketplace-hero">
        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
          <div>
            <Flex align="center" gap={8}>
              <ShopOutlined style={{ fontSize: 28, color: WHITE }} />
              <Title
                level={3}
                className="marketplace-hero-title"
                style={{ margin: 0, color: WHITE }}
              >
                Marketplace
              </Title>
            </Flex>
            <Text
              style={{
                color: 'rgba(255,255,255,0.85)',
                marginTop: 4,
                display: 'block',
              }}
            >
              Buy and sell within your community
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalOpen(true)}
            style={{
              background: WHITE,
              color: BRAND_PRIMARY,
              border: 'none',
              fontWeight: 600,
            }}
          >
            Post Listing
          </Button>
        </Flex>
      </div>

      <MarketplaceFilters
        categories={categories}
        searchValue={searchValue}
        selectedCategory={selectedCategory}
        selectedCondition={selectedCondition}
        onSearchChange={handleSearch}
        onCategoryChange={handleCategoryChange}
        onConditionChange={handleConditionChange}
        onClearFilters={handleClearFilters}
      />

      {error && (
        <Alert
          message="Error loading listings"
          description={error}
          type="error"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}

      <div style={{ marginTop: 24 }}>
        {loading ? (
          <Flex justify="center" style={{ padding: 48 }}>
            <Spin size="large" />
          </Flex>
        ) : products.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchValue || selectedCategory || selectedCondition
                ? 'No listings match your filters'
                : 'No listings yet — be the first to post!'
            }
          >
            {!searchValue && !selectedCategory && !selectedCondition && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalOpen(true)}
              >
                Create Listing
              </Button>
            )}
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8} lg={8} xl={6}>
                <ListingCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div>

      <CreateListingModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        categories={categories}
        onSubmit={handleCreateListing}
      />
    </>
  );
};

export default MarketplacePage;
