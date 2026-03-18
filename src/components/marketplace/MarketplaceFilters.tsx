import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row, Select } from 'antd';
import React, { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { RADIUS_MD } from '../../design';

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
};

const CONDITIONS = [
  { label: 'New', value: 'New' },
  { label: 'Like New', value: 'Like_new' },
  { label: 'Good', value: 'Good' },
  { label: 'Used', value: 'Used' },
];

const MarketplaceFilters = ({ categories }: Props): React.ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentQuery = searchParams.get('q') ?? '';
  const currentCategory = searchParams.get('category') ?? undefined;
  const currentCondition = searchParams.get('condition') ?? undefined;

  /**
   * Update a single URL param. When a filter changes we also clear the
   * `cursor` param so the user always starts from page 1 of the new results.
   */
  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        // Reset pagination whenever filters change
        next.delete('cursor');
        return next;
      });
    },
    [setSearchParams]
  );

  const handleClear = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const hasFilters = currentQuery || currentCategory || currentCondition;

  return (
    <Row gutter={[12, 12]} align="middle">
      <Col xs={24} sm={24} md={8}>
        <Input
          placeholder="Search listings..."
          prefix={<SearchOutlined />}
          value={currentQuery}
          onChange={(e) => updateParam('q', e.target.value || undefined)}
          allowClear
          style={{ borderRadius: RADIUS_MD }}
        />
      </Col>
      <Col xs={12} sm={8} md={5}>
        <Select
          placeholder="Category"
          value={currentCategory}
          onChange={(val) => updateParam('category', val)}
          allowClear
          onClear={() => updateParam('category', undefined)}
          style={{ width: '100%', borderRadius: RADIUS_MD }}
          options={categories.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
        />
      </Col>
      <Col xs={12} sm={8} md={5}>
        <Select
          placeholder="Condition"
          value={currentCondition}
          onChange={(val) => updateParam('condition', val)}
          allowClear
          onClear={() => updateParam('condition', undefined)}
          style={{ width: '100%', borderRadius: RADIUS_MD }}
          options={CONDITIONS}
        />
      </Col>
      {hasFilters && (
        <Col xs={24} sm={8} md={4}>
          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            style={{ width: '100%' }}
          >
            Clear Filters
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default MarketplaceFilters;
