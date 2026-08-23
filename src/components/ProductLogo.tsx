'use client';

import React, { useState } from 'react';

interface ProductLogoProps {
  url: string;
  normalizedUrl: string;
  title: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ProductLogo({
  url,
  normalizedUrl,
  title,
  logoUrl,
  size = 'lg',
  className = '',
}: ProductLogoProps) {
  const [imgError, setImgError] = useState(false);
  const domain = (normalizedUrl || url || '').toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const fullUrl = (url || normalizedUrl || '').toLowerCase();

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-13 h-13 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[22px] text-base sm:text-lg',
    xl: 'w-14 h-14 sm:w-18 sm:h-18 rounded-[20px] sm:rounded-[24px] text-lg sm:text-xl',
  };

  // 1. Official Authentic Instagram Icon
  if (domain.includes('instagram.com') || fullUrl.includes('instagram.com/')) {
    return (
      <div className={`${sizeClasses[size]} overflow-hidden flex items-center justify-center p-0 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
          <defs>
            <radialGradient id="ig-grad-exact-logo" cx="25%" cy="110%" r="130%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="10%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="65%" stopColor="#d6249f" />
              <stop offset="95%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#ig-grad-exact-logo)" />
          <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="#ffffff" strokeWidth="1.8" fill="none" />
          <circle cx="12" cy="12" r="3.8" stroke="#ffffff" strokeWidth="1.8" fill="none" />
          <circle cx="16.5" cy="7.5" r="1.1" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // 2. Official 𝕏 / Twitter Icon
  if (domain.includes('x.com') || domain.includes('twitter.com') || fullUrl.startsWith('@')) {
    return (
      <div className={`${sizeClasses[size]} bg-black dark:bg-[#181613] border border-zinc-800 flex items-center justify-center p-2.5 sm:p-3 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    );
  }

  // 3. Official Midjourney Yacht / Sailboat SVG
  if (domain.includes('midjourney.com')) {
    return (
      <div className={`${sizeClasses[size]} bg-black flex items-center justify-center p-2.5 sm:p-3 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full fill-white" fillRule="evenodd" clipRule="evenodd">
          <path d="M50 8C26.8 8 8 26.8 8 50s18.8 42 42 42 42-18.8 42-42S73.2 8 50 8zm-4.5 24.3l19.8 19.8-19.8 19.8V32.3zm-7.6 5.8v28L23.7 52l14.2-13.9zM50 77.2L34.1 61.3h31.8L50 77.2zM50 22.8l15.9 15.9H34.1L50 22.8z" />
        </svg>
      </div>
    );
  }

  // 4. ElevenLabs Audio Waveform SVG
  if (domain.includes('elevenlabs.io')) {
    return (
      <div className={`${sizeClasses[size]} bg-black text-white flex items-center justify-center p-3 flex-shrink-0 shadow-xs ${className}`}>
        <div className="flex items-center gap-1.5 h-full">
          <div className="w-1.5 h-3/4 rounded-full bg-white animate-pulse" />
          <div className="w-1.5 h-full rounded-full bg-white" />
          <div className="w-1.5 h-1/2 rounded-full bg-white" />
          <div className="w-1.5 h-5/6 rounded-full bg-white" />
        </div>
      </div>
    );
  }

  // 5. Official GitHub Icon
  if (domain.includes('github.com')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#24292e] text-white flex items-center justify-center p-2.5 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      </div>
    );
  }

  // 6. Official LinkedIn Icon
  if (domain.includes('linkedin.com')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#0a66c2] text-white flex items-center justify-center p-2.5 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
      </div>
    );
  }

  // 7. Official YouTube Icon
  if (domain.includes('youtube.com')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#ff0000] text-white flex items-center justify-center p-2.5 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      </div>
    );
  }

  // 8. Known Top AI & Dev Products
  if (domain.includes('see.io')) {
    return (
      <div className={`${sizeClasses[size]} bg-black flex items-center justify-center p-2.5 flex-shrink-0 shadow-xs ${className}`}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-white shadow-xs" />
          <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-[#3b82f6] shadow-xs" />
        </div>
      </div>
    );
  }

  if (domain.includes('joni.ai')) {
    return (
      <div className={`${sizeClasses[size]} bg-black flex items-center justify-center p-2 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-none stroke-current stroke-2">
          <circle cx="12" cy="8" r="4" />
          <path d="M7 14c0 3 1.5 6 3 6s1-2 2-2 1 2 2 2 3-3 3-6" />
          <circle cx="10" cy="8" r="0.8" fill="currentColor" />
          <circle cx="14" cy="8" r="0.8" fill="currentColor" />
        </svg>
      </div>
    );
  }

  if (domain.includes('requesty.ai')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#2563eb] text-white flex items-center justify-center p-2 flex-shrink-0 shadow-xs ${className}`}>
        <div className="font-mono font-black text-sm sm:text-base tracking-tighter">
          {'>_'}
        </div>
      </div>
    );
  }

  if (domain.includes('outrank.so')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#8b5cf6] text-white flex items-center justify-center p-2.5 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M12 2L2 19.5h8.5L12 14l1.5 5.5H22L12 2z" />
        </svg>
      </div>
    );
  }

  if (domain.includes('orynth.dev')) {
    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-tr from-[#f59e0b] via-[#ec4899] to-[#8b5cf6] flex items-center justify-center p-1.5 flex-shrink-0 shadow-xs ${className}`}>
        <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center font-black text-white">
          ⚡
        </div>
      </div>
    );
  }

  if (domain.includes('crowdreply.io')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#18181b] flex flex-col items-center justify-center gap-1.5 p-2.5 flex-shrink-0 shadow-xs ${className}`}>
        <div className="w-full h-1 sm:h-1.5 rounded-full bg-[#38bdf8]" />
        <div className="w-3/4 h-1 sm:h-1.5 rounded-full bg-[#f97316]" />
        <div className="w-1/2 h-1 sm:h-1.5 rounded-full bg-[#ef4444]" />
      </div>
    );
  }

  if (domain.includes('clay.com')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#111827] text-white flex items-center justify-center p-2 flex-shrink-0 shadow-xs ${className}`}>
        <span className="font-extrabold text-sm sm:text-base tracking-tight text-amber-400">Clay</span>
      </div>
    );
  }

