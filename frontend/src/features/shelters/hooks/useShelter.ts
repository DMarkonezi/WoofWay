import { useEffect, useState } from 'react'
import { shelterService, Shelter } from '../services/shelterService'

export function useShelters() {
  const [shelters, setShelters] = useState<Shelter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    shelterService.getAll()
      .then(setShelters)
      .catch(() => setError('Greška pri učitavanju azila.'))
      .finally(() => setLoading(false))
  }, [])

  return {
    shelters,
    loading,
    error,
  }
}