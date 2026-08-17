import { useState } from 'react'
import {
  ArrowLeft,
  Award,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Edit3,
} from 'lucide-react'
import PatternBg from '@/components/ui/PatternBg'
import { C } from '@/constants/theme'
import type { Profile } from '@/types'
import { useReviews } from '@/hooks/useReviews'
import EditProfile from '@/pages/tailleur/EditProfile'

interface Props {
  profile: Profile
  onBack: () => void
}

export default function MyProfile({ profile, onBack }: Props) {
  const [editing, setEditing] = useState(false)
  const { compliments, critiques, loading } = useReviews(profile.id)

  if (editing) {
    return (
      <EditProfile
        tailleurId={profile.id}
        onBack={() => setEditing(false)}
        onSaved={() => setEditing(false)}
      />
    )
  }

  if (loading) return (
    <p className="p-6 text-center text-gray-400 text-sm">Chargement...</p>
  )

  const EditButton = () => (
    <button onClick={() => setEditing(true)}
      className="w-full flex items-center justify-center gap-2 border rounded-xl py-2.5 text-sm font-medium bg-white"
      style={{ borderColor: C.terra, color: C.terra }}>
      <Edit3 size={14} /> Modifier mon profil
    </button>
  )

  if (compliments.length === 0 && critiques.length === 0) {
    return (
      <PatternBg className="min-h-screen">
        <div className="px-4 py-4 flex items-center gap-3"
          style={{ background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})` }}>
          <button onClick={onBack}><ArrowLeft size={20} className="text-white" /></button>
          <p className="text-white font-semibold">Mon profil</p>
        </div>
        <div className="px-4 py-5 space-y-4">
          <EditButton />
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
            <p className="text-gray-500 text-sm">
              Pas encore d'avis clients. Ils apparaîtront ici après tes premières commandes livrées.
            </p>
          </div>
        </div>
      </PatternBg>
    )
  }

  return (
    <PatternBg className="min-h-screen">
      <div className="px-4 py-4 flex items-center gap-3"
        style={{ background: `linear-gradient(120deg, ${C.navy}, ${C.terraDark})` }}>
        <button onClick={onBack}><ArrowLeft size={20} className="text-white" /></button>
        <p className="text-white font-semibold">Mon profil</p>
      </div>

      <div className="px-4 py-5 space-y-4">
        <EditButton />

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Award size={18} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">Ce que tes clients apprécient</h3>
          </div>
          <div className="space-y-2.5">
            {compliments.map((c, i) => (
              <div key={i} className="flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2.5">
                <ThumbsUp size={14} className="text-green-600 shrink-0" />
                <span className="text-sm text-gray-700">{c}</span>
              </div>
            ))}
            {compliments.length === 0 && (
              <p className="text-xs text-gray-400">Aucun compliment pour l'instant.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={18} style={{ color: C.terra }} />
            <h3 className="font-semibold text-gray-800">Points à améliorer</h3>
          </div>
          <div className="space-y-2.5">
            {critiques.map((c, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                style={{ backgroundColor: '#fdebe3' }}>
                <ThumbsDown size={14} style={{ color: C.terraDark }} className="shrink-0" />
                <span className="text-sm text-gray-700">{c}</span>
              </div>
            ))}
            {critiques.length === 0 && (
              <p className="text-xs text-gray-400">Aucun point à améliorer signalé.</p>
            )}
          </div>
        </div>
      </div>
    </PatternBg>
  )
}