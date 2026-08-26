'use client';

import React from 'react';

export type CrownVariant = 'gold' | 'silver' | 'bronze';

interface RealisticCrownProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: CrownVariant;
  className?: string;
  glow?: boolean;
}

export function RealisticCrown({
  size = 'md',
  variant = 'gold',
  className = '',
  glow = true,
}: RealisticCrownProps) {
  const sizePx = {
    sm: 24,
    md: 40,
    lg: 64,
    xl: 84,
  }[size];

  // Variant configs
  const configs = {
    gold: {
      idPrefix: 'goldCrown',
      glowColor: 'radial-gradient(circle, rgba(245,158,11,0.45) 0%, rgba(217,119,6,0.15) 60%, transparent 100%)',
      metalStops: (
        <>
          <stop offset="0%" stopColor="#FFF2A3" />
          <stop offset="25%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#FDE68A" />
          <stop offset="75%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </>
      ),
      rimStops: (
        <>
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#451A03" />
        </>
      ),
      rimHighlight: '#FEF08A',
      strokeColor: '#78350F',
      velvetStops: (
        <>
          <stop offset="0%" stopColor="#BE123C" />
          <stop offset="70%" stopColor="#881337" />
          <stop offset="100%" stopColor="#4C0519" />
        </>
      ),
      velvetStroke: '#4C0519',
      gem1: { light: '#FDA4AF', mid: '#E11D48', dark: '#4C0519' }, // Ruby
      gem2: { light: '#6EE7B7', mid: '#059669', dark: '#064E3B' }, // Emerald
      gem3: { light: '#93C5FD', mid: '#2563EB', dark: '#1E3A8A' }, // Sapphire
    },
    silver: {
      idPrefix: 'silverCrown',
      glowColor: 'radial-gradient(circle, rgba(203,213,225,0.55) 0%, rgba(148,163,184,0.2) 60%, transparent 100%)',
      metalStops: (
        <>
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#CBD5E1" />
          <stop offset="50%" stopColor="#F1F5F9" />
          <stop offset="75%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </>
      ),
      rimStops: (
        <>
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#334155" />
        </>
      ),
      rimHighlight: '#FFFFFF',
      strokeColor: '#334155',
      velvetStops: (
        <>
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="70%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#020617" />
        </>
      ),
      velvetStroke: '#020617',
      gem1: { light: '#BAE6FD', mid: '#0284C7', dark: '#0369A1' }, // Cyan Sapphire
      gem2: { light: '#C4B5FD', mid: '#7C3AED', dark: '#4C1D95' }, // Amethyst
      gem3: { light: '#E2E8F0', mid: '#64748B', dark: '#1E293B' }, // Diamond
    },
    bronze: {
      idPrefix: 'bronzeCrown',
      glowColor: 'radial-gradient(circle, rgba(217,119,6,0.45) 0%, rgba(180,83,9,0.15) 60%, transparent 100%)',
      metalStops: (
        <>
          <stop offset="0%" stopColor="#FED7AA" />
          <stop offset="25%" stopColor="#EA580C" />
          <stop offset="50%" stopColor="#FDBA74" />
          <stop offset="75%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#7C2D12" />
        </>
      ),
      rimStops: (
        <>
          <stop offset="0%" stopColor="#FDBA74" />
          <stop offset="50%" stopColor="#C2410C" />
          <stop offset="100%" stopColor="#431407" />
        </>
      ),
      rimHighlight: '#FFEDD5',
      strokeColor: '#431407',
      velvetStops: (
        <>
          <stop offset="0%" stopColor="#9A3412" />
          <stop offset="70%" stopColor="#7C2D12" />
          <stop offset="100%" stopColor="#431407" />
        </>
      ),
      velvetStroke: '#431407',
      gem1: { light: '#FDE047', mid: '#CA8A04', dark: '#713F12' }, // Topaz
      gem2: { light: '#FCA5A5', mid: '#DC2626', dark: '#7F1D1D' }, // Garnet
      gem3: { light: '#FDBA74', mid: '#D97706', dark: '#78350F' }, // Amber
    },
  }[variant];

  const p = configs.idPrefix;

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
            background: configs.glowColor,
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
          {/* Metal Gradient */}
          <linearGradient id={`${p}Metal`} x1="0%" y1="0%" x2="100%" y2="100%">
            {configs.metalStops}
          </linearGradient>

          {/* Crown Base Gradient */}
          <linearGradient id={`${p}Rim`} x1="0%" y1="0%" x2="0%" y2="100%">
            {configs.rimStops}
          </linearGradient>

          {/* Velvet Lining */}
          <radialGradient id={`${p}Velvet`} cx="50%" cy="40%" r="50%">
            {configs.velvetStops}
          </radialGradient>

          {/* Gemstone 1 */}
          <radialGradient id={`${p}Gem1`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor={configs.gem1.light} />
            <stop offset="40%" stopColor={configs.gem1.mid} />
            <stop offset="100%" stopColor={configs.gem1.dark} />
          </radialGradient>

          {/* Gemstone 2 */}
          <radialGradient id={`${p}Gem2`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor={configs.gem2.light} />
            <stop offset="40%" stopColor={configs.gem2.mid} />
            <stop offset="100%" stopColor={configs.gem2.dark} />
          </radialGradient>

          {/* Gemstone 3 */}
          <radialGradient id={`${p}Gem3`} cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor={configs.gem3.light} />
            <stop offset="40%" stopColor={configs.gem3.mid} />
            <stop offset="100%" stopColor={configs.gem3.dark} />
          </radialGradient>
        </defs>

        {/* Velvet Cap interior */}
        <path
          d="M 22 68 C 22 45, 36 32, 50 32 C 64 32, 78 45, 78 68 Z"
          fill={`url(#${p}Velvet)`}
          stroke={configs.velvetStroke}
          strokeWidth="1"
        />

        {/* Velvet tufts and folds */}
        <path
          d="M 50 32 Q 50 50 50 68"
          stroke={configs.velvetStroke}
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d="M 50 32 Q 36 48 30 68"
          stroke={configs.velvetStroke}
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M 50 32 Q 64 48 70 68"
          stroke={configs.velvetStroke}
          strokeWidth="1"
          opacity="0.5"
        />

        {/* Back Arches of Metal */}
        <path
          d="M 20 68 C 24 38, 40 22, 50 22 C 60 22, 76 38, 80 68"
          fill="none"
          stroke={`url(#${p}Metal)`}
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
          fill={`url(#${p}Metal)`}
          stroke={configs.strokeColor}
          strokeWidth="1"
        />

        {/* Central Peak Orb & Cross */}
        <circle cx="50" cy="22" r="4.5" fill={`url(#${p}Metal)`} stroke={configs.strokeColor} strokeWidth="0.8" />
        <path d="M 50 13 L 50 20 M 47 16 L 53 16" stroke={`url(#${p}Metal)`} strokeWidth="2.2" strokeLinecap="round" />

        {/* Left and Right Side Peak Orbs */}
        <circle cx="18" cy="34" r="3.5" fill={`url(#${p}Metal)`} stroke={configs.strokeColor} strokeWidth="0.8" />
        <circle cx="82" cy="34" r="3.5" fill={`url(#${p}Metal)`} stroke={configs.strokeColor} strokeWidth="0.8" />

        {/* Inner Peak Orbs */}
        <circle cx="34" cy="48" r="2.5" fill={`url(#${p}Metal)`} stroke={configs.strokeColor} strokeWidth="0.6" />
        <circle cx="66" cy="48" r="2.5" fill={`url(#${p}Metal)`} stroke={configs.strokeColor} strokeWidth="0.6" />

        {/* Embossed Base Rim */}
        <rect
          x="14"
          y="66"
          width="72"
          height="14"
          rx="4"
          fill={`url(#${p}Rim)`}
          stroke={configs.strokeColor}
          strokeWidth="1.2"
        />
        <rect
          x="16"
          y="68"
          width="68"
          height="3"
          rx="1"
          fill={configs.rimHighlight}
          opacity="0.7"
        />

        {/* Embedded Gemstones on the Base Rim */}
        {/* Central Oval Gem */}
        <ellipse cx="50" cy="73" rx="4" ry="3.2" fill={`url(#${p}Gem1)`} stroke={configs.strokeColor} strokeWidth="0.6" />
        {/* Left Gem */}
        <circle cx="38" cy="73" r="2.8" fill={`url(#${p}Gem2)`} stroke={configs.strokeColor} strokeWidth="0.5" />
        {/* Right Gem */}
        <circle cx="62" cy="73" r="2.8" fill={`url(#${p}Gem3)`} stroke={configs.strokeColor} strokeWidth="0.5" />
        {/* Far Left Gem */}
        <circle cx="26" cy="73" r="2.2" fill={`url(#${p}Gem1)`} stroke={configs.strokeColor} strokeWidth="0.5" />
        {/* Far Right Gem */}
        <circle cx="74" cy="73" r="2.2" fill={`url(#${p}Gem2)`} stroke={configs.strokeColor} strokeWidth="0.5" />

        {/* Central Crown Jewels on Spikes */}
        <circle cx="50" cy="42" r="3" fill={`url(#${p}Gem1)`} stroke={configs.strokeColor} strokeWidth="0.6" />
        <circle cx="34" cy="56" r="2.2" fill={`url(#${p}Gem3)`} stroke={configs.strokeColor} strokeWidth="0.5" />
        <circle cx="66" cy="56" r="2.2" fill={`url(#${p}Gem2)`} stroke={configs.strokeColor} strokeWidth="0.5" />

        {/* Pearlescent Highlights */}
        <circle cx="49" cy="71.5" r="0.8" fill="#FFFFFF" opacity="0.9" />
        <circle cx="37" cy="71.5" r="0.6" fill="#FFFFFF" opacity="0.9" />
        <circle cx="61" cy="71.5" r="0.6" fill="#FFFFFF" opacity="0.9" />
        <circle cx="49" cy="40.5" r="0.8" fill="#FFFFFF" opacity="0.9" />
      </svg>
    </div>
  );
}
