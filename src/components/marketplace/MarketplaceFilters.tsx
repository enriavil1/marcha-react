// src/components/marketplace/MarketplaceFilters.tsx
import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Select } from 'antd';
import React from 'react';

import type { Category, ProductCondition } from './types';
import { CONDITION_LABELS } from './types';

interface MarketplaceFiltersProps {
  categories: Category[];
  searchValue: string;
  selectedCategory: string;
  selectedCondition: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onConditionChange: (value: string) => void;
  onClearFilters: () => void;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  categories,
  searchValue,
  selectedCategory,
  selectedCondition,
  onSearchChange,
  onCategoryChange,
  onConditionChange,
  onClearFilters,
}) => {
  const hasActiveFilters = searchValue || selectedCategory || selectedCondition;

  return (
    <>
      <style>{`
        .marketplace-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
        }
        .marketplace-filters .ant-input-affix-wrapper,
        .marketplace-filters .ant-select {
          min-width: 180px;
        }
        @media (max-width: 767px) {
          .marketplace-filters {
            flex-direction: column;
          }
          .marketplace-filters .ant-input-affix-wrapper,
          .marketplace-filters .ant-select {
            width: 100% !important;
            min-width: unset;
          }
        }
      `}</style>
      <Flex className="marketplace-filters" align="center">
        <Input
          placeholder="Search listings..."
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          style={{ flex: 1, maxWidth: 320 }}
        />
        <Select
          placeholder="Category"
          value={selectedCategory || undefined}
          onChange={onCategoryChange}
          allowClear
          onClear={() => onCategoryChange('')}
          style={{ width: 180 }}
          suffixIcon={<FilterOutlined />}
          options={categories.map((cat) => ({
            label: cat.name,
            value: cat.id,
          }))}
        />
        <Select
          placeholder="Condition"
          value={selectedCondition || undefined}
          onChange={onConditionChange}
          allowClear
          onClear={() => onConditionChange('')}
          style={{ width: 160 }}
          options={(
            Object.entries(CONDITION_LABELS) as [ProductCondition, string][]
          ).map(([value, label]) => ({
            label,
            value,
          }))}
        />
        {hasActiveFilters && (
          <Button type="link" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </Flex>
    </>
  );
};

export default MarketplaceFilters;
