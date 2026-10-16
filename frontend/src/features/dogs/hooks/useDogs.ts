import { useState, useEffect } from 'react';
import { dogService, Dog } from '../services/dogService';

export function useDogs() {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dogService.getAll()
      .then((data) => setDogs(Array.isArray(data) ? data : (data as any).items ?? []))
      .catch(() => setError('Greška pri učitavanju pasa.'))
      .finally(() => setLoading(false));
  }, []);

  return { dogs, loading, error };
}