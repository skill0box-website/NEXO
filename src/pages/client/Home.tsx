import { useState } from 'react'
import { Scissors, Shirt, ShoppingBag, Ruler, ChevronRight, Clock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useClientOrders } from '@/hooks/useOrder'
import { useMyReviewedOrders } from '@/hooks/useMyReviewedOrders'
import PatternBg from '@/components/ui/PatternBg'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import Tailleurs from '@/pages/client/Tailleurs'
import Modeles from '@/pages/client/Modeles'
import Measurements from '@/pages/client/Measurements'
import NewOrder from '@/pages/client/NewOrder'
import ReviewForm from '@/pages/client/ReviewForm'
import Chat from '@/components/shared/Chat'
import { C, STEPS } from '@/constants/theme'
import Boutiques from '@/pages/client/Boutiques'

export default function ClientHome() {
  const { profile, signOut } = useAuth()
  const { orders, loading } = useClientOrders(profile?.id ?? '')
  const reviewedIds = useMyReviewedOrders(profile?.id ?? '')

  const [tab, setTab] = useState('home')
  const [showMeasures, setShowMeasures] = useState(false)
  const [orderingTailleur, setOrderingTailleur] = useState<{ id: string; name: string } | null>(null)
  const [chattingOrderId, setChattingOrderId] = useState<string | null>(null)
  const [reviewingOrderId, setReviewingOrderId] = useState<string | null>(null)

  if (!profile) return null

  // ── Écrans plein écran (priorité sur tout le reste) ──
  if (showMeasures) return <Measurements onBack={() => setShowMeasures(false)} clientId={profile.id} />

  if (orderingTailleur) return (
    <NewOrder
      clientId={profile.id}
      tailleurId={orderingTailleur.id}
      tailleurName={orderingTailleur.name}
      onBack={() => setOrderingTailleur(null)}
      onCreated={() => { setOrderingTailleur(null); setTab('home') }}
    />
  )

  if (chattingOrderId) {
    const order = orders.find(o => o.id === chattingOrderId)
    if (!order) return null
    return (
      <Chat
        commandeId={order.id}
        currentUserId={profile.id}
        otherName={`${order.tailleur?.profile?.prenom ?? ''} ${order.tailleur?.profile?.nom ?? ''}`.trim() || 'Tailleur'}
        onBack={() => setChattingOrderId(null)}
      />
    )
  }

  if (reviewingOrderId) {
    const orderToReview = orders.find(o => o.id === reviewingOrderId)
    if (!orderToReview) return null
    return (
      <ReviewForm
        order={orderToReview}
        clientId={profile.id}
        onBack={() => setReviewingOrderId(null)}
        onSubmitted={() => setReviewingOrderId(null)}
      />
    )
  }

  if (tab === 'tailleurs') return (
    <div>
      <Tailleurs
        userId={profile.id}
        onOrder={(id, name) => setOrderingTailleur({ id, name })}
      />
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )

  if (tab === 'modeles') return (
    <div>
      <Modeles />
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )

  if (tab === 'pret') return (
  <div>
    <Boutiques />
    <BottomNav active={tab} onChange={setTab} />
  </div>
)

  // ── Onglet Accueil ──
  const activeOrder = orders.find(o => o.step < 5)
  const completedUnreviewed = orders.filter(o => o.step === 5 && !reviewedIds.has(o.id))

  return (
    <PatternBg className="min-h-screen pb-20">
      <Header
        prenom={profile.prenom}
        nom={profile.nom}
        userId={profile.id}
        onLogout={signOut}
      />

      <div className="px-4 py-4 space-y-4">
        <button
          onClick={() => setShowMeasures(true)}
          className="w-full rounded-2xl p-4 shadow-sm flex items-center gap-3 text-left"
          style={{ background: `linear-gradient(120deg, ${C.navy}, ${C.navyLight})` }}
        >
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
            <Ruler size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-white text-sm">Mes mesures</p>
            <p className="text-xs text-white/80">Prends-les toi-même, sans te déplacer</p>
          </div>
          <ChevronRight size={18} className="text-white/80" />
        </button>

        {loading ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm">
            Chargement...
          </div>
        ) : activeOrder ? (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#f3d9c6' }}>
            <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${C.terra}, ${C.terraDark})` }} />
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Ma commande en cours</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fdebe3', color: C.terraDark }}>
                  {STEPS[activeOrder.step]}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {activeOrder.garment} — <span style={{ color: C.terra }}>
                  {activeOrder.tailleur?.profile?.prenom ?? 'Tailleur'}
                </span>
              </p>
              <div className="flex gap-1">
                {STEPS.map((_, i) => (
                  <div key={i} className="flex-1 h-2 rounded-full"
                    style={{ backgroundColor: i <= activeOrder.step ? C.terra : '#e5e7eb' }} />
                ))}
              </div>
              {activeOrder.delay ? (
                <div className="mt-3 flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg">
                  ⚠️ Retard détecté sur cette commande
                          {activeOrder.price != null && (
          <p className="text-xs text-gray-500 mt-2">
            💰 Payé : {(activeOrder.montant_paye ?? 0).toLocaleString()} / {activeOrder.price.toLocaleString()} FCFA
          </p>
        )}
                </div>

                
              ) : (
                <div className="mt-3 flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs px-3 py-2 rounded-lg">
                  <Clock size={13} />
                  Livraison prévue le{' '}
                  {activeOrder.delivery_date ? new Date(activeOrder.delivery_date).toLocaleDateString('fr') : '—'}
                </div>
              )}
              <button
                onClick={() => setChattingOrderId(activeOrder.id)}
                className="mt-3 w-full flex items-center justify-center gap-1.5 border rounded-xl py-2 text-sm font-medium"
                style={{ borderColor: C.terra, color: C.terra }}
              >
                💬 Discuter avec le tailleur
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
            <p className="text-gray-500 text-sm">Aucune commande en cours</p>
            <button
              onClick={() => setTab('tailleurs')}
              className="mt-3 text-sm font-medium px-4 py-2 rounded-xl text-white"
              style={{ backgroundColor: C.terra }}
            >
              Trouver un tailleur →
            </button>
          </div>
        )}

        {completedUnreviewed.map(o => (
          <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-800">{o.garment}</p>
              <p className="text-xs text-gray-500">Commande livrée — donne ton avis !</p>
            </div>
            <button
              onClick={() => setReviewingOrderId(o.id)}
              className="text-xs font-medium text-white px-3 py-2 rounded-xl shrink-0"
              style={{ backgroundColor: C.terra }}
            >
              Laisser un avis
            </button>
          </div>
        ))}

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tailleurs', icon: Scissors, bg: '#fdebe3', fg: C.terra, t: 'tailleurs' },
            { label: 'Modèles', icon: Shirt, bg: '#e7e9f5', fg: C.navy, t: 'modeles' },
            { label: 'Boutiques', icon: ShoppingBag, bg: '#d1fae5', fg: '#059669', t: 'pret' },
          ].map(a => (
            <button key={a.t} onClick={() => setTab(a.t)}
              className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center gap-2 border border-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: a.bg }}>
                <a.icon size={20} style={{ color: a.fg }} />
              </div>
              <span className="text-xs font-medium text-gray-700">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active={tab} onChange={setTab} />
    </PatternBg>
  )
}