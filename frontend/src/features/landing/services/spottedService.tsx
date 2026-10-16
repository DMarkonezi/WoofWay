const CV_SERVICE_URL = import.meta.env.VITE_CV_SERVICE_URL ?? 'http://localhost:5001'
const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

export interface SpottedPrediction {
  breed: string
  confidence: number
}

export interface SpottedResult {
  id: string
  imageUrl: string
  detectedBreeds: string[]
}

export const spottedService = {
  predict: async (file: File): Promise<{
    imageUrl: string
    predictions: SpottedPrediction[]
  }> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${CV_SERVICE_URL}/predict`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('CV servis nije dostupan.')

    const data = await response.json()
    return {
      imageUrl: data.imageUrl,
      predictions: data.predictions,
    }
  },

  reportSpotted: async (payload: {
    imageUrl: string
    location: string
    description?: string
  }): Promise<SpottedResult> => {
    const response = await fetch(`${BACKEND_URL}/dogs/spotted`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) throw new Error('Greška pri prijavi psa.')

    const data = await response.json()
    return data.data
  },
}