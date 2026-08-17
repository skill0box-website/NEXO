import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export interface Paiement {
  id: string
  commande_id: string
  montant: number
  type: 'acompte' | 'solde'
  methode: string
  created_at: string
}

export function usePayments(commandeId: string) {
  const [paiements, setPaiements] = useState<Paiement[]>([])

  const fetch = async () => {
    const { data } = await supabase
      .from('paiements')
      .select('*')
      .eq('commande_id', commandeId)
      .order('created_at', { ascending: false })
    setPaiements(data || [])
  }

  useEffect(() => { if (commandeId) fetch() }, [commandeId])

  const addPayment = async (montant: number, type: 'acompte' | 'solde', methode: string) => {
    const { error } = await supabase.from('paiements').insert({ commande_id: commandeId, montant, type, methode })
    if (error) throw error
    await fetch()
  }

  return { paiements, addPayment }
}