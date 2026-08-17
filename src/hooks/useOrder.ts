import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Commande } from '@/types'

// ── Côté CLIENT ──────────────────────────────────────
export function useClientOrders(clientId: string) {
  const [orders, setOrders] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    const { data } = await supabase
      .from('commandes')
      .select(`*, tailleur:tailleur_profiles(*, profile:profiles(prenom, nom))`)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!clientId) return
    fetch()

    const channel = supabase
      .channel('client_orders_' + clientId)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'commandes',
        filter: `client_id=eq.${clientId}`,
      }, fetch)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [clientId])

  return { orders, loading, refetch: fetch }
}

// ── Côté TAILLEUR ────────────────────────────────────
export function useTailleurOrders(tailleurId: string) {
  const [orders, setOrders] = useState<Commande[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    const { data } = await supabase
      .from('commandes')
      .select(`*, client:profiles(prenom, nom, tel)`)
      .eq('tailleur_id', tailleurId)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    if (!tailleurId) return
    fetch()

    const channel = supabase
      .channel('tailleur_orders_' + tailleurId)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'commandes',
        filter: `tailleur_id=eq.${tailleurId}`,
      }, fetch)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [tailleurId])

  const advanceStep = async (orderId: string, currentStep: number) => {
    console.log('advanceStep appelé pour', orderId, 'étape actuelle', currentStep)
    if (currentStep >= 5) return
    const { data, error } = await supabase
      .from('commandes')
      .update({ step: currentStep + 1 })
      .eq('id', orderId)
      .select()
    if (error) console.error('Erreur advanceStep:', error.message)
    else if (!data || data.length === 0) console.warn('⚠️ 0 ligne modifiée — probable blocage RLS')
    else console.log('✅ Mise à jour réussie:', data)
    await fetch()
  }

  const toggleLock = async (orderId: string, currentlyLocked: boolean) => {
    console.log('toggleLock appelé pour', orderId, 'actuellement verrouillé:', currentlyLocked)
    const { data, error } = await supabase
      .from('commandes')
      .update({ locked: !currentlyLocked })
      .eq('id', orderId)
      .select()
    if (error) console.error('Erreur toggleLock:', error.message)
    else if (!data || data.length === 0) console.warn('⚠️ 0 ligne modifiée — probable blocage RLS')
    else console.log('✅ Mise à jour réussie:', data)
    await fetch()
  }

  return { orders, loading, advanceStep, toggleLock, refetch: fetch }
}