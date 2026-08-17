import { MapPin } from 'lucide-react'
import { C } from '@/constants/theme'

const PRET_A_PORTER = [
  { id: 1, shop: 'DakarStyle', item: 'Chemise coton wax', price: '12 000 FCFA', emoji: '🏪', city: 'Dakar' },
  { id: 2, shop: 'ModeSenegal', item: 'Robe prête wax', price: '18 000 FCFA', emoji: '👗', city: 'Dakar' },
  { id: 3, shop: 'AfricaFashion', item: 'Boubou homme', price: '22 000 FCFA', emoji: '🧥', city: 'Thiès' },
  { id: 4, shop: 'WaxBoutique', item: 'Ensemble femme', price: '15 000 FCFA', emoji: '🛍️', city: 'Saint-Louis' },
]

export default function Boutiques() {
  return (
    <div className="px-4 py-4 space-y-3">
      <p className="text-sm text-gray-500">Boutiques disponibles près de chez vous</p>
      {PRET_A_PORTER.map(p => (
        <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="text-3xl">{p.emoji}</div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">{p.shop}</p>
            <p className="text-xs text-gray-600 mt-0.5">{p.item}</p>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin size={10} /> {p.city}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold" style={{ color: C.terra }}>{p.price}</p>
            <button className="mt-1.5 text-xs text-white px-3 py-1 rounded-full"
              style={{ backgroundColor: C.terra }}>
              Voir
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}