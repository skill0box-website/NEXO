import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useAdminData() {
  const [stats, setStats] = useState({ clients: 0, tailleurs: 0, commandes: 0, retards: 0 })
  const [commandes, setCommandes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [{ count: clients }, { count: tailleurs }, { data: cmds }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'tailleur'),
        supabase.from('commandes').select('*, client:profiles!commandes_client_id_fkey(prenom,nom), tailleur:tailleur_profiles(id, profile:profiles(prenom,nom))'),
      ])
      const retards = (cmds || []).filter(c => c.delay).length
      setStats({ clients: clients ?? 0, tailleurs: tailleurs ?? 0, commandes: cmds?.length ?? 0, retards })
      setCommandes(cmds || [])
      setLoading(false)
    }
    load()
  }, [])

  return { stats, commandes, loading }
}