  if (domain.includes('instantly.ai')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#2563eb] text-white flex items-center justify-center p-2.5 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      </div>
    );
  }

  if (domain.includes('deepseek.com')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#0284c7] text-white flex items-center justify-center p-2 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2zm0 8h2v2h-2z" />
        </svg>
      </div>
    );
  }

  if (domain.includes('shipxcode.dev')) {
    return (
      <div className={`${sizeClasses[size]} bg-black text-[#52d489] flex items-center justify-center p-2 flex-shrink-0 shadow-xs border border-[#52d489]/30 ${className}`}>
        <span className="font-mono font-black text-xs sm:text-sm">ship_</span>
      </div>
    );
  }

  // 9. Generic Dynamic Icon with crisp favicon and themed fallback
  const src = logoUrl || `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  const getGradient = (str: string) => {
    const hash = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const gradients = [
      'from-rose-500 to-amber-500',
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-cyan-500 to-blue-600',
      'from-amber-500 to-red-600',
    ];
    return gradients[hash % gradients.length];
  };

  const initial = (title || domain || 'P').charAt(0).toUpperCase();

  return (
    <div className={`${sizeClasses[size]} bg-white dark:bg-[#201d19] border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden shadow-2xs ${className}`}>
      {!imgError ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={title || domain}
          className="w-full h-full object-contain rounded-lg"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`w-full h-full rounded-lg bg-gradient-to-br ${getGradient(domain)} text-white flex items-center justify-center font-black uppercase shadow-inner`}>
          {initial}
        </div>
      )}
    </div>
  );
}
