// src/components/marketplace/types.ts

export type ProductCondition = 'New' | 'Like_new' | 'Good' | 'Used';

export interface Category {
  id: string;
  name: string;
}

export interface SellerProfile {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export interface Product {
  id: number;
  created_at: string;
  name: string;
  price: number;
  image: string;
  description: string;
  user_id: string;
  category_id: string | null;
  condition: ProductCondition;
  is_public: boolean;
  category: Category | null;
  user: SellerProfile | null;
}

export interface CreateListingFormValues {
  name: string;
  description: string;
  price: number;
  category_id: string;
  condition: ProductCondition;
}

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  New: 'New',
  Like_new: 'Like New',
  Good: 'Good',
  Used: 'Used',
};

export const CONDITION_COLORS: Record<ProductCondition, string> = {
  New: 'green',
  Like_new: 'blue',
  Good: 'orange',
  Used: 'default',
};
