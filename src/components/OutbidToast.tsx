'use client';

import React from 'react';
import { Crown, Sparkles, X, ArrowUpRight, Zap } from 'lucide-react';
import { SSEEventData, Project } from '@/lib/types';

interface OutbidToastProps {
  event: SSEEventData | null;
  onClose: () => void;
  onOutbid: (project: Project, minAmount: number) => void;
}

export function OutbidToast({ event, onClose, onOutbid }: OutbidToastProps) {
  if (!event || !event.data || !event.data.message) return null;

  const isKing = event.type === 'NEW_KING';
  const project = event.data.project;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-bounce-in">
      <div
        className={`relative overflow-hidden rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
          isKing
            ? 'bg-gradient-to-r from-amber-950 via-zinc-950 to-zinc-950 border-amber-400 shadow-amber-500/30'
            : 'bg-zinc-950/95 border-zinc-800 shadow-black/80'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg text-zinc-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isKing ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-amber-400 border border-zinc-800'
            }`}
          >
            {isKing ? <Crown className="w-5 h-5 fill-current" /> : <Sparkles className="w-5 h-5" />}
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
              {isKing ? '👑 NEW KING OF THE HILL' : '⚡ LIVE BID PLACED'}
            </div>
            <p className="mt-0.5 text-xs text-zinc-200 font-medium line-clamp-2">
              {event.data.message}
            </p>

            {project && (
              <div className="mt-2.5 flex items-center gap-2">
                <button
                  onClick={() => onOutbid(project, project.totalBid + 5)}
                  className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[11px] flex items-center gap-1 active:scale-95 transition-all"
                >
                  <Zap className="w-3 h-3 fill-current" />
                  <span>Outbid (+ $5)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
