import { useState } from 'react'
import { Search, Filter, MapPin, MessageCircle } from 'lucide-react'
import { useTailors } from '@/hooks/useTailors'
import { C } from '@/constants/theme'

interface Props {
  userId: string
  onOrder: (tailleurId: string, tailleurName: string) => void
}

export default function Tailleurs({ userId, onOrder }: Props) {
  const [search, setSearch] = useState('')
  const { tailors, loading } = useTailors(search)

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white border rounded-xl px-3 py-2.5"
          style={{ borderColor: '#f3d9c6' }}>
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Chercher un tailleur, spécialité..."
            className="flex-1 text-sm focus:outline-none"
          />
        </div>
        <button className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: '#fdebe3' }}>
          <Filter size={16} style={{ color: C.terra }} />
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 text-sm py-8">Chargement...</p>
      ) : tailors.length === 0 ? (
        <p className="text-center text-gray-400 text-sm py-8">Aucun tailleur trouvé</p>
      ) : (
        <div className="space-y-3">
          {tailors.map(t => {
            const fullName = `${t.profile?.prenom ?? ''} ${t.profile?.nom ?? ''}`.trim()
            return (
              <div key={t.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: C.navy }}>
                    {t.profile?.prenom?.[0]}{t.profile?.nom?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-800">{fullName || 'Tailleur'}</p>
                      {t.certified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          ✓ Certifié
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[1,2,3,4,5].map(i => (
                        <span key={i} style={{ color: i <= Math.round(t.rating) ? '#f59e0b' : '#d1d5db' }}>★</span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{t.rating} ({t.reviews_count})</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <MapPin size={10} /> {t.city || '—'} · {t.experience || '—'}
                    </p>
                    {t.specialities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {t.specialities.map((s: string) => (
                          <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#fdebe3', color: C.terra }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Clic Commander →', t.id, fullName)
                      onOrder(t.id, fullName || 'Tailleur')
                    }}
                    className="flex-1 text-sm font-medium text-white rounded-xl py-2"
                    style={{ backgroundColor: C.terra }}
                  >
                    Commander
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}