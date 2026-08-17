import { useState } from 'react'
import { ArrowLeft, Star, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import PatternBg from '@/components/ui/PatternBg'
import { C } from '@/constants/theme'
import type { Commande } from '@/types'

interface Props {
  order: Commande
  clientId: string
  onBack: () => void
  onSubmitted: () => void
}

export default function ReviewForm({ order, clientId, onBack, onSubmitted }: Props) {
  const [note, setNote] = useState(0)
  const [compliment, setCompliment] = useState('')
  const [critique, setCritique] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const submit = async () => {
    if (note === 0) { setErr('Choisis une note avant d\'envoyer.'); return }
    setLoading(true); setErr('')
    const { error } = await supabase.from('avis').insert({
      commande_id: order.id,
      client_id: clientId,
      tailleur_id: order.tailleur_id,
      note,
      compliment: compliment.trim() || null,
      critique: critique.trim() || null,
    })
    setLoading(false)
    if (error) { setErr(error.message); return }
    onSubmitted()
  }

  return (
    <PatternBg className="min-h-screen">
      <div className="px-4 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})` }}>
        <button onClick={onBack}><ArrowLeft size={20} className="text-white" /></button>
        <p className="text-white font-semibold">Laisser un avis</p>
      </div>

      <div className="px-4 py-5 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-800">{order.garment}</p>
          <p className="text-xs text-gray-500 mt-0.5">Comment s'est passée cette commande ?</p>

          <div className="flex justify-center gap-2 my-5">
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} onClick={() => setNote(i)}>
                <Star size={32}
                  fill={i <= note ? C.terra : 'none'}
                  stroke={i <= note ? C.terra : '#d1d5db'} />
              </button>
            ))}
          </div>

          <textarea
            value={compliment}
            onChange={e => setCompliment(e.target.value)}
            placeholder="Qu'est-ce qui t'a plu ? (optionnel)"
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none"
          />
          <textarea
            value={critique}
            onChange={e => setCritique(e.target.value)}
            placeholder="Un point à améliorer ? (optionnel)"
            rows={3}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none resize-none mt-2"
          />

          {err && <p className="text-xs text-red-500 mt-2">{err}</p>}

          <button onClick={submit} disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-2xl"
            style={{ backgroundColor: C.terra }}>
            <CheckCircle2 size={16} /> {loading ? 'Envoi...' : 'Envoyer mon avis'}
          </button>
        </div>
      </div>
    </PatternBg>
  )
}