import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function useMyReviewedOrders(clientId: string) {
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!clientId) return
    supabase
      .from('avis')
      .select('commande_id')
      .eq('client_id', clientId)
      .then(({ data }) => setReviewedIds(new Set((data || []).map(d => d.commande_id))))
  }, [clientId])

  return reviewedIds
}