import { supabase } from '@/lib/supabase'

interface UpdatePayload {
  bio: string
  city: string
  specialities: string[]
}

export function useUpdateTailleurProfile() {
  const updateProfile = async (tailleurId: string, payload: UpdatePayload) => {
    const { error } = await supabase
      .from('tailleur_profiles')
      .update(payload)
      .eq('id', tailleurId)
    if (error) throw error
  }

  return { updateProfile }
}