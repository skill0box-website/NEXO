import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Mesure, MeasureCategory } from '@/types'

export function useMeasurements(clientId: string) {
  const [mesures, setMesures] = useState<Mesure[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    const { data } = await supabase
      .from('mesures')
      .select('*')
      .eq('client_id', clientId)
    setMesures(data || [])
    setLoading(false)
  }

  useEffect(() => { if (clientId) fetch() }, [clientId])

  const save = async (category: MeasureCategory, values: Record<string, string>) => {
    const payload: any = {
      client_id: clientId,
      category,
      updated_at: new Date().toISOString(),
    }
    const map: Record<string, string> = {
      'Épaules': 'epaules', 'Poitrine': 'poitrine', 'Taille': 'taille',
      'Hanches': 'hanches', 'Longueur': 'longueur', 'Manches': 'manches',
    }
    for (const [k, v] of Object.entries(values)) {
      const col = map[k]
      if (col && v) payload[col] = parseFloat(v.replace(',', '.'))
    }

    const existing = mesures.find(m => m.category === category)
    if (existing) {
      await supabase.from('mesures').update(payload).eq('id', existing.id)
    } else {
      await supabase.from('mesures').insert(payload)
    }
    await fetch()
  }

  return { mesures, loading, save }
}