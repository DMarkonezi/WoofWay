import { useEffect, useState } from 'react'
import { dogService, Dog } from '../../dogs/services/dogService'

export function useDogs() {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    setLoading(true)
    setError(null)

    dogService.getAll()
      .then((data) => {
        if (!isMounted) return

        const normalized = Array.isArray(data)
          ? data
          : (data as any).items ?? []

        setDogs(normalized)
      })
      .catch(() => {
        if (!isMounted) return
        setError('Nije moguće učitati pse.')
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return {
    dogs,
    loading,
    error,
  }
}