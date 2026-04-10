import { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import type { Product } from '../types';

export function useProducts(params?: { category?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    productApi.getAll(params)
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [params?.category]);

  return { products, loading, error };
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    productApi.getFeatured()
      .then(setProducts)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading, error };
}
