'use client';

import React from 'react';
import Link from 'next/link';
import { CountryInfo } from '@/lib/pinitData';

interface CountryClaimCardProps {
  country: CountryInfo;
  onClose: () => void;
  onClaim: (country: CountryInfo) => void;
  isLightMode?: boolean;
}

export function CountryClaimCard({
  country,
  onClose,
  onClaim,
  isLightMode = false,
}: CountryClaimCardProps) {
  const isClaimed = !!country.currentLeader;
  const minPrice = isClaimed ? country.currentLeader!.stake + 1 : (country.minPrice || 1);

  return (
    <div className="pointer-events-auto absolute inset-x-3 bottom-14 z-40 sm:inset-x-auto sm:right-6 sm:bottom-14 sm:w-84 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className={`rounded-pin-lg border p-4 shadow-2xl backdrop-blur-md ${
        isLightMode
          ? 'border-[#e6dfd1] bg-white/95 text-slate-900'
          : 'border-[#1e293b] bg-[#0b0f19]/95 text-white'
      }`}>
        {/* Header: Flag + Name + Code Badge + Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{country.flag}</span>
            <h3 className="font-extrabold text-base tracking-tight">
              {country.name}
            </h3>
            <span className={`font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
              isLightMode ? 'bg-slate-100 text-slate-700' : 'bg-[#1e293b] text-[#94a3b8]'
            }`}>
              {country.code}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close country details"
            className="rounded-full p-1.5 text-[#94a3b8] hover:bg-slate-700/20 hover:text-white transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Sovereign Ruler Info */}
        <div className="mt-3">
          {isClaimed ? (
            <div className={`rounded-pin-md border p-3 ${
              isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <img
                    src={country.currentLeader!.logo}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover bg-white border border-[#1e293b] shrink-0 shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/p/${country.currentLeader!.id}`}
                      className="font-extrabold text-sm hover:underline hover:text-[#ff7043] truncate block leading-tight"
                    >
                      {country.currentLeader!.name}
                    </Link>
                    <span className="text-[11px] font-bold text-[#fbbf24]">
                      ${country.currentLeader!.stake} staked
                    </span>
                  </div>
                </div>

                {/* Direct VISIT ↗ Button */}
                <a
                  href={country.currentLeader!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[#ff5722] hover:bg-[#ff7043] text-white px-3 py-1.5 text-xs font-extrabold shadow-pin-coral transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                >
                  <span>VISIT</span>
                  <span>↗</span>
                </a>
              </div>

              {/* Tagline */}
              <p className="mt-2 text-xs text-[#94a3b8] leading-tight">
                {country.currentLeader!.tagline}
              </p>

              {/* Expiration & Clicks */}
              <div className="mt-2 pt-2 border-t border-inherit flex items-center justify-between text-[11px] text-[#94a3b8]">
                <span>Expires in <strong className={isLightMode ? 'text-slate-900' : 'text-white'}>{country.currentLeader!.expiresIn}</strong></span>
                <span className="font-bold text-emerald-500">{country.currentLeader!.clicks} clicks</span>
              </div>
            </div>
          ) : (
            <div className={`p-3 rounded-pin-md border text-center ${
              isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
            }`}>
              <p className="text-xs text-[#94a3b8]">Unclaimed sovereign territory.</p>
              <p className="mt-1 text-xs font-bold text-amber-500">
                Starting bid: ${minPrice}
              </p>
            </div>
          )}
        </div>

        {/* Action Button: Opens the Clean 2-Step StakeModal with custom bid & multipliers */}
        <button
          type="button"
          onClick={() => onClaim(country)}
          className="mt-3.5 w-full rounded-full bg-[#ff5722] hover:bg-[#ff7043] py-2.5 text-center text-xs font-extrabold text-white shadow-pin-coral transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {isClaimed
            ? `Outbid ${country.currentLeader!.name} from $${minPrice}`
            : `Claim ${country.name} from $${minPrice}`}
        </button>

        {/* Deep Links */}
        <div className="mt-2 flex items-center justify-center gap-3 text-[11px] font-semibold text-[#94a3b8]">
          <Link
            href={`/country/${country.slug}`}
            className="hover:text-[#ff7043] hover:underline"
          >
            View {country.name} history →
          </Link>
          {isClaimed && (
            <>
              <span>·</span>
              <Link
                href={`/p/${country.currentLeader!.id}`}
                className="hover:text-[#ff7043] hover:underline"
              >
                Product details →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
