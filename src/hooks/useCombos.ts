import { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import type { Product } from '../types';

export function useCombos() {
  const [combos, setCombos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    productApi.getAll({ category: 'combo' })
      .then(setCombos)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { combos, loading, error };
}
