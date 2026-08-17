import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useTailors(search = '') {
  const [tailors, setTailors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      let q = supabase
        .from('tailleur_profiles')
        .select('*, profile:profiles(prenom, nom, tel)')
        .order('rating', { ascending: false });

      if (search.trim()) {
        q = q.or(`bio.ilike.%${search}%,city.ilike.%${search}%`);
      }

      const { data } = await q;
      setTailors(data || []);
      setLoading(false);
    };
    fetch();
  }, [search]);

  return { tailors, loading };
}
