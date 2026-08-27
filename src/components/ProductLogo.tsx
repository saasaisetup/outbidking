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

  const isLinkedIn = rawUrl.includes('linkedin.com');
  const isInstagram = rawUrl.includes('instagram.com');
  const isTwitter = rawUrl.startsWith('@') || rawUrl.includes('x.com') || rawUrl.includes('twitter.com');
  const isGithub = rawUrl.includes('github.com');
  const isYoutube = rawUrl.includes('youtube.com') || rawUrl.includes('youtu.be');

  // 1. LinkedIn Brand Logo (Official Blue #0A66C2 + White 'in')
  if (isLinkedIn && (!logoUrl || imgError || logoUrl.includes('unavatar.io/linkedin') || logoUrl.includes('linkedin.com/'))) {
    return (
      <div
        className={`${sizeClasses[size]} bg-[#0A66C2] text-white flex items-center justify-center font-sans font-black flex-shrink-0 shadow-xs border border-[#0A66C2]/30 select-none ${className}`}
        title="LinkedIn Profile"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </div>
    );
  }

  // 2. Instagram Brand Logo (Official Sunset Gradient + Camera Glyph)
  if (isInstagram && (!logoUrl || imgError || logoUrl.includes('unavatar.io/instagram'))) {
    return (
      <div
        className={`${sizeClasses[size]} bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center flex-shrink-0 shadow-xs select-none ${className}`}
        title="Instagram Profile"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3/5 h-3/5">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      </div>
    );
  }

  // Resolve best image URL source
  let resolvedSrc: string | null = null;

  if (logoUrl && !imgError && !logoUrl.includes('unavatar.io/linkedin')) {
    resolvedSrc = logoUrl;
  } else if (isTwitter) {
    const handle = rawUrl
      .replace(/^@/, '')
      .replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '')
      .split('/')[0]
      .split('?')[0];
    if (handle && handle !== 'x.com' && handle !== 'twitter.com') {
      resolvedSrc = `https://unavatar.io/x/${handle}`;
    }
  } else if (isGithub) {
    const handle = rawUrl.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').split('/')[0];
    if (handle) resolvedSrc = `https://github.com/${handle}.png?size=200`;
  } else if (isYoutube) {
    resolvedSrc = `https://www.google.com/s2/favicons?domain=youtube.com&sz=128`;
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

  if (resolvedSrc && !imgError) {
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

  // Fallback if no image can be resolved or if image errored
  if (isTwitter) {
    return (
      <div className={`${sizeClasses[size]} bg-black text-white flex items-center justify-center font-black select-none ${className}`}>
        <span className="text-sm sm:text-base">𝕏</span>
      </div>
    );
  }

  if (isGithub) {
    return (
      <div className={`${sizeClasses[size]} bg-[#24292e] text-white flex items-center justify-center select-none ${className}`}>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3/5 h-3/5">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br ${getGradient(domain || 'app')} text-white flex items-center justify-center font-black uppercase shadow-inner ${className}`}>
      {initial}
    </div>
  );
}
