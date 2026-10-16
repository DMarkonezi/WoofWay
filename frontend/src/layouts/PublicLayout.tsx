import { Outlet } from 'react-router-dom'
import Header from '../shared/components/Header'
import Footer from '../shared/components/Footer'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}