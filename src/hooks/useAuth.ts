import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string, attempt = 1) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (!data && !error && attempt < 4) {
      setTimeout(() => fetchProfile(userId, attempt + 1), 500)
      return
    }

    setProfile(data)
    setLoading(false)
  }

  const signUp = async (
    email: string,
    password: string,
    profileData: Omit<Profile, 'id' | 'created_at'>,
    tailleurExtra?: { experience: string; diploma_url?: string }
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (!data.user) throw new Error("Erreur : aucun utilisateur créé.")

    if (!data.session) {
      throw new Error(
        "Confirmation email requise — vérifie que 'Confirm email' est désactivé dans Supabase."
      )
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: data.user.id, ...profileData })
    if (profileError) throw profileError

    if (profileData.role === 'tailleur') {
      const { error: tailleurError } = await supabase
        .from('tailleur_profiles')
        .insert({
          id: data.user.id,
          experience: tailleurExtra?.experience ?? '',
          diploma_url: tailleurExtra?.diploma_url ?? null,
          specialities: [],
          bio: '',
          city: '',
          certified: false,
        })
      if (tailleurError) throw tailleurError
    }

    return data
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, profile, loading, signUp, signIn, signOut }
}