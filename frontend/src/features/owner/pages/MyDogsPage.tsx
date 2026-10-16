import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dogService, Dog } from '../../dogs/services/dogService'
import { useAuth } from '../../auth/context/AuthContext'
import { useAsync } from '../../../shared/hooks/useAsync'
import { DOG_STATUS_COLORS, DOG_STATUS_LABELS } from '../../dogs/constants'
import { breedService } from '../../dogs/services/breedService'

type Tab = 'pets' | 'lost'

export default function MyDogsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('pets')

  const { data, loading, error, refetch } = useAsync(async () => {
    const [dogs, translations] = await Promise.all([
      dogService.getMy(),
      breedService.getAllTranslations()
    ]);
    return { dogs, translations };
  }, [user])

  const allDogs = data?.dogs ?? [];
  const translations: Record<string, string> = data?.translations ?? {};

  const pets = allDogs.filter((d) => d.status === 'Pet')
  const lostDogs = allDogs.filter((d) => d.status === 'Lost')

  async function handleReportLost(dog: Dog) {
    if (!confirm(`Da li ste sigurni da želite da prijavite "${dog.name || 'psa'}" kao nestalog?`))
      return
    try {
      await dogService.updateStatus(dog.id, 'Lost')
      refetch()
    } catch {
      alert('Greška pri promeni statusa.')
    }
  }

  async function handleMarkFound(dog: Dog) {
    if (!confirm(`Da li ste pronašli "${dog.name || 'psa'}"?`)) return
    try {
      await dogService.updateStatus(dog.id, 'Pet')
      refetch()
    } catch {
      alert('Greška pri promeni statusa.')
    }
  }

  async function handleDelete(dog: Dog) {
    if (!confirm(`Da li ste sigurni da želite trajno obrisati "${dog.name || 'psa'}"? Ova akcija se ne može poništiti.`)) 
      return;
      
    try {
      await dogService.delete(dog.id);
      refetch();
    } catch {
      alert('Greška pri brisanju psa.');
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Moji psi</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Upravljajte vašim psima i oglasima
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/owner/my-dogs/new')}
          className="px-4 py-2 bg-woof-blue-600 hover:bg-woof-blue-700
                     text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Dodaj psa
        </button>
      </div>

      {/* Tabovi */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('pets')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                     ${activeTab === 'pets'
                       ? 'bg-white text-gray-900 shadow-sm'
                       : 'text-gray-500 hover:text-gray-700'
                     }`}
        >
          🐶 Moji ljubimci
          {pets.length > 0 && (
            <span className="ml-2 text-xs bg-woof-blue-100 text-woof-blue-700
                             px-1.5 py-0.5 rounded-full">
              {pets.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('lost')}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
                     ${activeTab === 'lost'
                       ? 'bg-white text-gray-900 shadow-sm'
                       : 'text-gray-500 hover:text-gray-700'
                     }`}
        >
          🔴 Oglasi
          {lostDogs.length > 0 && (
            <span className="ml-2 text-xs bg-red-100 text-red-700
                             px-1.5 py-0.5 rounded-full">
              {lostDogs.length}
            </span>
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 bg-white rounded-xl border
                                    border-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && activeTab === 'pets' && (
        <>
          {pets.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🐾</p>
              <p className="text-sm">Nemate dodanih ljubimaca.</p>
              <button
                onClick={() => navigate('/dashboard/owner/my-dogs/new')}
                className="mt-4 px-4 py-2 bg-woof-blue-600 hover:bg-woof-blue-700
                           text-white text-sm font-medium rounded-lg transition-colors"
              >
                Dodaj prvog psa
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  translations={translations}
                  action={
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReportLost(dog)}
                        className="flex-1 py-1.5 text-xs text-red-500 border border-red-100 rounded-lg hover:bg-red-50"
                      >
                        Prijavi nestanak
                      </button>
                      <button
                        onClick={() => handleDelete(dog)}
                        className="px-2 text-gray-400 hover:text-red-600 border border-gray-100 rounded-lg hover:bg-red-50"
                        title="Obriši"
                      >
                        🗑️
                      </button>
                    </div>
                  }
                />
              ))}
            </div>
          )}
        </>
      )}

      {!loading && !error && activeTab === 'lost' && (
        <>
          {lostDogs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-sm">Nemate aktivnih oglasa za nestale pse.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lostDogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  translations={translations}
                  action={
                    <button
                      onClick={() => handleMarkFound(dog)}
                      className="w-full mt-3 py-1.5 text-xs text-woof-green-600
                                 border border-woof-green-100 rounded-lg
                                 hover:bg-woof-green-50 transition-colors"
                    >
                      Označi kao pronađenog
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface DogCardProps {
  dog: Dog
  translations: Record<string, string>
  action?: React.ReactNode
}

function DogCard({ dog, translations, action }: DogCardProps) {

  const getBreedDisplay = (rawBreed: string) => {
    
    const translation = translations[rawBreed] || translations[rawBreed.toLowerCase()];
    if (translation) return translation;

    return rawBreed
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-card">
      {/* Slika */}
      <div className="h-40 bg-gray-100 rounded-t-xl overflow-hidden">
        {dog.imageUrl ? ( 
          <img
            src={dog.imageUrl}
            alt={dog.name || 'Pas'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center
                          justify-center text-3xl">
            🐶
          </div>
        )}
      </div>

      {/* Sadržaj */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-gray-900 truncate">
            {dog.name || 'Nepoznato ime'}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                           shrink-0 ml-2 ${DOG_STATUS_COLORS[dog.status]}`}>
            {DOG_STATUS_LABELS[dog.status]}
          </span>
        </div>

        {/* {dog.breed && (
          <p className="text-xs text-gray-400 mb-1">{dog.breed}</p>
        )} */}
        {dog.breed && (
          <p className="text-xs text-gray-400 mb-1">
            {getBreedDisplay(dog.breed)}
          </p>
        )}

        <p className="text-xs text-gray-400">📍 {dog.location}</p>

        {action}
      </div>
    </div>
  )
}