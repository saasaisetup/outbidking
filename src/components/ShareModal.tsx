'use client';

import React, { useState } from 'react';
import { X, Share2, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';
import { Project } from '@/lib/types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function ShareModal({ isOpen, onClose, project }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://outbidking.lol';
  const shareUrl = `${currentOrigin}/r/${project.id}`;

  const tweetText = project.rank === 1
    ? `👑 We just took #1 on @outbid_lol with a $${project.totalBid.toLocaleString()} bid!\n\nCan anyone outbid ${project.title}? 🔥\n\n${shareUrl}`
    : `🚀 Ranked #${project.rank} on @outbid_lol ($${project.totalBid.toLocaleString()} bid)!\n\nCheck out ${project.title}: ${shareUrl}`;

  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tweetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Share & Flex Rank</h2>
            <p className="text-xs text-zinc-400">Post your live ranking on X (Twitter)</p>
          </div>
        </div>

        {/* Preview Card */}
        <div className="mt-5 rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-semibold">Tweet Preview:</span>
            <span className="font-mono text-amber-400 font-bold">Rank #{project.rank}</span>
          </div>
          <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed font-sans">
            {tweetText}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col gap-2.5">
          <a
            href={twitterIntentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Post to X (Twitter)</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Tweet Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
