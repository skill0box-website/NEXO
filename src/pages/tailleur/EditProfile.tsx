import { useState, useEffect } from 'react'
import { ArrowLeft, Save, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useUpdateTailleurProfile } from '@/hooks/useUpdateTailleurProfile'
import PatternBg from '@/components/ui/PatternBg'
import { C } from '@/constants/theme'

const SUGGESTIONS = [
  'Boubou', 'Costume', 'Robe soirée', 'Broderie', 'Wax',
  'Ensemble féminin', 'Vêtements enfants', 'Uniformes', 'Casual', 'Bazin',
]

interface Props {
  tailleurId: string
  onBack: () => void
  onSaved: () => void
}

export default function EditProfile({ tailleurId, onBack, onSaved }: Props) {
  const { updateProfile } = useUpdateTailleurProfile()
  const [bio, setBio] = useState('')
  const [city, setCity] = useState('')
  const [specialities, setSpecialities] = useState<string[]>([])
  const [customSpec, setCustomSpec] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    supabase.from('tailleur_profiles').select('bio, city, specialities')
      .eq('id', tailleurId).single()
      .then(({ data }) => {
        if (data) {
          setBio(data.bio ?? '')
          setCity(data.city ?? '')
          setSpecialities(data.specialities ?? [])
        }
        setLoading(false)
      })
  }, [tailleurId])

  const toggleSpec = (s: string) => {
    setSpecialities(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const addCustomSpec = () => {
    const v = customSpec.trim()
    if (v && !specialities.includes(v)) setSpecialities(prev => [...prev, v])
    setCustomSpec('')
  }

  const save = async () => {
    if (!city.trim()) { setErr('Indique ta ville.'); return }
    setSaving(true); setErr('')
    try {
      await updateProfile(tailleurId, { bio: bio.trim(), city: city.trim(), specialities })
      onSaved()
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="p-6 text-center text-gray-400 text-sm">Chargement...</p>

  return (
    <PatternBg className="min-h-screen">
      <div className="px-4 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})` }}>
        <button onClick={onBack}><ArrowLeft size={20} className="text-white" /></button>
        <p className="text-white font-semibold">Modifier mon profil</p>
      </div>

      <div className="px-4 py-5 space-y-4">
       <form onSubmit={e => { e.preventDefault(); save() }} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Ville *</label>
            <input value={city} onChange={e => setCity(e.target.value)}
              placeholder="Ex : Dakar, Thiès, Saint-Louis..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Présentation</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Présente ton savoir-faire, ton expérience, ce qui te distingue..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mt-1 focus:outline-none resize-none" />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">Spécialités</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => toggleSpec(s)}
                  className="text-xs px-3 py-1.5 rounded-full font-medium transition-colors"
                  style={specialities.includes(s)
                    ? { backgroundColor: C.terra, color: 'white' }
                    : { backgroundColor: '#fdebe3', color: C.terra }}>
                  {s}
                </button>
              ))}
            </div>

            {specialities.filter(s => !SUGGESTIONS.includes(s)).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {specialities.filter(s => !SUGGESTIONS.includes(s)).map(s => (
                  <span key={s} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: C.navy, color: 'white' }}>
                    {s}
                    <button onClick={() => toggleSpec(s)}><X size={12} /></button>
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input value={customSpec} onChange={e => setCustomSpec(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustomSpec()}
                placeholder="Ajouter une spécialité personnalisée..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
              <button onClick={addCustomSpec}
                className="px-3 rounded-xl text-sm font-medium"
                style={{ backgroundColor: '#e7e9f5', color: C.navy }}>
                Ajouter
              </button>
            </div>
          </div>

          {err && <p className="text-xs text-red-500">{err}</p>}

          <button type="submit" disabled={saving}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-2xl mt-2"
            style={{ backgroundColor: C.terra }}>
            <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer mon profil'}
          </button>
        </form>
      </div>
    </PatternBg>
  )
}