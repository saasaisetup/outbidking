import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory cache for fast repeated lookups
const avatarCache = new Map<string, { logoUrl: string; title: string; description: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const input = (searchParams.get('input') || searchParams.get('url') || searchParams.get('handle') || '').trim();

    if (!input || input.length < 2) {
      return NextResponse.json({ success: false, error: 'Input required' }, { status: 400 });
    }

    const cleanInput = input.toLowerCase();

    // Check cache
    const cached = avatarCache.get(cleanInput);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        logoUrl: cached.logoUrl,
        title: cached.title,
        description: cached.description,
        source: 'cache',
      });
    }

    let logoUrl: string | null = null;
    let title: string = input;
    let description: string = '';

    // 1. Twitter / X Handle or URL
    if (cleanInput.startsWith('@') || cleanInput.includes('x.com/') || cleanInput.includes('twitter.com/')) {
      const handle = cleanInput
        .replace(/^@/, '')
        .replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '')
        .split('/')[0]
        .split('?')[0]
        .trim();

      title = `@${handle}`;

      // Try Microlink first for high-res official profile avatar and bio
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const microRes = await fetch(`https://api.microlink.io?url=https://x.com/${handle}`, {
          signal: controller.signal,
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        clearTimeout(timeoutId);

        if (microRes.ok) {
          const microData = await microRes.json();
          const img =
            microData?.data?.image?.url ||
            microData?.data?.logo?.url ||
            microData?.data?.avatar?.url;
          if (img && !img.includes('default_profile')) {
            logoUrl = img;
          }
          if (microData?.data?.title && !title.startsWith('@')) {
            title = microData.data.title;
          }
          if (microData?.data?.description) {
            description = microData.data.description;
          }
        }
      } catch {
        // Fallback to unavatar
      }

      if (!logoUrl) {
        logoUrl = `https://unavatar.io/x/${handle}`;
      }
      if (!description) {
        description = `Verified creator & founder on 𝕏 (@${handle}). Ranking live on Outbid King.`;
      }
    }
    // 2. GitHub
    else if (cleanInput.includes('github.com/')) {
      const handle = cleanInput
        .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
        .split('/')[0]
        .split('?')[0]
        .trim();
      title = `github.com/${handle}`;
      logoUrl = `https://github.com/${handle}.png?size=200`;
      description = `Open-source developer and builder on GitHub.`;
    }
    // 3. Instagram
    else if (cleanInput.includes('instagram.com/')) {
      const handle = cleanInput
        .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '')
        .split('/')[0]
        .split('?')[0]
        .replace(/^@/, '')
        .trim();
      title = `@${handle}`;
      logoUrl = `https://unavatar.io/instagram/${handle}`;
      description = `Creator and influencer profile on Instagram.`;
    }
    // 4. YouTube
    else if (cleanInput.includes('youtube.com/') || cleanInput.includes('youtu.be/')) {
      const handle = cleanInput.replace(/^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|user\/|@)?/, '').split('/')[0];
      title = handle;
      logoUrl = `https://unavatar.io/youtube/${handle}`;
      description = `Official YouTube channel and video creator.`;
    }
    // 5. Standard Website Domain
    else {
      // Normalize domain: strips protocol, www, ports, paths, query params
      const domain = cleanInput
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .split('/')[0]
        .split('?')[0]
        .split('#')[0]
        .trim();

      title = domain;

      if (domain.includes('.')) {
        // High quality Google S2 favicon as instant default
        logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

        // Scrape for high-res logo/og:image, title, and description
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);
          const microRes = await fetch(`https://api.microlink.io?url=https://${domain}`, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          clearTimeout(timeoutId);

          if (microRes.ok) {
            const microData = await microRes.json();
            const ogLogo =
              microData?.data?.logo?.url ||
              microData?.data?.image?.url ||
              microData?.data?.icon?.url;
            if (ogLogo) {
              logoUrl = ogLogo;
            }
            if (microData?.data?.title) {
              title = `${domain} · ${microData.data.title}`;
            }
            if (microData?.data?.description) {
              description = microData.data.description;
            }
          }
        } catch {
          // fallback remains Google S2 favicon
        }

        if (!description) {
          description = `Explore ${domain} — verified product ranked on the live leaderboard.`;
        }
      }
    }

    if (logoUrl) {
      avatarCache.set(cleanInput, { logoUrl, title, description, timestamp: Date.now() });
    }

    return NextResponse.json({
      success: true,
      logoUrl,
      title,
      description,
    });
  } catch (error: any) {
    console.error('[API /api/avatar] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch avatar' }, { status: 500 });
  }
}
