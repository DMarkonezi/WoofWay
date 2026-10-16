import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/context/AuthContext'

const ROLE_REDIRECT = {
  Owner:   '/dashboard/owner/my-dogs',
  Sitter:  '/dashboard/sitter/offers',
  Shelter: '/dashboard/shelter/dogs',
}

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-semibold text-woof-blue-600 tracking-tight">
            WoofWay
          </span>
          <span className="text-xl">🐾</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <Link
            to="/"
            className="hover:text-gray-900 transition-colors"
          >
            Početna
          </Link>
          <Link
            to="/?tab=spotted"
            className="hover:text-gray-900 transition-colors"
          >
            Prijavi psa
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={() => navigate(ROLE_REDIRECT[user.role])}
                className="px-4 py-2 text-sm text-woof-blue-600 font-medium
                           hover:bg-woof-blue-50 rounded-lg transition-colors"
              >
                {user.firstName} {user.lastName}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-500 font-medium
                           hover:bg-gray-100 rounded-lg transition-colors"
              >
                Odjavi se
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm text-woof-blue-600 font-medium
                           hover:bg-woof-blue-50 rounded-lg transition-colors"
              >
                Prijavi se
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 text-sm text-white font-medium
                           bg-woof-blue-600 hover:bg-woof-blue-700
                           rounded-lg transition-colors"
              >
                Registruj se
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  )
}