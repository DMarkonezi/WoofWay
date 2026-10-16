import { NavLink } from 'react-router-dom'
import { useAuth } from "../../features/auth/context/AuthContext"

interface SidebarProps {
  onNavigate: () => void
}

interface NavItem {
  to: string
  icon: string
  label: string
}

const OWNER_NAV: NavItem[] = [
  { to: '/dashboard/owner/lost-dogs',  icon: '🐾', label: 'Nestali psi'  },
  { to: '/dashboard/owner/my-dogs',    icon: '🐶', label: 'Moji psi'     },
  { to: '/dashboard/owner/sitters',    icon: '🏠', label: 'Čuvari'       },
  { to: '/dashboard/owner/shelters',   icon: '🏢', label: 'Azili'        },
  { to: '/dashboard/owner/chat',       icon: '💬', label: 'Chat'         },
]

const SITTER_NAV: NavItem[] = [
  { to: '/dashboard/sitter/offers',    icon: '📋', label: 'Moje ponude'  },
  { to: '/dashboard/sitter/requests', icon: '📩', label: 'Primljeni zahtevi' },
  { to: '/dashboard/sitter/chat',      icon: '💬', label: 'Chat'         },
]

const SHELTER_NAV: NavItem[] = [
  { to: '/dashboard/shelter/dogs',     icon: '🐕', label: 'Psi u azilu'  },
  { to: '/dashboard/shelter/offers',   icon: '🏠', label: 'Ponude čuvanja' },
  { to: '/dashboard/shelter/requests', icon: '📩', label: 'Zahtevi'        },
  { to: '/dashboard/shelter/chat',     icon: '💬', label: 'Chat'         },
]

const NAV_MAP = {
  Owner:   OWNER_NAV,
  Sitter:  SITTER_NAV,
  Shelter: SHELTER_NAV,
  Admin: null,
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const { user, logout } = useAuth()

  if (!user) return null

  const navItems = NAV_MAP[user.role]

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">

      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="text-lg font-semibold text-woof-blue-600">WoofWay</span>
        <span className="ml-1">🐾</span>
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{user.role}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems?.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
               transition-colors
               ${isActive
                 ? 'bg-woof-blue-50 text-woof-blue-600 font-medium'
                 : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
               }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
                     text-sm text-gray-500 hover:bg-red-50 hover:text-red-600
                     transition-colors"
        >
          <span>🚪</span>
          Odjavi se
        </button>
      </div>

    </div>
  )
}