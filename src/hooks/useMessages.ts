import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Message } from '@/types';

export function useMessages(commandeId: string) {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetch = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('commande_id', commandeId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  useEffect(() => {
    if (!commandeId) return;
    fetch();

    // Temps réel — nouveaux messages arrivant instantanément
    const channel = supabase
      .channel('messages_' + commandeId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `commande_id=eq.${commandeId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [commandeId]);

  const send = async (senderId: string, text: string, imgUrl?: string) => {
    await supabase.from('messages').insert({
      commande_id: commandeId,
      sender_id: senderId,
      text,
      img_url: imgUrl || null,
    });
  };

  return { messages, send };
}
