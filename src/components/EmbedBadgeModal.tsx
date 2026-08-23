'use client';

import React, { useState } from 'react';
import { X, Code, Copy, Check, ExternalLink } from 'lucide-react';
import { Project } from '@/lib/types';

interface EmbedBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export function EmbedBadgeModal({ isOpen, onClose, project }: EmbedBadgeModalProps) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  if (!isOpen || !project) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://outbidking.lol';
  const badgeUrl = `${currentOrigin}/api/badge/${project.id}`;
  const targetUrl = `${currentOrigin}/r/${project.id}`;

  const markdownSnippet = `[![Rank on Outbid.lol](${badgeUrl})](${targetUrl})`;
  const htmlSnippet = `<a href="${targetUrl}" target="_blank"><img src="${badgeUrl}" alt="Ranked #${project.rank} on Outbid.lol" /></a>`;

  const copyToClipboard = (text: string, type: 'md' | 'html') => {
    navigator.clipboard.writeText(text);
    if (type === 'md') {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    } else {
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Embed Live Rank Badge</h2>
            <p className="text-xs text-zinc-400">
              Add your live, automatically updating rank badge to your README or website.
            </p>
          </div>
        </div>

        {/* Live SVG Badge Preview */}
        <div className="mt-5 rounded-2xl bg-zinc-900 border border-zinc-800 p-5 flex flex-col items-center justify-center gap-3">
          <span className="text-xs text-zinc-400 font-medium">Live Badge Preview:</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={badgeUrl} alt={`Rank #${project.rank}`} className="h-8 shadow-md" />
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {/* Markdown Code */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              <span>Markdown (for GitHub README)</span>
              <button
                type="button"
                onClick={() => copyToClipboard(markdownSnippet, 'md')}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 normal-case"
              >
                {copiedMd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMd ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 overflow-x-auto font-mono">
              {markdownSnippet}
            </pre>
          </div>

          {/* HTML Code */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
              <span>HTML (for Website / Landing Page)</span>
              <button
                type="button"
                onClick={() => copyToClipboard(htmlSnippet, 'html')}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 normal-case"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHtml ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 overflow-x-auto font-mono">
              {htmlSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
