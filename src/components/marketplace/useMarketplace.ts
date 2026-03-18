// src/components/marketplace/useMarketplace.ts
import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { useCommunity } from '../../contexts/CommunityContext';
import { supabase } from '../../lib/supabase';
import type { Category, CreateListingFormValues, Product } from './types';

interface UseMarketplaceReturn {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchProducts: (filters?: {
    search?: string;
    categoryId?: string;
    condition?: string;
  }) => Promise<void>;
  createListing: (
    values: CreateListingFormValues,
    imageFile: File
  ) => Promise<Product | null>;
  deleteListing: (productId: number) => Promise<boolean>;
  markAsSold: (productId: number) => Promise<boolean>;
}

export const useMarketplace = (): UseMarketplaceReturn => {
  const { userId } = useAuth();
  const { communityId } = useCommunity();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const { data, error: catError } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      if (catError) {
        console.error('Failed to load categories:', catError);
      } else {
        setCategories(data ?? []);
      }
    };
    loadCategories();
  }, []);

  const fetchProducts = useCallback(
    async (filters?: {
      search?: string;
      categoryId?: string;
      condition?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('products')
          .select(
            `
            id,
            created_at,
            name,
            price,
            image,
            description,
            user_id,
            category_id,
            condition,
            is_public,
            category:categories(id, name),
            user:profiles!products_user_id_fkey(id, username, first_name, last_name, avatar_url)
          `
          )
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (filters?.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }
        if (filters?.categoryId) {
          query = query.eq('category_id', filters.categoryId);
        }
        if (filters?.condition) {
          query = query.eq('condition', filters.condition);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          setError(fetchError.message);
          setProducts([]);
        } else {
          // Filter to products in the current community if communityId is set
          if (communityId) {
            const { data: communityProducts } = await supabase
              .from('products_communities')
              .select('product_id')
              .eq('community_id', communityId);

            const communityProductIds = new Set(
              communityProducts?.map((cp) => cp.product_id) ?? []
            );

            const filtered = (data ?? []).filter((p) =>
              communityProductIds.has(p.id)
            );
            setProducts(filtered as unknown as Product[]);
          } else {
            setProducts((data ?? []) as unknown as Product[]);
          }
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [communityId]
  );

  const createListing = useCallback(
    async (
      values: CreateListingFormValues,
      imageFile: File
    ): Promise<Product | null> => {
      if (!userId) {
        setError('You must be logged in to create a listing');
        return null;
      }

      try {
        // 1. Upload image to Supabase Storage
        const fileExt = imageFile.name.split('.').pop();
        const filePath = `${userId}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile, { upsert: false });

        if (uploadError) {
          setError(`Image upload failed: ${uploadError.message}`);
          return null;
        }

        // 2. Insert the product record
        const { data: product, error: insertError } = await supabase
          .from('products')
          .insert({
            name: values.name,
            description: values.description,
            price: values.price,
            image: filePath,
            user_id: userId,
            category_id: values.category_id || null,
            condition: values.condition,
            is_public: true,
          })
          .select()
          .single();

        if (insertError) {
          setError(`Failed to create listing: ${insertError.message}`);
          return null;
        }

        // 3. Link product to current community
        if (communityId && product) {
          await supabase.from('products_communities').insert({
            product_id: product.id,
            community_id: communityId,
          });
        }

        return product as unknown as Product;
      } catch (err) {
        setError('An unexpected error occurred');
        console.error(err);
        return null;
      }
    },
    [userId, communityId]
  );

  const deleteListing = useCallback(
    async (productId: number): Promise<boolean> => {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', userId ?? '');

      if (deleteError) {
        setError(`Failed to delete listing: ${deleteError.message}`);
        return false;
      }
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      return true;
    },
    [userId]
  );

  const markAsSold = useCallback(
    async (productId: number): Promise<boolean> => {
      const { error: updateError } = await supabase
        .from('products')
        .update({ is_public: false })
        .eq('id', productId)
        .eq('user_id', userId ?? '');

      if (updateError) {
        setError(`Failed to mark as sold: ${updateError.message}`);
        return false;
      }
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      return true;
    },
    [userId]
  );

  // Fetch products on mount and when communityId changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    createListing,
    deleteListing,
    markAsSold,
  };
};
