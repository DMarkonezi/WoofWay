import { Shelter } from "../../../shelters/services/shelterService"

export function Owner_ShelterCard({
  shelter,
  onClick,
}: {
  shelter: Shelter
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-card
                 hover:shadow-md transition-shadow cursor-pointer p-5"
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-woof-blue-100
                      flex items-center justify-center text-2xl mb-4">
        🏢
      </div>

      <h3 className="font-medium text-gray-900 mb-1 truncate">
        {shelter.shelterName}
      </h3>

      <p className="text-xs text-gray-400 mb-2">📍 {shelter.address}</p>

      <p className="text-sm text-gray-500 line-clamp-2 mb-4">
        {shelter.description}
      </p>

      <div className="pt-3 border-t border-gray-100
                      flex items-center justify-between">
        <span className="text-xs text-gray-400">
          🐕 {shelter.dogs.length} pasa
        </span>
        <span className="text-xs text-woof-green-600 font-medium">
          Verifikovan ✓
        </span>
      </div>
    </div>
  )
}