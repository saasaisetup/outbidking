import { NextRequest } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = store.getProjectById(id);

  const rank = project ? project.rank : '?';
  const bid = project ? `$${project.totalBid.toLocaleString()}` : '$0';
  const title = project ? project.title.slice(0, 18) : 'Outbid.lol';

  let rankBg = '#1e293b';
  let rankText = '#94a3b8';
  let crownIcon = '';

  if (rank === 1) {
    rankBg = '#eab308';
    rankText = '#000000';
    crownIcon = '👑 ';
  } else if (rank === 2) {
    rankBg = '#94a3b8';
    rankText = '#000000';
  } else if (rank === 3) {
    rankBg = '#d97706';
    rankText = '#ffffff';
  } else {
    rankBg = '#3b82f6';
    rankText = '#ffffff';
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="32" viewBox="0 0 220 32" fill="none">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#09090b" />
        <stop offset="100%" stop-color="#18181b" />
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.5"/>
      </filter>
    </defs>
    
    <rect width="220" height="32" rx="6" fill="url(#bgGrad)" stroke="#27272a" stroke-width="1"/>
    
    <!-- Left label: Outbid -->
    <text x="12" y="20" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" letter-spacing="0.5">OUTBID.LOL</text>
    
    <!-- Middle divider -->
    <line x1="90" y1="6" x2="90" y2="26" stroke="#27272a" stroke-width="1" />
    
    <!-- Right badge: Rank -->
    <rect x="98" y="6" width="112" height="20" rx="4" fill="${rankBg}" />
    <text x="154" y="20" fill="${rankText}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" text-anchor="middle">
      ${crownIcon}RANK #${rank} (${bid})
    </text>
  </svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
