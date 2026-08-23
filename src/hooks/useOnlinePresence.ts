'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useOnlinePresence() {
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // Generate a unique client session key
    const clientKey = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `client_${Math.random().toString(36).substring(2, 11)}`;

    const channel = supabase.channel('site-presence', {
      config: {
        presence: {
          key: clientKey,
        },
      },
    });

    const updatePresenceState = () => {
      const state = channel.presenceState();
      const count = Object.keys(state).length;
      // Provide authentic count (minimum 1 for current active client)
      setOnlineCount(Math.max(count, 1));
    };

    channel
      .on('presence', { event: 'sync' }, () => {
        updatePresenceState();
      })
      .on('presence', { event: 'join' }, () => {
        updatePresenceState();
      })
      .on('presence', { event: 'leave' }, () => {
        updatePresenceState();
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          await channel.track({
            online_at: new Date().toISOString(),
          });
        } else {
          setIsConnected(false);
        }
      });

    return () => {
      channel.untrack().catch(() => {});
      supabase.removeChannel(channel);
    };
  }, []);

  return { onlineCount, isConnected };
}
