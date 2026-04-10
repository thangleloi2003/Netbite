import { useState, useEffect } from 'react';
import { comboApi } from '../services/api';
import type { Combo } from '../types';

export function useCombos() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    comboApi.getAll()
      .then(setCombos)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { combos, loading, error };
}
