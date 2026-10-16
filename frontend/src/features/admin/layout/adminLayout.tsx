import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext'

const NAV = [
  { to: '/admin/shelters', icon: '🏢', label: 'Verifikacija azila' },
  { to: '/admin/users',    icon: '👥', label: 'Korisnici'          },
  { to: '/admin/offers',   icon: '📋', label: 'Ponude'             },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100
                        flex flex-col fixed inset-y-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-lg font-semibold text-woof-blue-600">
            WoofWay
          </span>
          <span className="ml-1">🐾</span>
          <span className="ml-2 text-xs bg-red-100 text-red-600
                           px-2 py-0.5 rounded-full font-medium">
            Admin
          </span>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Administrator</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                 transition-colors
                 ${isActive
                   ? 'bg-woof-blue-50 text-woof-blue-600 font-medium'
                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                 }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
                       text-sm text-gray-500 hover:bg-red-50 hover:text-red-600
                       transition-colors"
          >
            <span>🚪</span>
            Odjavi se
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-64">
        <header className="h-16 bg-white border-b border-gray-100
                           flex items-center px-6 sticky top-0 z-30">
          <h1 className="text-sm font-medium text-gray-500">
            Admin panel
          </h1>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>

    </div>
  )
}