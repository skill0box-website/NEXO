import { useState } from 'react'
import { ChevronRight, AlertTriangle, Lock, Unlock, Award } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useTailleurOrders } from '@/hooks/useOrder'
import PatternBg from '@/components/ui/PatternBg'
import Header from '@/components/layout/Header'
import OrderDetail from '@/pages/tailleur/OrderDetail'
import MyProfile from '@/pages/tailleur/MyProfile'
import { C, STEPS } from '@/constants/theme'

export default function TailleurDashboard() {
  const { profile, signOut } = useAuth()
  const { orders, loading, advanceStep, toggleLock } = useTailleurOrders(profile?.id ?? '')
  const [openOrderId, setOpenOrderId] = useState<string | null>(null)
  const [showProfile, setShowProfile] = useState(false)

  if (!profile) return null

  const delayed = orders.filter(o => o.delay).length
  const done = orders.filter(o => o.step === 5).length

  if (showProfile) return <MyProfile profile={profile} onBack={() => setShowProfile(false)} />

  if (openOrderId) {
    const order = orders.find(o => o.id === openOrderId)
    if (!order) return null
    return (
      <OrderDetail
        order={order}
        userId={profile.id}
        onBack={() => setOpenOrderId(null)}
        onAdvance={() => advanceStep(order.id, order.step)}
        onToggleLock={() => toggleLock(order.id, order.locked)}
      />
    )
  }

  return (
    <PatternBg className="min-h-screen pb-6">
      <Header
        prenom={profile.prenom}
        nom={profile.nom}
        userId={profile.id}
        subtitle="Tableau de bord ✂️"
        onLogout={signOut}
        stats={[
          { label: 'Commandes', val: orders.length },
          { label: 'En retard', val: delayed, danger: delayed > 0 },
          { label: 'Terminées', val: done, success: true },
        ]}
      />

      <div className="px-4 py-4 space-y-3">
        <button
          onClick={() => setShowProfile(true)}
          className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: C.navy }}>
            {profile.prenom[0]}{profile.nom[0]}
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-gray-800 text-sm">Voir mon profil</p>
            <p className="text-xs text-gray-500">Succès, avis clients, points à améliorer</p>
          </div>
          <Award size={16} style={{ color: C.terra }} />
        </button>

        <h3 className="font-semibold text-gray-800 pt-1">Mes commandes</h3>

        {loading ? (
          <p className="text-center text-gray-400 text-sm py-6">Chargement...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">Aucune commande pour l'instant</p>
        ) : (
          orders.map(o => (
            <button
              key={o.id}
              onClick={() => setOpenOrderId(o.id)}
              className="w-full text-left bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {o.client?.prenom} {o.client?.nom}
                  </p>
                  <p className="text-xs text-gray-500">{o.garment} · {o.occasion}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {o.delay
                    ? <span className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={11} />Retard
                      </span>
                    : <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                        ✓ À l'heure
                      </span>
                  }
                  {o.locked
                    ? <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#e7e9f5', color: C.navy }}>
                        <Lock size={10} />Verrouillé
                      </span>
                    : <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        <Unlock size={10} />Modifiable
                      </span>
                  }
                </div>
              </div>

              <div className="flex gap-1 mb-2">
                {STEPS.map((_, i) => (
                  <div key={i} className="flex-1 h-2 rounded-full"
                    style={{ backgroundColor: i <= o.step ? C.terra : '#e5e7eb' }} />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  → {STEPS[o.step]} · {o.delivery_date ? new Date(o.delivery_date).toLocaleDateString('fr') : '—'}
                </span>
                <span className="text-xs font-medium flex items-center gap-1" style={{ color: C.terra }}>
                  Voir détail <ChevronRight size={12} />
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </PatternBg>
  )
}