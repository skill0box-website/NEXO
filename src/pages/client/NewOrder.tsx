import { useState } from 'react'
import { ArrowLeft, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCreateOrder } from '@/hooks/useCreateOrder'
import PatternBg from '@/components/ui/PatternBg'
import { C } from '@/constants/theme'

interface Props {
  clientId: string
  tailleurId: string
  tailleurName: string
  onBack: () => void
  onCreated: (commandeId: string) => void
}

export default function NewOrder({ clientId, tailleurId, tailleurName, onBack, onCreated }: Props) {
  const [livraison, setLivraison] = useState(false)
const [adresse, setAdresse] = useState('')
  const { createOrder } = useCreateOrder()
  const [garment, setGarment] = useState('')
  const [occasion, setOccasion] = useState('')
  const [fabric, setFabric] = useState('')
  const [notes, setNotes] = useState('')
  const [price, setPrice] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (!garment.trim()) { setErr('Précise le type de vêtement.'); return }
    setLoading(true); setErr('')
    try {
      const order = await createOrder({
        client_id: clientId,
        tailleur_id: tailleurId,
        garment: garment.trim(),
        occasion: occasion.trim(),
        fabric: fabric.trim(),
        notes: notes.trim(),
        price: price ? parseFloat(price) : null,
        delivery_date: deliveryDate || null,
        livraison_requise: livraison,
adresse_livraison: livraison ? adresse.trim() : null,
      })
      onCreated(order.id)
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PatternBg className="min-h-screen">
      <div className="px-4 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})` }}>
        <button onClick={onBack}><ArrowLeft size={20} className="text-white" /></button>
        <div>
          <p className="text-white font-semibold">Nouvelle commande</p>
          <p className="text-xs" style={{ color: '#f3d9c6' }}>avec {tailleurName}</p>
        </div>
      </div>

      <div className="px-4 py-5 space-y-3">
        <form onSubmit={e => { e.preventDefault(); submit() }} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Vêtement souhaité *</label>
            <input value={garment} onChange={e => setGarment(e.target.value)}
              placeholder="Ex : Boubou brodé, Robe de soirée..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none" />
        </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Occasion</label>
            <input value={occasion} onChange={e => setOccasion(e.target.value)}
              placeholder="Ex : Mariage, Entretien, Anniversaire..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Tissu</label>
            <input value={fabric} onChange={e => setFabric(e.target.value)}
              placeholder="Ex : Bazin riche bleu, Soie or..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Notes pour le tailleur</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Détails, préférences de coupe, broderie..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none resize-none" />
          </div>

         <div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-xs font-medium text-gray-600">Budget (FCFA)</label>
    <input value={price} onChange={e => setPrice(e.target.value.replace(/\D/, ''))}
      placeholder="25000"
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none" />
  </div>
  <div>
    <label className="text-xs font-medium text-gray-600">Livraison souhaitée</label>
    <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none" />
  </div>
</div>

<div>
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" checked={livraison} onChange={e => setLivraison(e.target.checked)} />
    <span className="text-sm text-gray-700">Je souhaite être livré(e)</span>
  </label>
  {livraison && (
    <textarea value={adresse} onChange={e => setAdresse(e.target.value)}
      placeholder="Adresse de livraison (quartier, repères...)"
      rows={2}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-2 focus:outline-none resize-none" />
  )}
</div>

{err && <p className="text-xs text-red-500">{err}</p>}

          <button  type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-2xl mt-2"
            style={{ backgroundColor: C.terra }}>
            <Send size={16} /> {loading ? 'Envoi...' : 'Envoyer la demande'}
          </button>
          <p className="text-xs text-gray-400 text-center">
            Le tailleur recevra une notification et pourra confirmer le prix et les détails avec toi via le chat.
          </p>
        </form>
      </div>
    </PatternBg>
  )
}