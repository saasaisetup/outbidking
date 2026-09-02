'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { COUNTRIES_DATA } from '@/lib/pinitData';

interface ArchivePlacement {
  id: string;
  rank: number;
  name: string;
  url: string;
  logo: string;
  countryName: string;
  countryFlag: string;
  category: string;
  status: 'Active' | 'Concluded';
  stake: number;
  date: string;
  clicks: number;
}

const ARCHIVE_PLACEMENTS: ArchivePlacement[] = [
  {
    id: 'p-1',
    rank: 1,
    name: 'Terrified of AI',
    url: 'https://terrifiedof.ai',
    logo: 'https://www.google.com/s2/favicons?domain=terrifiedof.ai&sz=128',
    countryName: 'Iran',
    countryFlag: '🇮🇷',
    category: 'SEO & Visibility',
    status: 'Active',
    stake: 10,
    date: '2026-09-02 10:30 UTC',
    clicks: 290,
  },
  {
    id: 'p-2',
    rank: 2,
    name: 'Ankit Singh',
    url: 'https://www.linkedin.com/in/ankit-singh-63022b3a5/',
    logo: 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca',
    countryName: 'United States',
    countryFlag: '🇺🇸',
    category: 'Indie Founders',
    status: 'Active',
    stake: 3,
    date: '2026-09-01 14:15 UTC',
    clicks: 98,
  },
  {
    id: 'p-3',
    rank: 3,
    name: 'ShipXAnkit Consulting',
    url: 'https://shipxankitconsulting.vercel.app/',
    logo: 'https://unavatar.io/twitter/shipxankit',
    countryName: 'China',
    countryFlag: '🇨🇳',
    category: 'Marketing',
    status: 'Active',
    stake: 2,
    date: '2026-08-31 09:40 UTC',
    clicks: 81,
  },
  {
    id: 'p-4',
    rank: 4,
    name: '@shipxankit',
    url: 'https://x.com/shipxankit',
    logo: 'https://unavatar.io/twitter/shipxankit',
    countryName: 'Russia',
    countryFlag: '🇷🇺',
    category: 'Indie Founders',
    status: 'Active',
    stake: 2,
    date: '2026-09-02 08:20 UTC',
    clicks: 34,
  },
  {
    id: 'p-5',
    rank: 5,
    name: 'SnapSong',
    url: 'https://snapsong.io',
    logo: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128',
    countryName: 'Brazil',
    countryFlag: '🇧🇷',
    category: 'AI Media',
    status: 'Active',
    stake: 2,
    date: '2026-08-30 18:00 UTC',
    clicks: 53,
  },
  {
    id: 'p-6',
    rank: 6,
    name: 'outoutbid.lol',
    url: 'https://outoutbid.lol',
    logo: 'https://outoutbid.lol/favicon.svg',
    countryName: 'Canada',
    countryFlag: '🇨🇦',
    category: 'Marketing',
    status: 'Concluded',
    stake: 1,
    date: '2026-08-29 11:30 UTC',
    clicks: 42,
  },
  {
    id: 'p-7',
    rank: 7,
    name: 'QueueForm - Word of Mouth Marketing',
    url: 'https://queueform.com',
    logo: 'https://www.google.com/s2/favicons?domain=queueform.com&sz=128',
    countryName: 'Germany',
    countryFlag: '🇩🇪',
    category: 'Marketing',
    status: 'Concluded',
    stake: 2,
    date: '2026-08-28 16:20 UTC',
    clicks: 65,
  },
  {
    id: 'p-8',
    rank: 8,
    name: "IndieTools | Discover What's Building Next",
    url: 'https://indietools.lol',
    logo: 'https://www.google.com/s2/favicons?domain=indietools.lol&sz=128',
    countryName: 'United Kingdom',
    countryFlag: '🇬🇧',
    category: 'Developer Tools',
    status: 'Concluded',
    stake: 3,
    date: '2026-08-27 12:00 UTC',
    clicks: 112,
  },
];

