import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { NEUTRAL_400, RADIUS_LG } from '../../design';
import { useDebounce } from '../../hooks/useDebounce';

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
 *
 * Search is debounced (400 ms) before writing to the URL so that the
 * entrypoint only re-fetches the query after the user stops typing, rather
 * than on every keystroke.
 *
 * Category and condition filters write to the URL immediately (no debounce
 * needed since they are single-click selections).
 *
 * The Market entrypoint reads all filter values from the URL and passes them
 * as variables to the Relay query — Supabase performs the actual filtering.
 */
const MarketplaceFilters = ({ categories }: Props): React.ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is the source of truth for filters.
  const urlQuery = searchParams.get('q') ?? '';
  const currentCategory = searchParams.get('category') ?? '';

  // Local state for the search input so the UI responds instantly while
  // the debounced value propagates to the URL (and triggers a re-fetch).
  const [inputValue, setInputValue] = useState(urlQuery);

  // Sync local input state when the URL changes externally (e.g. back/forward).
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);

  // Debounced version of the input — only updates after 400 ms of inactivity.
  const debouncedQuery = useDebounce(inputValue, 400);

  // Write the debounced search value to the URL, which triggers the entrypoint
  // to reload the query with the new filter variable.
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedQuery) {
        next.set('q', debouncedQuery);
      } else {
        next.delete('q');
      }
      // Reset pagination cursor whenever the search changes.
      next.delete('cursor');
      return next;
    });
  }, [debouncedQuery, setSearchParams]);

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        // Reset pagination cursor when filters change.
        next.delete('cursor');
        return next;
      });
    },
    [setSearchParams]
  );

  const allCategories = [{ id: '', name: 'All' }, ...categories];

  return (
    <div style={{ marginBottom: 8 }}>
      {/* Full-width search bar — local state for instant feedback, debounced URL write */}
      <Input
        placeholder="Search items..."
        prefix={<SearchOutlined style={{ color: NEUTRAL_400 }} />}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClear={() => setInputValue('')}
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
