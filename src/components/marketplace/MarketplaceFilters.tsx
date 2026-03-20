import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input } from 'antd';
import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { NEUTRAL_400, RADIUS_LG } from '../../design';

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
};

/**
 * Marketplace search bar and category pill filter row.
 *
 * The search bar is full-width above the category pills.
 * The "All" pill is filled (primary) when active; category pills are outlined
 * when inactive and filled when selected — matching the design.
 */
const MarketplaceFilters = ({ categories }: Props): React.ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentQuery = searchParams.get('q') ?? '';
  const currentCategory = searchParams.get('category') ?? '';

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        // Reset pagination cursor when filters change
        next.delete('cursor');
        return next;
      });
    },
    [setSearchParams]
  );

  const allCategories = [{ id: '', name: 'All' }, ...categories];

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Full-width search bar */}
      <Input
        placeholder="Search items..."
        prefix={<SearchOutlined style={{ color: NEUTRAL_400 }} />}
        value={currentQuery}
        onChange={(e) => updateParam('q', e.target.value || undefined)}
        allowClear
        style={{ borderRadius: RADIUS_LG, marginBottom: 12, height: 40 }}
      />

      {/* Horizontally scrollable category pill row */}
      <Flex
        gap={8}
        style={{
          overflowX: 'auto',
          paddingBottom: 4,
          // Hide scrollbar cross-browser while keeping scroll functionality
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {allCategories.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <Button
              key={cat.id}
              type={isActive ? 'primary' : 'default'}
              shape="round"
              size="small"
              onClick={() => updateParam('category', cat.id || undefined)}
              style={{ flexShrink: 0, fontWeight: isActive ? 600 : 400 }}
            >
              {cat.name}
            </Button>
          );
        })}
      </Flex>
    </div>
  );
};

export default MarketplaceFilters;
