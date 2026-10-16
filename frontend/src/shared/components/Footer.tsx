import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-woof-blue-600">WoofWay</span>
            <span>🐾</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              Početna
            </Link>
            <Link to="/dogs" className="hover:text-gray-600 transition-colors">
              Psi
            </Link>
            <Link to="/login" className="hover:text-gray-600 transition-colors">
              Prijava
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} WoofWay. Sva prava zadržana.
          </p>

        </div>
      </div>
    </footer>
  )
}