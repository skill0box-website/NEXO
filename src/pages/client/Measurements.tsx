import { useState } from 'react'
import { ArrowLeft, Save, PlayCircle, Info, CheckCircle2 } from 'lucide-react'
import PatternBg from '@/components/ui/PatternBg'
import { useMeasurements } from '@/hooks/useMeasurements'
import { C } from '@/constants/theme'

const GUIDES = {
  homme: [
    { key: 'Épaules', tip: "D'une pointe d'épaule à l'autre, dans le dos.", icon: '👤' },
    { key: 'Poitrine', tip: 'Tour de poitrine au niveau le plus large.', icon: '📏' },
    { key: 'Taille', tip: 'Autour de la taille naturelle.', icon: '📏' },
    { key: 'Longueur', tip: "De l'épaule à la longueur souhaitée.", icon: '📐' },
    { key: 'Manches', tip: "De l'épaule au poignet, bras plié.", icon: '💪' },
  ],
  femme: [
    { key: 'Épaules', tip: "D'une pointe d'épaule à l'autre.", icon: '👤' },
    { key: 'Poitrine', tip: 'Tour de poitrine, mètre horizontal.', icon: '📏' },
    { key: 'Taille', tip: 'Autour de la taille naturelle.', icon: '📏' },
    { key: 'Hanches', tip: 'Au niveau le plus large des hanches.', icon: '📏' },
    { key: 'Longueur', tip: "De l'épaule à la longueur souhaitée.", icon: '📐' },
  ],
  enfant: [
    { key: 'Poitrine', tip: 'Tour de poitrine sans serrer.', icon: '📏' },
    { key: 'Taille', tip: "Autour de la taille, l'enfant debout.", icon: '📏' },
    { key: 'Longueur', tip: "De l'épaule au genou.", icon: '📐' },
    { key: 'Épaules', tip: "D'une épaule à l'autre.", icon: '👤' },
  ],
} as const

type Cat = 'homme' | 'femme' | 'enfant'

interface Props {
  onBack: () => void
  clientId: string
}

export default function Measurements({ onBack, clientId }: Props) {
  const { save } = useMeasurements(clientId)
  const [cat, setCat] = useState<Cat>('homme')
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  const saveNow = async () => {
    await save(cat, values)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <PatternBg className="min-h-screen">
      <div className="px-4 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})` }}>
        <button onClick={onBack}><ArrowLeft size={20} className="text-white" /></button>
        <p className="text-white font-semibold">Mes mesures</p>
      </div>

      <div className="px-4 py-5 space-y-4">
        <div className="rounded-2xl p-4 flex items-start gap-2.5 border"
          style={{ backgroundColor: '#e7e9f5', borderColor: C.navyLight }}>
          <Info size={18} className="shrink-0 mt-0.5" style={{ color: C.navy }} />
          <p className="text-sm" style={{ color: C.navy }}>
            Pas besoin de te déplacer. Prends tes mesures avec un mètre ruban souple.
          </p>
        </div>

        <div className="flex gap-2">
          {(['homme', 'femme', 'enfant'] as Cat[]).map(k => (
            <button key={k} onClick={() => { setCat(k); setValues({}) }}
              className="flex-1 py-2 rounded-xl text-sm font-medium"
              style={cat === k
                ? { backgroundColor: C.terra, color: 'white' }
                : { backgroundColor: 'white', color: '#4b5563', border: '1px solid #e5e7eb' }}>
              {k === 'homme' ? '👨 Homme' : k === 'femme' ? '👩 Femme' : '👶 Enfant'}
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-4 flex items-center gap-3 border"
          style={{ backgroundColor: '#fdebe3', borderColor: '#f3d9c6' }}>
          <PlayCircle size={20} style={{ color: C.terra }} />
          <p className="text-xs" style={{ color: C.terraDark }}>
            Reste debout, posture naturelle. À deux c'est plus précis.
          </p>
        </div>

        <div className="space-y-3">
          {GUIDES[cat].map(g => (
            <div key={g.key} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{g.icon}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{g.key}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{g.tip}</p>
                  <div className="flex items-center gap-2 mt-2.5">
                    <input
                      value={values[g.key] || ''}
                      onChange={e => setValues(v => ({ ...v, [g.key]: e.target.value.replace(/[^0-9.,]/g, '') }))}
                      placeholder="0"
                      className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center focus:outline-none"
                    />
                    <span className="text-xs text-gray-400">cm</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {saved ? (
          <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 rounded-2xl py-3.5 text-sm font-medium">
            <CheckCircle2 size={18} /> Mesures enregistrées !
          </div>
        ) : (
          <button onClick={saveNow}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-2xl"
            style={{ backgroundColor: C.terra }}>
            <Save size={16} /> Enregistrer mes mesures
          </button>
        )}
      </div>
    </PatternBg>
  )
}