import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useReviews(tailleurId: string) {
  const [avis, setAvis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tailleurId) return
    supabase
      .from('avis')
      .select('*, client:profiles(prenom, nom)')
      .eq('tailleur_id', tailleurId)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setAvis(data || []); setLoading(false) })
  }, [tailleurId])

  const compliments = avis.filter(a => a.compliment).map(a => a.compliment)
  const critiques   = avis.filter(a => a.critique).map(a => a.critique)

  return { avis, compliments, critiques, loading }
}