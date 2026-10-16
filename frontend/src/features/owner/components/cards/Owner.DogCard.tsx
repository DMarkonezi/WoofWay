import { Link } from 'react-router-dom'
import { Dog } from "../../../dogs/services/dogService";
import { DOG_STATUS_COLORS, DOG_STATUS_LABELS } from '../../../dogs/constants'

export function Owner_DogCard({ dog }: { dog: Dog }) {
  const cardContent = (
    <div className="bg-white rounded-xl border border-gray-100
                    shadow-card hover:shadow-md transition-shadow">
      <div className="h-44 bg-gray-100 rounded-t-xl overflow-hidden">
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

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-gray-900 truncate">
            {dog.name || 'Nepoznato ime'}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                           shrink-0 ${DOG_STATUS_COLORS[dog.status]}`}>
            {DOG_STATUS_LABELS[dog.status]}
          </span>
        </div>

        {dog.breed && (
          <p className="text-xs text-gray-400 mb-2">{dog.breed}</p>
        )}

        {dog.status === 'Spotted' && dog.detectedBreed && (
          <p className="text-xs text-yellow-600 mb-2">
            🤖 AI: {dog.detectedBreed}
          </p>
        )}

        <p className="text-sm text-gray-500 line-clamp-2 mb-3">
          {dog.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>📍 {dog.location}</span>
          {dog.eventDate && (
            <span>{new Date(dog.eventDate).toLocaleDateString('sr-RS')}</span>
          )}
        </div>

        {dog.status === 'Lost' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-woof-blue-600 font-medium">
              Pogledaj oglas →
            </span>
          </div>
        )}
      </div>
    </div>
  )

  if (dog.status === 'Lost' || dog.status === 'Spotted') {
    return (
      <Link to={`/lost-dogs/${dog.id}`}>
        {cardContent}
      </Link>
    )
  }

  return cardContent
}