import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty } from 'antd';
import React, { Suspense } from 'react';

import { NEUTRAL_100, RADIUS_LG } from '../../design';
import ProductCard from '../Products/ProductCard';
import type { ProductCardFragmentQuery$key } from '../Products/__generated__/ProductCardFragmentQuery.graphql';

type Edge = {
  readonly node: {
    readonly product:
      | (ProductCardFragmentQuery$key & { readonly name: string })
      | null
      | undefined;
  };
};

type MarketplaceProductGridProps = {
  edges: readonly Edge[];
  onCreateListing: () => void;
};

/**
 * Responsive product card grid.
 *
 * Desktop: 4 columns  (≥ 768 px)
 * Mobile:  2 columns  (< 768 px)
 *
 * Cards have equal-width columns with a 16 px gap, matching the design.
 */
const MarketplaceProductGrid: React.FC<MarketplaceProductGridProps> = ({
  edges,
  onCreateListing,
}) => {
  const validEdges = edges.filter((edge) => edge.node.product != null);

  if (validEdges.length === 0) {
    return (
      <Empty description="No listings found" style={{ padding: '48px 0' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onCreateListing}
        >
          Create the first listing
        </Button>
      </Empty>
    );
  }

  return (
    <>
      <style>{`
        .marketplace-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 16px;
        }
        @media (max-width: 767px) {
          .marketplace-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
      <div className="marketplace-grid">
        {validEdges.map((edge, i) => (
          <Suspense
            key={i}
            fallback={
              <div
                style={{
                  borderRadius: RADIUS_LG,
                  background: NEUTRAL_100,
                  paddingTop: '75%',
                  position: 'relative',
                }}
              />
            }
          >
            <ProductCard
              fragmentRef={edge.node.product as ProductCardFragmentQuery$key}
              hoverable
            />
          </Suspense>
        ))}
      </div>
    </>
  );
};

export default MarketplaceProductGrid;
