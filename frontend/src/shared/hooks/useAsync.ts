import { DependencyList, useCallback, useEffect, useState } from "react";

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  dependencies: DependencyList = [],
  immediate = true
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await asyncFn()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Došlo je do greške.')
    } finally {
      setLoading(false)
    }
  }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (immediate) execute()
  }, [execute]) // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: execute }
}