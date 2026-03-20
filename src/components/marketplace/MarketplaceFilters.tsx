import { SearchOutlined } from '@ant-design/icons';
import { Flex, Input, Select } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { NEUTRAL_400, RADIUS_LG } from '../../design';
import { useDebounce } from '../../hooks/useDebounce';
import { CONDITIONS } from './constants';

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
};

/**
 * Marketplace search bar and dropdown filters.
 *
 * The search bar is full-width. Below it, category and condition filters
 * are implemented as antd Select components with allowClear.
 *
 * Search is debounced (400 ms) before writing to the URL so that the
 * entrypoint only re-fetches the query after the user stops typing.
 *
 * Category and condition filters write to the URL immediately on change.
 * Clearing a Select component removes the corresponding param from the URL.
 */
const MarketplaceFilters = ({ categories }: Props): React.ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  // The URL is the source of truth for filters.
  const urlQuery = searchParams.get('q') ?? '';
  const currentCategory = searchParams.get('category') ?? undefined;
  const currentCondition = searchParams.get('condition') ?? undefined;

  // Local state for the search input so the UI responds instantly.
  const [inputValue, setInputValue] = useState(urlQuery);

  // Sync local input state when the URL changes externally.
  useEffect(() => {
    setInputValue(urlQuery);
  }, [urlQuery]);

  // Debounced version of the input.
  const debouncedQuery = useDebounce(inputValue, 400);

  // Write the debounced search value to the URL.
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debouncedQuery) {
        next.set('q', debouncedQuery);
      } else {
        next.delete('q');
      }
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
        next.delete('cursor');
        return next;
      });
    },
    [setSearchParams]
  );

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Full-width search bar */}
      <Input
        placeholder="Search items..."
        prefix={<SearchOutlined style={{ color: NEUTRAL_400 }} />}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onClear={() => setInputValue('')}
        allowClear
        style={{ borderRadius: RADIUS_LG, marginBottom: 12, height: 40 }}
      />

      {/* Dropdown filters for Category and Condition */}
      <Flex gap={12} wrap="wrap">
        <Select
          placeholder="All Categories"
          allowClear
          value={currentCategory}
          onChange={(val) => updateParam('category', val)}
          options={categoryOptions}
          style={{ minWidth: 160, flex: 1 }}
        />
        <Select
          placeholder="All Conditions"
          allowClear
          value={currentCondition}
          onChange={(val) => updateParam('condition', val)}
          options={CONDITIONS as unknown as { label: string; value: string }[]}
          style={{ minWidth: 160, flex: 1 }}
        />
      </Flex>
    </div>
  );
};

export default MarketplaceFilters;
