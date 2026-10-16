import { useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { dogService, CreateDogPayload } from '../../dogs/services/dogService'
import Input from '../../../shared/components/Input'
import Button from '../../../shared/components/Button'
import Alert from '../../../shared/components/Alert'

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? 'dbqnccyiu'
const UPLOAD_PRESET = 'woofway_unsigned'

interface FormState {
  name: string
  breed: string
  description: string
  location: string
  contactPhone: string
}

interface FormErrors {
  description?: string
  image?: string
  location?: string
}

export default function AddShelterDogPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    name: '',
    breed: '',
    description: '',
    location: '',
    contactPhone: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
    setApiError(null)
  }

  function handleFileSelect(file: File) {
    if (!file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, image: undefined }))
  }

  function handleRemoveImage() {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function uploadToCloudinary(): Promise<string> {
    if (!imageFile) throw new Error('Nema slike.')
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', imageFile)
      formData.append('upload_preset', UPLOAD_PRESET)

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      )
      if (!response.ok) throw new Error('Upload nije uspeo.')
      const data = await response.json()
      return data.secure_url as string
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const newErrors: FormErrors = {}
    if (!form.description.trim()) newErrors.description = 'Opis je obavezan.'
    if (!imageFile) newErrors.image = 'Fotografija je obavezna.'
    if (!form.location.trim()) newErrors.location = 'Lokacija je obavezna.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const finalImageUrl = await uploadToCloudinary()

      const payload: CreateDogPayload = {
        status:       'InShelter',
        name:         form.name || undefined,
        breed:        form.breed || undefined,
        description:  form.description,
        imageUrl:     finalImageUrl,
        location:     form.location,
        contactPhone: form.contactPhone || undefined,
      }

      await dogService.create(payload)
      navigate('/dashboard/shelter/dogs')
    } catch {
      setApiError('Greška pri dodavanju psa. Pokušajte ponovo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/shelter/dogs')}
          className="text-sm text-gray-400 hover:text-gray-600
                     transition-colors mb-3 flex items-center gap-1"
        >
          ← Nazad
        </button>
        <h1 className="text-xl font-semibold text-gray-900">Dodaj psa</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Dodajte psa u vaš azil
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100
                      border-t-4 border-t-woof-blue-600 shadow-card p-6">

        {apiError && <Alert type="error" message={apiError} />}

        <div className="mb-5 rounded-lg bg-woof-blue-50 border
                        border-woof-blue-100 px-4 py-3">
          <p className="text-xs text-woof-blue-700">
            Pas će automatski biti dodat sa statusom{' '}
            <strong>U azilu</strong>. Status možete promeniti
            kasnije sa liste.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Fotografija */}
          <div className="mb-4">
            <label className="woof-label">
              Fotografija <span className="text-red-400">*</span>
            </label>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-white rounded-full
                             p-1.5 shadow text-gray-500 hover:text-red-500
                             transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files[0]
                  if (file) handleFileSelect(file)
                }}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-200 rounded-xl
                           p-8 text-center cursor-pointer
                           hover:border-woof-blue-300 hover:bg-woof-blue-50
                           transition-colors"
              >
                <p className="text-3xl mb-2">📷</p>
                <p className="text-sm font-medium text-gray-600">
                  Klikni ili prevuci fotografiju
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
              }}
            />
            {errors.image && (
              <p className="woof-field-error mt-1">{errors.image}</p>
            )}
          </div>

          {/* Ime i rasa */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Ime psa (opciono)"
              placeholder="Rex"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <Input
              label="Rasa (opciono)"
              placeholder="Labrador"
              value={form.breed}
              onChange={(e) => handleChange('breed', e.target.value)}
            />
          </div>

          {/* Opis */}
          <div className="mb-4">
            <label className="woof-label">
              Opis <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Opišite psa — karakter, posebne potrebe..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`woof-input resize-none ${
                errors.description ? 'border-red-400 focus:ring-red-300' : ''
              }`}
            />
            {errors.description && (
              <p className="woof-field-error">{errors.description}</p>
            )}
          </div>

          {/* Lokacija i kontakt */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Lokacija azila *"
              placeholder="Beograd, Zemun"
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              error={errors.location}
            />
            <Input
              label="Kontakt telefon (opciono)"
              type="tel"
              placeholder="+381 11 123 4567"
              value={form.contactPhone}
              onChange={(e) => handleChange('contactPhone', e.target.value)}
            />
          </div>

          <div className="border-t border-gray-100 my-5" />

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              variant="primary"
              loading={loading || uploadingImage}
            >
              {uploadingImage ? 'Učitavanje slike...' : 'Dodaj psa'}
            </Button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/shelter/dogs')}
              className="px-4 py-2.5 text-sm text-gray-500
                         hover:text-gray-700 transition-colors"
            >
              Otkaži
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}