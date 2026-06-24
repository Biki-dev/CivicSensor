import { useState, useCallback } from 'react';

export const useAsync = <T,>(asyncFn: () => Promise<T>, deps: any[] = []) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<T | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await asyncFn();
      setResult(data);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  return { execute, loading, error, result };
};
