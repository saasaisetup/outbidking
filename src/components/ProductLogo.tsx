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

  // 1. If explicit logoUrl is provided, prioritize rendering with no-referrer
  if (logoUrl && !imgError) {
    return (
      <div className={`${sizeClasses[size]} bg-white dark:bg-[#181613] border border-zinc-200 dark:border-zinc-800 flex items-center justify-center p-1 flex-shrink-0 overflow-hidden shadow-2xs ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt={title || domain}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[14px] sm:rounded-[18px]"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // 2. Official Authentic Instagram Icon Fallback
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

  // 3. Official 𝕏 / Twitter Icon Fallback (only if no logoUrl or logoUrl failed)
  if (domain.includes('x.com') || domain.includes('twitter.com') || fullUrl.startsWith('@')) {
    return (
      <div className={`${sizeClasses[size]} bg-black dark:bg-[#181613] border border-zinc-800 flex items-center justify-center p-2.5 sm:p-3 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
    );
  }

  // 4. Official GitHub Icon
  if (domain.includes('github.com')) {
    return (
      <div className={`${sizeClasses[size]} bg-[#24292e] text-white flex items-center justify-center p-2.5 flex-shrink-0 shadow-xs ${className}`}>
        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      </div>
    );
  }

  // 5. Generic Dynamic Favicon
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
          referrerPolicy="no-referrer"
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
