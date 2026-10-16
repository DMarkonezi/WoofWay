import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { dogService, Dog} from '../../dogs/services/dogService'
import { spottedService, SpottedPrediction } from '../services/spottedService'
import { HomePageDogCard } from '../components/HomePageDogCard'
import { HomePageTabs } from '../components/HomePageTabs'
import { HomePageHero } from '../components/HomePageHero'
import { useSpotted } from '../hooks/useSpotted'
import { breedService } from '../../dogs/services/breedService'

type ActiveTab = 'home' | 'spotted'
type SpottedStep = 'upload' | 'preview' | 'result'

export default function HomePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<ActiveTab>(
    searchParams.get('tab') === 'spotted' ? 'spotted' : 'home'
  )

  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [step, setStep] = useState<SpottedStep>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [predictions, setPredictions] = useState<SpottedPrediction[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [spottedError, setSpottedError] = useState<string | null>(null)
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null)

  const [translations, setTranslations] = useState<Record<string, string>>({})

  useEffect(() => {
    breedService.getAllTranslations()
      .then((data) => {
        setTranslations(data ?? {})
      })
      .catch((err) => console.error('Greška pri učitavanju prevoda:', err))
  }, [])

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    dogService.getAll()
      .then((data) => setDogs(Array.isArray(data) ? data : (data as any).items ?? []))
      .catch(() => setError('Nije moguće učitati pse.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'spotted') {
      setActiveTab('spotted')
      handleReset()
    } else {
      setActiveTab('home')
    }
  }, [searchParams])

  function changeTab(tab: ActiveTab) {
    if (tab === 'spotted') {
      setSearchParams({ tab: 'spotted' })
    } else {
      setSearchParams({})
    }
  }

  function handleFileSelect(file: File) {
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
    setStep('preview')
    setSpottedError(null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) handleFileSelect(file)
  }

  function handleReset() {
    setStep('upload')
    setSelectedFile(null)
    setPreview(null)
    setLocation('')
    setDescription('')
    setPredictions([])
    setSpottedError(null)
    setResultImageUrl(null)
  }

  async function handleSubmit() {
    if (!selectedFile) return
    if (!location.trim()) {
      setSpottedError('Lokacija je obavezna.')
      return
    }

    setSubmitting(true)
    setSpottedError(null)

    try {
      const cvResult = await spottedService.predict(selectedFile)
      await spottedService.reportSpotted({
        imageUrl: cvResult.imageUrl,
        location: location.trim(),
        description: description.trim() || undefined,
      })
      setPredictions(cvResult.predictions)
      setResultImageUrl(cvResult.imageUrl)
      setStep('result')
    } catch {
      setSpottedError('Greška pri prijavi psa. Pokušajte ponovo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      
        {/* <HomePageTabs 
          activeTab={activeTab} 
          onChange={changeTab} 
        /> */}

      {activeTab === 'home' && (
        <>
          {/* Hero */}
          <HomePageHero 
            onRegister={() => navigate('/register')} 
            onLogin={() => navigate('/login')} 
          />

          {/* Dog listing */}
          <section className="max-w-6xl mx-auto px-4 py-14">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">
                Najnoviji oglasi
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                Psi kojima je potrebna pomoć ili novi dom
              </p>
            </div>

            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border
                                          border-gray-100 shadow-card
                                          animate-pulse h-72" />
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-16 text-gray-400 text-sm">
                {error}
              </div>
            )}

            {!loading && !error && dogs.length === 0 && (
              <div className="text-center py-16 text-gray-400 text-sm">
                Trenutno nema oglasa.
              </div>
            )}

            {!loading && !error && dogs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {dogs.map((dog) => (
                  <HomePageDogCard
                    key={dog.id}
                    dog={dog}
                    onContact={() => navigate('/login')}
                  />
                ))}
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="bg-woof-blue-600">
            <div className="max-w-6xl mx-auto px-4 py-14 flex flex-col
                            items-center text-center gap-5">
              <h2 className="text-2xl font-semibold text-white">
                Imaš psa kojeg treba čuvati?
              </h2>
              <p className="text-woof-blue-100 text-sm max-w-md">
                Registruj se kao vlasnik i pronađi pouzdanog čuvara u svom
                gradu za nekoliko minuta.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 bg-white text-woof-blue-600
                           hover:bg-woof-blue-50 text-sm font-medium
                           rounded-lg transition-colors"
              >
                Kreiraj nalog →
              </button>
            </div>
          </section>
        </>
      )}


      {activeTab === 'spotted' && (
        <section className="max-w-xl mx-auto px-4 py-14">
          <div className="text-center mb-8">
            <span className="text-4xl">📸</span>
            <h2 className="text-2xl font-semibold text-gray-900 mt-3">
              Vidio/la si psa na ulici?
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Uslikaj ga i prijavi - naš AI će prepoznati rasu i obavestiti
              vlasnike izgubljenih pasa u tvojoj blizini.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100
                          border-t-4 border-t-yellow-400 shadow-card p-6">

            {/* Upload */}
            {step === 'upload' && (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl
                           p-10 text-center cursor-pointer
                           hover:border-yellow-300 hover:bg-yellow-50
                           transition-colors"
              >
                <p className="text-4xl mb-3">🐕</p>
                <p className="text-sm font-medium text-gray-700">
                  Prevuci sliku ili klikni da izabereš
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP — max 10MB
                </p>
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
              </div>
            )}

            {/* Preview */}
            {step === 'preview' && preview && (
              <div>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-56 object-cover rounded-xl mb-4"
                />

                <div className="mb-4">
                  <label className="woof-label">
                    Lokacija <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="npr. Beograd, Novi Beograd, Blok 45"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value)
                      setSpottedError(null)
                    }}
                    className={`woof-input ${
                      spottedError ? 'border-red-400 focus:ring-red-300' : ''
                    }`}
                  />
                  {spottedError && (
                    <p className="woof-field-error">{spottedError}</p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="woof-label">Opis (opciono)</label>
                  <textarea
                    rows={2}
                    placeholder="Boja, veličina, posebne oznake..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="woof-input resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500
                               text-white text-sm font-medium rounded-lg
                               transition-colors disabled:opacity-60
                               disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Analiziranje...' : '📸 Prijavi psa'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 text-sm text-gray-500
                               hover:text-gray-700 transition-colors"
                  >
                    Otkaži
                  </button>
                </div>
              </div>
            )}

            {/* Rezultat */}
            {step === 'result' && (
              <div className="text-center">
                {resultImageUrl && (
                  <img
                    src={resultImageUrl}
                    alt="Uočeni pas"
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                )}

                <div className="mb-4 rounded-lg bg-woof-green-50
                                border border-woof-green-100 px-4 py-3">
                  <p className="text-sm text-woof-green-700 font-medium">
                    ✓ Pas je prijavljen! Vlasnici u tvojoj blizini su
                    obavešteni.
                  </p>
                </div>

                {/* {predictions.length > 0 && (
                  <div className="mb-5">
                    <p className="text-xs text-gray-500 mb-3">
                      AI predikcija rase:
                    </p>
                    <div className="space-y-2">
                      {predictions.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between
                                     bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <span className="text-sm text-gray-700">
                            {i + 1}. {p.breed}
                          </span>
                          <span className="text-xs text-gray-400">
                            {(p.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                {predictions.map((p, i) => {
                  const aiBreedKey = p.breed.toLowerCase().trim();

                  const foundKey = Object.keys(translations).find(
                    (key) => key.toLowerCase().trim() === aiBreedKey
                  );

                  let displayName = foundKey ? translations[foundKey] : p.breed.replace(/_/g, ' ');

                  if (!foundKey && displayName.length > 0) {
                    displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
                  }

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                    >
                      <span className="text-sm text-gray-700 font-medium">
                        {i + 1}. {displayName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {(p.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  );
                })}

                {predictions.length > 0 && (
                  <button
                    onClick={() => navigate(`/lost-dogs?breed=${encodeURIComponent(predictions[0].breed)}`)}
                    className="w-full mt-4 py-2.5 bg-woof-blue-600 hover:bg-woof-blue-700
                              text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    🔍 Pogledaj nestale pse ove rase
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 border border-gray-200
                             text-sm text-gray-600 font-medium rounded-lg
                             hover:bg-gray-50 transition-colors"
                >
                  Prijavi još jednog psa
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}