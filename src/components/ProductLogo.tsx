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
  const rawUrl = (url || normalizedUrl || '').trim().toLowerCase();
  const domain = rawUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('?')[0];

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-13 h-13 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[22px] text-base sm:text-lg',
    xl: 'w-14 h-14 sm:w-18 sm:h-18 rounded-[20px] sm:rounded-[24px] text-lg sm:text-xl',
  };

  // Resolve best logo source
  let resolvedSrc: string | null = null;

  if (logoUrl && !imgError) {
    resolvedSrc = logoUrl;
  } else if (rawUrl.startsWith('@') || rawUrl.includes('x.com/') || rawUrl.includes('twitter.com/')) {
    const handle = rawUrl
      .replace(/^@/, '')
      .replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '')
      .split('/')[0]
      .split('?')[0];
    if (handle && handle !== 'x.com' && handle !== 'twitter.com') {
      resolvedSrc = `https://unavatar.io/x/${handle}`;
    }
  } else if (rawUrl.includes('github.com/')) {
    const handle = rawUrl.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').split('/')[0];
    if (handle) resolvedSrc = `https://github.com/${handle}.png?size=200`;
  } else if (rawUrl.includes('instagram.com/')) {
    const handle = rawUrl.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').split('/')[0];
    if (handle) resolvedSrc = `https://unavatar.io/instagram/${handle}`;
  } else if (domain.includes('.')) {
    resolvedSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

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

  if (resolvedSrc) {
    return (
      <div className={`${sizeClasses[size]} bg-white dark:bg-[#181613] border border-zinc-200/90 dark:border-zinc-800 flex items-center justify-center p-1 flex-shrink-0 overflow-hidden shadow-2xs ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedSrc}
          alt={title || domain}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-[14px] sm:rounded-[18px]"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback if no image can be resolved
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br ${getGradient(domain || 'app')} text-white flex items-center justify-center font-black uppercase shadow-inner ${className}`}>
      {initial}
    </div>
  );
}
