import { supabase } from '@/lib/supabase'

interface NewOrderPayload {
  client_id: string
  tailleur_id: string
  garment: string
  occasion: string
  fabric: string
  notes: string
  price: number | null
  delivery_date: string | null
  livraison_requise: boolean
  adresse_livraison: string | null
}

export function useCreateOrder() {
  const createOrder = async (payload: NewOrderPayload) => {
    const { data, error } = await supabase
      .from('commandes')
      .insert(payload)
      .select()
      .single()

    if (error) throw error
    return data
  }

  return { createOrder }
}