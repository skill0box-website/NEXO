import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Scissors, ChevronRight, ArrowLeft, Phone, Upload } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useUpload } from '@/hooks/useUpload'
import PatternBg from '@/components/ui/PatternBg'
import { C } from '@/constants/theme'

type Role = 'client' | 'tailleur'

export default function Auth() {
  const navigate = useNavigate()
  const { signUp, signIn } = useAuth()
  const { uploadFile } = useUpload()

  const [mode, setMode] = useState<'choose' | 'signup' | 'signin'>('choose')
  const [role, setRole] = useState<Role | null>(null)
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    email: '', password: '',
    prenom: '', nom: '', tel: '',
    exp: '',
  })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!form.email || !form.password || !form.prenom || !form.nom || !form.tel) {
      setErr('Remplis tous les champs.'); return
    }
    if (!role) return
    setLoading(true); setErr('')
    try {
      let diplomaUrl: string | undefined
      if (role === 'tailleur' && diplomaFile) {
        diplomaUrl = (await uploadFile(diplomaFile, 'diplomas')) ?? undefined
      }

      await signUp(
        form.email, form.password,
        { role, prenom: form.prenom, nom: form.nom, tel: form.tel },
        role === 'tailleur' ? { experience: form.exp, diploma_url: diplomaUrl } : undefined
      )
      navigate('/app')
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    if (!form.email || !form.password) {
      setErr('Email et mot de passe requis.'); return
    }
    setLoading(true); setErr('')
    try {
      await signIn(form.email, form.password)
      navigate('/app')
    } catch (e: any) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Choix du rôle
  if (mode === 'choose') return (
    <PatternBg className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">✂️</div>
        <h1 className="text-2xl font-bold text-gray-800">Bienvenue !</h1>
        <p className="text-gray-500 text-sm mt-1">Tu es :</p>
      </div>
      <div className="w-full max-w-xs space-y-4">
        <button onClick={() => { setRole('client'); setMode('signup') }}
          className="w-full flex items-center gap-4 bg-white border-2 rounded-2xl p-5 shadow-sm"
          style={{ borderColor: '#fde6d8' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#fdebe3' }}>
            <Users size={24} style={{ color: C.terra }} />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800">Client</p>
            <p className="text-xs text-gray-500">Je veux faire coudre mes habits</p>
          </div>
          <ChevronRight size={18} className="text-gray-400 ml-auto" />
        </button>

        <button onClick={() => { setRole('tailleur'); setMode('signup') }}
          className="w-full flex items-center gap-4 bg-white border-2 rounded-2xl p-5 shadow-sm"
          style={{ borderColor: '#dde1f0' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#e7e9f5' }}>
            <Scissors size={24} style={{ color: C.navy }} />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800">Tailleur</p>
            <p className="text-xs text-gray-500">Je gère mes commandes clients</p>
          </div>
          <ChevronRight size={18} className="text-gray-400 ml-auto" />
        </button>

        <button onClick={() => setMode('signin')}
          className="w-full text-center text-sm py-2"
          style={{ color: C.terra }}>
          J'ai déjà un compte → Se connecter
        </button>
      </div>
    </PatternBg>
  )

  // Connexion
  if (mode === 'signin') return (
    <PatternBg className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <button onClick={() => setMode('choose')}
          className="flex items-center gap-1 text-sm mb-4" style={{ color: C.terra }}>
          <ArrowLeft size={16} /> Retour
        </button>
        <h2 className="text-lg font-bold text-gray-800 mb-4">Se connecter</h2>
              <form onSubmit={e => { e.preventDefault(); handleSignIn() }} className="space-y-3">
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          placeholder="Email" type="email"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
        <input value={form.password} onChange={e => setForm({...form, password: e.target.value})}
          placeholder="Mot de passe" type="password"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
        {err && <p className="text-xs text-red-500">{err}</p>}
        <button type="submit" disabled={loading}
          className="w-full text-white font-semibold py-3.5 rounded-xl text-sm"
          style={{ backgroundColor: C.navy }}>
          {loading ? 'Connexion...' : 'Se connecter →'}
        </button>
      </form>
      </div>
    </PatternBg>
  )

  // Inscription
  return (
    <PatternBg className="min-h-screen flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <button onClick={() => setMode('choose')}
          className="flex items-center gap-1 text-sm mb-4" style={{ color: C.terra }}>
          <ArrowLeft size={16} /> Retour
        </button>
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {role === 'client' ? 'Créer ton compte client' : 'Créer ton profil tailleur'}
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          {role === 'tailleur'
            ? 'Prouve ton expertise pour être listé sur la plateforme.'
            : "C'est rapide et gratuit."}
        </p>
        <form onSubmit={e => { e.preventDefault(); handleSignUp() }} className="space-y-3">
          <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})}
            placeholder="Prénom"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
          <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})}
            placeholder="Nom"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
          <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 gap-2">
            <Phone size={16} className="text-gray-400" />
            <input value={form.tel} onChange={e => setForm({...form, tel: e.target.value.replace(/\D/, '')})}
              placeholder="Numéro de téléphone" maxLength={9}
              className="flex-1 text-sm focus:outline-none" />
          </div>
          <input value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            placeholder="Email" type="email"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />
          <input value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            placeholder="Mot de passe (min. 6 caractères)" type="password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />

          {role === 'tailleur' && (
            <div className="space-y-3 border-t pt-3" style={{ borderColor: '#e7e9f5' }}>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Preuve d'expertise
              </p>
              <input value={form.exp} onChange={e => setForm({...form, exp: e.target.value})}
                placeholder="Années d'expérience (ex: 8 ans)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none" />

              <label className="flex items-center gap-3 cursor-pointer rounded-xl px-4 py-3 border border-dashed"
                style={{ backgroundColor: '#e7e9f5', borderColor: C.navyLight }}>
                <Upload size={18} style={{ color: C.navy }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: C.navy }}>Diplôme ou attestation</p>
                  <p className="text-xs text-gray-500">
                    {diplomaFile ? diplomaFile.name : 'Choisir un fichier (photo ou PDF)'}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={e => setDiplomaFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {err && <p className="text-xs text-red-500">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full text-white font-semibold py-3.5 rounded-xl text-sm"
            style={{ backgroundColor: role === 'tailleur' ? C.navy : C.terra }}>
            {loading ? 'Création...' : 'Créer mon compte →'}
          </button>
       </form>
      </div>
    </PatternBg>
  )
}