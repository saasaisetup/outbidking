import { SSEEventData } from './types';

type ClientListener = (data: string) => void;

class EventBroadcaster {
  private listeners: Set<ClientListener> = new Set();

  public subscribe(listener: ClientListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(event: SSEEventData) {
    const formatted = `data: ${JSON.stringify(event)}\n\n`;
    for (const listener of this.listeners) {
      try {
        listener(formatted);
      } catch (err) {
        console.error('[EventBroadcaster] Broadcast delivery failed:', err);
        this.listeners.delete(listener);
      }
    }
  }

  public getSubscriberCount(): number {
    return this.listeners.size;
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __eventBroadcaster__: EventBroadcaster | undefined;
}

export const eventBroadcaster = global.__eventBroadcaster__ ?? (global.__eventBroadcaster__ = new EventBroadcaster());

export function broadcastEvent(event: SSEEventData) {
  eventBroadcaster.broadcast(event);
}