export default function HallOfFamePage() {
  const [isLightMode, setIsLightMode] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPlacements = ARCHIVE_PLACEMENTS.filter((p) => {
    if (selectedCountry !== 'all' && p.countryName.toLowerCase() !== selectedCountry.toLowerCase()) {
      return false;
    }
    if (selectedCategory !== 'all' && !p.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && p.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    if (searchFilter.trim() && !p.name.toLowerCase().includes(searchFilter.toLowerCase()) && !p.url.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortOrder === 'highest') return b.stake - a.stake;
    if (sortOrder === 'clicks') return b.clicks - a.clicks;
    return 0;
  });

  return (
    <div className={`min-h-screen transition-colors duration-150 ${
      isLightMode ? 'bg-[#faf7f0] text-slate-900' : 'bg-[#06090e] text-white'
    }`}>
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-40 border-b px-4 py-3 sm:px-8 backdrop-blur-md ${
        isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]/90' : 'border-[#1e293b] bg-[#06090e]/90'
      }`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ff5722] text-white shadow-xs">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <span className="font-black text-base tracking-tight">pinit.lol</span>
            </Link>

            <div className={`hidden sm:flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs ${
              isLightMode ? 'border-[#e6dfd1] bg-white text-slate-800' : 'border-[#1e293b] bg-[#0b0f19] text-white'
            }`}>
              <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#94a3b8]">
                <circle cx="9" cy="9" r="6" />
                <path d="m13.5 13.5 4 4" />
              </svg>
              <input
                type="text"
                placeholder="Search countries or products..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-56 bg-transparent text-xs focus:outline-none placeholder:text-[#94a3b8]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLightMode(!isLightMode)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                isLightMode ? 'border-[#e6dfd1] bg-white text-amber-600' : 'border-[#1e293b] bg-[#0b0f19] text-amber-400'
              }`}
            >
              {isLightMode ? '🌙' : '☀️'}
            </button>

            <Link
              href="/hall-of-fame"
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#ff5722]"
            >
              Hall of Fame
            </Link>

            <Link
              href="/"
              className="rounded-full bg-[#ff5722] hover:bg-[#ff7043] px-4 py-2 text-xs font-black text-white shadow-pin-coral transition-transform hover:scale-105"
            >
              Pin your product
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="text-xs font-medium text-[#94a3b8] flex items-center gap-1.5">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span className={isLightMode ? 'text-slate-800' : 'text-slate-200'}>Hall of Fame</span>
        </div>

        {/* Page Title Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Hall of Fame
          </h1>
          <p className="mt-1.5 text-sm text-[#94a3b8]">
            The most decorated profiles on pinit.lol, ranked by real, confirmed history.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setSelectedCountry('all'); setSelectedCategory('all'); }}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                isLightMode
                  ? 'border-[#e6dfd1] bg-white text-slate-800 shadow-pin-sm'
                  : 'border-[#1e293b] bg-[#0b0f19] text-white'
              }`}
            >
              Browse by country
            </button>
            <button
              type="button"
              onClick={() => { setSelectedCountry('all'); }}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                isLightMode
                  ? 'border-[#e6dfd1] bg-white text-slate-800 shadow-pin-sm'
                  : 'border-[#1e293b] bg-[#0b0f19] text-white'
              }`}
            >
              Browse by category
            </button>
          </div>
        </div>

        {/* SEARCH THE PLACEMENT ARCHIVE Box */}
        <div className={`rounded-3xl border p-5 sm:p-6 shadow-sm ${
          isLightMode ? 'border-[#e6dfd1] bg-white' : 'border-[#1e293b] bg-[#0b0f19]'
        }`}>
          <h2 className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8] mb-4">
            SEARCH THE PLACEMENT ARCHIVE
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[10px] font-bold text-[#94a3b8] mb-1">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className={`w-full rounded-2xl border px-3 py-2 text-xs outline-none ${
                  isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
                }`}
              >
                <option value="all">All countries</option>
                {Object.values(COUNTRIES_DATA).map((c) => (
                  <option key={c.id} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94a3b8] mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full rounded-2xl border px-3 py-2 text-xs outline-none ${
                  isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
                }`}
              >
                <option value="all">All categories</option>
                <option value="Marketing">Marketing & Advertising</option>
                <option value="SEO">SEO & Visibility</option>
                <option value="AI Media">AI Media Generation</option>
                <option value="Developer Tools">Developer Tools</option>
                <option value="Indie Founders">Indie Founders</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94a3b8] mb-1">Search</label>
              <input
                type="text"
                placeholder="Product name or domain"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className={`w-full rounded-2xl border px-3 py-2 text-xs outline-none ${
                  isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
                }`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94a3b8] mb-1">Sort</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={`w-full rounded-2xl border px-3 py-2 text-xs outline-none ${
                  isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
                }`}
              >
                <option value="newest">Newest first</option>
                <option value="highest">Highest stake</option>
                <option value="clicks">Most clicks</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#94a3b8] mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full rounded-2xl border px-3 py-2 text-xs outline-none ${
                  isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
                }`}
              >
                <option value="all">All placements</option>
                <option value="Active">Active only</option>
                <option value="Concluded">Concluded</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className={`w-full rounded-2xl border py-2 text-xs font-black transition-colors cursor-pointer ${
                  isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0] hover:bg-slate-100' : 'border-[#1e293b] bg-[#06090e] hover:bg-slate-800'
                }`}
              >
                Filter archive
              </button>
            </div>
          </div>
        </div>

        {/* Highlight Leaderboards (4 Columns / Cards matching Screenshot 2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. MOST CHAMPION TITLES */}
          <div className={`rounded-3xl border p-5 shadow-sm ${
            isLightMode ? 'border-[#e6dfd1] bg-white' : 'border-[#1e293b] bg-[#0b0f19]'
          }`}>
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8] mb-3">
              MOST CHAMPION TITLES
            </h3>
            <div className="divide-y divide-inherit space-y-2">
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-[#94a3b8] w-4">1</span>
                  <img src="https://www.google.com/s2/favicons?domain=indietools.lol&sz=128" alt="" className="h-5 w-5 rounded bg-white" />
                  <span className="text-xs font-bold truncate">IndieTools | Discover What&apos;s Building Next.</span>
                </div>
                <span className="font-mono text-xs font-black text-amber-500 shrink-0">3 titles</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-[#94a3b8] w-4">2</span>
                  <img src="https://www.google.com/s2/favicons?domain=queueform.com&sz=128" alt="" className="h-5 w-5 rounded bg-white" />
                  <span className="text-xs font-bold truncate">QueueForm - Word of Mouth Marketing</span>
                </div>
                <span className="font-mono text-xs font-black text-amber-500 shrink-0">2 titles</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-[#94a3b8] w-4">3</span>
                  <img src="https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca" alt="" className="h-5 w-5 rounded bg-white" />
                  <span className="text-xs font-bold truncate">Ankit Singh (LinkedIn)</span>
                </div>
                <span className="font-mono text-xs font-black text-amber-500 shrink-0">1 title</span>
              </div>
            </div>
          </div>

          {/* 2. MOST TRACKED CLICKS */}
          <div className={`rounded-3xl border p-5 shadow-sm ${
            isLightMode ? 'border-[#e6dfd1] bg-white' : 'border-[#1e293b] bg-[#0b0f19]'
          }`}>
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8] mb-3">
              MOST TRACKED CLICKS
            </h3>
            <div className="divide-y divide-inherit space-y-2">
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-[#94a3b8] w-4">1</span>
                  <img src="https://www.google.com/s2/favicons?domain=terrifiedof.ai&sz=128" alt="" className="h-5 w-5 rounded bg-white" />
                  <span className="text-xs font-bold truncate">Terrified of AI</span>
                </div>
                <span className="font-mono text-xs font-black text-emerald-500 shrink-0">290 clicks</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-[#94a3b8] w-4">2</span>
                  <img src="https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca" alt="" className="h-5 w-5 rounded bg-white" />
                  <span className="text-xs font-bold truncate">Ankit Singh</span>
                </div>
                <span className="font-mono text-xs font-black text-emerald-500 shrink-0">98 clicks</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-[#94a3b8] w-4">3</span>
                  <img src="https://unavatar.io/twitter/shipxankit" alt="" className="h-5 w-5 rounded bg-white" />
                  <span className="text-xs font-bold truncate">ShipXAnkit Consulting</span>
                </div>
                <span className="font-mono text-xs font-black text-emerald-500 shrink-0">81 clicks</span>
              </div>
            </div>
          </div>
        </div>

        {/* PLACEMENT ARCHIVE Table */}
        <div className={`rounded-3xl border p-5 sm:p-6 shadow-sm ${
          isLightMode ? 'border-[#e6dfd1] bg-white' : 'border-[#1e293b] bg-[#0b0f19]'
        }`}>
          <div className="mb-4">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[#94a3b8]">
              PLACEMENT ARCHIVE
            </h3>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              A transaction records when every site steaks a permanent reign even after its 24 hours on the live board end.
            </p>
          </div>

          <div className="divide-y divide-inherit space-y-2">
            {filteredPlacements.map((p) => (
              <div
                key={p.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 pb-1 transition-colors ${
                  isLightMode ? 'hover:bg-slate-50' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="font-mono text-xs font-bold text-[#94a3b8] w-4">#{p.rank}</span>
                  <img
                    src={p.logo}
                    alt=""
                    className="h-6 w-6 rounded-md object-cover bg-white shrink-0 border border-slate-200 dark:border-slate-800"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />
                  <div className="min-w-0">
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-xs hover:text-[#ff5722] truncate block"
                    >
                      {p.name}
                    </a>
                  </div>
                  <span className="text-xs text-[#94a3b8] shrink-0 font-medium">
                    in {p.countryFlag} {p.countryName}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isLightMode ? 'bg-slate-100 text-slate-700' : 'bg-[#1e293b] text-slate-300'
                  }`}>
                    {p.category}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    p.status === 'Active'
                      ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      : isLightMode
                      ? 'bg-slate-100 text-slate-500'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {p.status}
                  </span>
                  <span className="font-mono text-xs font-black text-[#ff7043] w-12 text-right">
                    ${p.stake}
                  </span>
                  <span className="font-mono text-[10px] text-[#94a3b8] hidden md:inline">
                    {p.date}
                  </span>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#ff5722] hover:bg-[#ff7043] px-3 py-1 text-[10px] font-extrabold text-white transition-colors shrink-0"
                  >
                    VISIT ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-12 border-t py-8 px-4 text-center text-xs text-[#94a3b8] ${
        isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
      }`}>
        <div className="flex items-center justify-center gap-4 flex-wrap mb-2">
          <a href="https://indietools.lol" target="_blank" rel="noopener noreferrer" className="hover:underline">IndieTools</a>
          <span>·</span>
          <a href="https://x.com/shipxankit" target="_blank" rel="noopener noreferrer" className="hover:underline">𝕏</a>
          <span>·</span>
          <Link href="/hall-of-fame" className="hover:underline font-bold text-[#ff7043]">Hall of Fame</Link>
          <span>·</span>
          <Link href="/faq" className="hover:underline">FAQ</Link>
          <span>·</span>
          <Link href="/rules" className="hover:underline">Rules</Link>
          <span>·</span>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </div>
        <p className="text-[11px] opacity-70">
          worldpinit.lol · Sovereign territory pay-to-rank map
        </p>
      </footer>
    </div>
  );
}
