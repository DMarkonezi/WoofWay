import { useNavigate } from "react-router-dom"
import { Dog } from "../../dogs/services/dogService"
import { DOG_STATUS_COLORS, DOG_STATUS_LABELS } from "../../dogs/constants"

interface DogCardProps {
  dog: Dog
  onContact: () => void
}

export function HomePageDogCard({ dog, onContact }: DogCardProps) {
  const navigate = useNavigate()

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-card
                 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/dogs/${dog.id}`)}
    >
      <div className="h-48 bg-gray-100 overflow-hidden">
        {dog.imageUrl ? (
          <img
            src={dog.imageUrl}
            alt={dog.name ?? 'Pas'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center
                          justify-center text-4xl">
            🐶
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-gray-900 truncate">
            {dog.name ?? 'Nepoznato ime'}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                           shrink-0 ${DOG_STATUS_COLORS[dog.status]}`}>
            {DOG_STATUS_LABELS[dog.status]}
          </span>
        </div>

        {dog.breed && (
          <p className="text-xs text-gray-400 mb-1">{dog.breed}</p>
        )}

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {dog.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            📍 {dog.location}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onContact()
            }}
            className="text-xs text-woof-blue-600 font-medium hover:underline"
          >
            Kontaktiraj →
          </button>
        </div>
      </div>
    </div>
  )
}