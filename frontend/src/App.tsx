import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './features/auth/components/ProtectedRoute'
import GuestRoute from './features/auth/components/GuestRoute'

// Public
import HomePage from './features/landing/pages/HomePage'
import LoginPage from './features/auth/pages/LoginPage'
import RegisterPage from './features/auth/pages/RegisterPage'

// Owner
import MyDogsPage from './features/owner/pages/MyDogsPage'
import AddDogPage from './features/owner/pages/AddDogPage'
import LostDogsPage from './features/owner/pages/LostDogsPage'
import SittersPage from './features/owner/pages/SittersPage'
import SitterProfilePage from './features/owner/pages/SitterProfilePage'
import SheltersPage from './features/owner/pages/SheltersPage'
import ShelterProfilePage from './features/owner/pages/ShelterProfilePage'

// Sitter
import MyOffersPage from './features/sitter/pages/MyOffersPage'
import AddOfferPage from './features/sitter/pages/AddOfferPage'
import EditOfferPage from './features/sitter/pages/EditOfferPage'
import MyRequestsPage from './features/sitter/pages/MyRequestsPage'

// Shelter
import ShelterDogsPage from './features/shelters/pages/ShelterDogsPage'
import AddShelterDogPage from './features/shelters/pages/AddShelterDogPage'
import ShelterOffersPage from './features/shelters/pages/ShelterOffersPage'
import ShelterRequestsPage from './features/shelters/pages/ShelterRequestsPage'

// Profile
import ProfilePage from './features/auth/pages/ProfilePage'
import ChatPage from './features/chat/pages/ChatPage'
import { AdminRoute } from './features/admin/componets/AdminRoute'
import AdminLayout from './features/admin/layout/adminLayout'
import PendingSheltersPage from './features/admin/pages/PendingSheltersPage'
import UsersPage from './features/admin/pages/UsersPage'
import OffersPage from './features/admin/pages/OffersPage'
import LostDogProfilePage from './features/dogs/pages/LostDogProfilePage'
import BreedMatchPage from './features/dogs/pages/BreedMatchPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/lost-dogs/:id"
          element={
            <ProtectedRoute allowedRoles={['Owner']}>
              <LostDogProfilePage />
            </ProtectedRoute>
          }
        />

        <Route element={<PublicLayout />}>
          <Route path="/lost-dogs" element={<BreedMatchPage />} />
        </Route>

        {/* Guest only — ulogovani se rutiraju na dashboard */}
        <Route element={<GuestRoute />}>
          <Route element={<PublicLayout />}>
            <Route path="/"         element={<HomePage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Zasticene stranice */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* Owner */}
            <Route path="/dashboard/owner/my-dogs"           element={<MyDogsPage />} />
            <Route path="/dashboard/owner/my-dogs/new"       element={<AddDogPage />} />
            <Route path="/dashboard/owner/lost-dogs"         element={<LostDogsPage />} />
            <Route path="/dashboard/owner/sitters"           element={<SittersPage />} />
            <Route path="/dashboard/owner/sitters/:id"       element={<SitterProfilePage />} />
            <Route path="/dashboard/owner/shelters"          element={<SheltersPage />} />
            <Route path="/dashboard/owner/shelters/:id"      element={<ShelterProfilePage />} />
            <Route path="/dashboard/owner/profile"           element={<ProfilePage />} />

            {/* Sitter */}
            <Route path="/dashboard/sitter/offers"           element={<MyOffersPage />} />
            <Route path="/dashboard/sitter/offers/new"       element={<AddOfferPage />} />
            <Route path="/dashboard/sitter/offers/:id/edit"  element={<EditOfferPage />} />
            <Route path="/dashboard/sitter/requests"         element={<MyRequestsPage />} />
            <Route path="/dashboard/sitter/profile"          element={<ProfilePage />} />

            {/* Shelter */}
            <Route path="/dashboard/shelter/dogs"            element={<ShelterDogsPage />} />
            <Route path="/dashboard/shelter/dogs/new"        element={<AddShelterDogPage />} />
            <Route path="/dashboard/shelter/offers"          element={<ShelterOffersPage />} />
            <Route path="/dashboard/shelter/offers/new"      element={<AddOfferPage />} />
            <Route path="/dashboard/shelter/offers/:id/edit" element={<EditOfferPage />} />
            <Route path="/dashboard/shelter/profile"         element={<ProfilePage />} />

            <Route path="/dashboard/shelter/requests" element={<ShelterRequestsPage />} />

            <Route path="/dashboard/owner/chat"   element={<ChatPage />} />
            <Route path="/dashboard/sitter/chat"  element={<ChatPage />} />
            <Route path="/dashboard/shelter/chat" element={<ChatPage />} />

          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/shelters" element={<PendingSheltersPage />} />
            <Route path="/admin/users"    element={<UsersPage />} />
            <Route path="/admin/offers"   element={<OffersPage />} />
            <Route path="/admin"          element={<Navigate to="/admin/shelters" replace />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}