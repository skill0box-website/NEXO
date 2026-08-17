import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import Onboarding from '@/pages/Onboarding'
import Auth from '@/pages/Auth'
import ClientHome from '@/pages/client/Home'
import TailleurDashboard from '@/pages/tailleur/Dashboard'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import { C } from '@/constants/theme'

export default function App() {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: C.cream }}>
      <div className="text-center">
        <div className="text-5xl mb-3 animate-pulse">✂️</div>
        <p className="text-gray-400 text-sm">Chargement...</p>
      </div>
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />

        <Route path="/auth" element={
          !user ? <Auth /> : <Navigate to="/app" />
        } />

        <Route path="/app" element={
          !user ? <Navigate to="/auth" /> :
          !profile ? (
            <div className="min-h-screen flex items-center justify-center"
              style={{ backgroundColor: C.cream }}>
              <p className="text-gray-400 text-sm">Préparation de ton profil...</p>
            </div>
          ) :
          profile.role === 'client'   ? <ClientHome /> :
          profile.role === 'tailleur' ? <TailleurDashboard /> :
          <Navigate to="/auth" />
        } />

        <Route path="/admin" element={
          !user ? <Navigate to="/auth" /> :
          profile?.is_admin ? <AdminDashboard /> : <Navigate to="/app" />
        } />

        <Route path="*" element={
          <Navigate to={user ? '/app' : '/onboarding'} />
        } />
      </Routes>
    </BrowserRouter>
  )
}