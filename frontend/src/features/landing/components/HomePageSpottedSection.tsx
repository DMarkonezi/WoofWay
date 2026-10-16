import { useSpotted } from '../hooks/useSpotted';

export function SpottedSection() {
  const {  
    step, 
    preview, 
    location, 
    setLocation, 
    description, 
    setDescription, 
    predictions, 
    submitting, 
    spottedError,       
    setSpottedError,    
    resultImageUrl, 
    fileInputRef, 
    handleFileSelect, 
    handleDrop,        
    handleReset, 
    handleSubmit 
  } = useSpotted();

  return (
    <section className="max-w-xl mx-auto px-4 py-14">
          <div className="text-center mb-8">
            <span className="text-4xl">📸</span>
            <h2 className="text-2xl font-semibold text-gray-900 mt-3">
              Vidio/la si psa na ulici?
            </h2>
            <p className="text-sm text-gray-400 mt-2">
              Uslikaj ga i prijavi — naš AI će prepoznati rasu i obavestiti
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

                {predictions.length > 0 && (
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
  );
}