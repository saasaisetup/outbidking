import { supabase } from './supabase';

export interface PresenceState {
  onlineCount: number;
  userId: string;
}

export function subscribeToLivePresence(
  onPresenceUpdate: (count: number) => void
): () => void {
  const userId = `usr_${Math.random().toString(36).substring(2, 9)}`;
  const channel = supabase.channel('online-visitors-presence', {
    config: {
      presence: {
        key: userId,
      },
    },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const presenceState = channel.presenceState();
      const count = Object.keys(presenceState).length;
      onPresenceUpdate(Math.max(count, 1));
    })
    .on('presence', { event: 'join' }, () => {
      const presenceState = channel.presenceState();
      const count = Object.keys(presenceState).length;
      onPresenceUpdate(Math.max(count, 1));
    })
    .on('presence', { event: 'leave' }, () => {
      const presenceState = channel.presenceState();
      const count = Object.keys(presenceState).length;
      onPresenceUpdate(Math.max(count, 1));
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
