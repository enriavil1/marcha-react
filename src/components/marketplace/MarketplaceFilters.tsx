import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  BORDER_DEFAULT,
  BRAND_PRIMARY,
  NEUTRAL_400,
  NEUTRAL_700,
  RADIUS_LG,
  WHITE,
} from '../../design';

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
};

/**
 * Marketplace filter bar matching the design:
 * - Full-width search input
 * - Horizontal scrollable pill buttons: "All" (filled orange when active),
 *   then category names (outlined grey when inactive)
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
        next.delete('cursor');
        return next;
      });
    },
    [setSearchParams]
  );

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      updateParam('category', categoryId || undefined);
    },
    [updateParam]
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
        style={{
          borderRadius: RADIUS_LG,
          marginBottom: 12,
          height: 40,
          fontSize: 14,
        }}
      />

      {/* Horizontally scrollable category pills */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          .marketplace-category-pills::-webkit-scrollbar { display: none; }
        `}</style>
        {allCategories.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              style={{
                flexShrink: 0,
                padding: '6px 16px',
                borderRadius: 20,
                border: isActive ? 'none' : `1.5px solid ${BORDER_DEFAULT}`,
                background: isActive ? BRAND_PRIMARY : WHITE,
                color: isActive ? WHITE : NEUTRAL_700,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                lineHeight: '20px',
                transition: 'background 0.15s, color 0.15s, border 0.15s',
                outline: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MarketplaceFilters;
