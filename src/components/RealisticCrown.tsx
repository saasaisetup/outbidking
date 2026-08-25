'use client';

import React from 'react';

interface RealisticCrownProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
}

export function RealisticCrown({ size = 'md', className = '', glow = true }: RealisticCrownProps) {
  const sizePx = {
    sm: 24,
    md: 40,
    lg: 64,
    xl: 84,
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: sizePx, height: sizePx }}
    >
      {/* Ambient Glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-75 pointer-events-none animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.45) 0%, rgba(217,119,6,0.15) 60%, transparent 100%)',
          }}
        />
      )}

      {/* Realistic 3D Handcrafted Vector Crown */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] relative z-10"
      >
        <defs>
          {/* Imperial Gold Gradient */}
          <linearGradient id="imperialGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2A3" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="75%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Crown Base Gradient */}
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          {/* Crimson Velvet Lining */}
          <radialGradient id="velvetCrimson" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#BE123C" />
            <stop offset="70%" stopColor="#881337" />
            <stop offset="100%" stopColor="#4C0519" />
          </radialGradient>

          {/* Ruby Gemstone */}
          <radialGradient id="rubyGem" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="40%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#4C0519" />
          </radialGradient>

          {/* Emerald Gemstone */}
          <radialGradient id="emeraldGem" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="40%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>

          {/* Sapphire Gemstone */}
          <radialGradient id="sapphireGem" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#93C5FD" />
            <stop offset="40%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </radialGradient>
        </defs>

        {/* Velvet Cap interior */}
        <path
          d="M 22 68 C 22 45, 36 32, 50 32 C 64 32, 78 45, 78 68 Z"
          fill="url(#velvetCrimson)"
          stroke="#4C0519"
          strokeWidth="1"
        />

        {/* Velvet tufts and folds */}
        <path
          d="M 50 32 Q 50 50 50 68"
          stroke="#4C0519"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d="M 50 32 Q 36 48 30 68"
          stroke="#4C0519"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M 50 32 Q 64 48 70 68"
          stroke="#4C0519"
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Back Arches of Gold */}
        <path
          d="M 20 68 C 24 38, 40 22, 50 22 C 60 22, 76 38, 80 68"
          fill="none"
          stroke="url(#imperialGold)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Crown Body with Spikes & Fleur-de-lis peaks */}
        <path
          d="M 16 68 
             L 18 36 
             L 34 50 
             L 50 24 
             L 66 50 
             L 82 36 
             L 84 68 
             Z"
          fill="url(#imperialGold)"
          stroke="#78350F"
          strokeWidth="1"
        />

        {/* Central Peak Orb & Cross */}
        <circle cx="50" cy="22" r="4.5" fill="url(#imperialGold)" stroke="#78350F" strokeWidth="0.8" />
        <path d="M 50 13 L 50 20 M 47 16 L 53 16" stroke="url(#imperialGold)" strokeWidth="2.2" strokeLinecap="round" />

        {/* Left and Right Side Peak Orbs */}
        <circle cx="18" cy="34" r="3.5" fill="url(#imperialGold)" stroke="#78350F" strokeWidth="0.8" />
        <circle cx="82" cy="34" r="3.5" fill="url(#imperialGold)" stroke="#78350F" strokeWidth="0.8" />

        {/* Inner Peak Orbs */}
        <circle cx="34" cy="48" r="2.5" fill="url(#imperialGold)" stroke="#78350F" strokeWidth="0.6" />
        <circle cx="66" cy="48" r="2.5" fill="url(#imperialGold)" stroke="#78350F" strokeWidth="0.6" />

        {/* Embossed Base Rim */}
        <rect
          x="14"
          y="66"
          width="72"
          height="14"
          rx="4"
          fill="url(#goldRim)"
          stroke="#78350F"
          strokeWidth="1.2"
        />
        <rect
          x="16"
          y="68"
          width="68"
          height="3"
          rx="1"
          fill="#FEF08A"
          opacity="0.7"
        />

        {/* Embedded Gemstones on the Base Rim */}
        {/* Central Oval Ruby */}
        <ellipse cx="50" cy="73" rx="4" ry="3.2" fill="url(#rubyGem)" stroke="#78350F" strokeWidth="0.6" />
        {/* Left Emerald */}
        <circle cx="38" cy="73" r="2.8" fill="url(#emeraldGem)" stroke="#78350F" strokeWidth="0.5" />
        {/* Right Sapphire */}
        <circle cx="62" cy="73" r="2.8" fill="url(#sapphireGem)" stroke="#78350F" strokeWidth="0.5" />
        {/* Far Left Ruby */}
        <circle cx="26" cy="73" r="2.2" fill="url(#rubyGem)" stroke="#78350F" strokeWidth="0.5" />
        {/* Far Right Emerald */}
        <circle cx="74" cy="73" r="2.2" fill="url(#emeraldGem)" stroke="#78350F" strokeWidth="0.5" />

        {/* Central Crown Jewels on Spikes */}
        <circle cx="50" cy="42" r="3" fill="url(#rubyGem)" stroke="#78350F" strokeWidth="0.6" />
        <circle cx="34" cy="56" r="2.2" fill="url(#sapphireGem)" stroke="#78350F" strokeWidth="0.5" />
        <circle cx="66" cy="56" r="2.2" fill="url(#emeraldGem)" stroke="#78350F" strokeWidth="0.5" />

        {/* Pearlescent Highlights */}
        <circle cx="49" cy="71.5" r="0.8" fill="#FFFFFF" opacity="0.9" />
        <circle cx="37" cy="71.5" r="0.6" fill="#FFFFFF" opacity="0.9" />
        <circle cx="61" cy="71.5" r="0.6" fill="#FFFFFF" opacity="0.9" />
        <circle cx="49" cy="40.5" r="0.8" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}
