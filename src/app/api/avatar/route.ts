import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// In-memory cache for fast repeated lookups
const avatarCache = new Map<string, { logoUrl: string; title: string; timestamp: number }>();
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
        source: 'cache',
      });
    }

    let logoUrl: string | null = null;
    let title: string = input;

    // 1. Twitter / X Handle or URL
    if (cleanInput.startsWith('@') || cleanInput.includes('x.com/') || cleanInput.includes('twitter.com/')) {
      const handle = cleanInput
        .replace(/^@/, '')
        .replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '')
        .split('/')[0]
        .split('?')[0]
        .trim();

      title = `@${handle}`;

      // Try Microlink first for high-res official profile avatar
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
        }
      } catch {
        // Fallback to unavatar
      }

      if (!logoUrl) {
        logoUrl = `https://unavatar.io/x/${handle}`;
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
    }
    // 4. YouTube
    else if (cleanInput.includes('youtube.com/') || cleanInput.includes('youtu.be/')) {
      const handle = cleanInput.replace(/^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|user\/|@)?/, '').split('/')[0];
      title = handle;
      logoUrl = `https://unavatar.io/youtube/${handle}`;
    }
    // 5. Standard Website Domain
    else {
      const domain = cleanInput.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].trim();
      title = domain;

      if (domain.includes('.')) {
        logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

        // Optional scrape for high-res og:image or favicon
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);
          const microRes = await fetch(`https://api.microlink.io?url=https://${domain}`, {
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0' },
          });
          clearTimeout(timeoutId);

          if (microRes.ok) {
            const microData = await microRes.json();
            const ogLogo = microData?.data?.logo?.url || microData?.data?.image?.url;
            if (ogLogo) {
              logoUrl = ogLogo;
            }
            if (microData?.data?.title) {
              title = microData.data.title;
            }
          }
        } catch {
          // keep Google S2 favicon
        }
      }
    }

    if (logoUrl) {
      avatarCache.set(cleanInput, { logoUrl, title, timestamp: Date.now() });
    }

    return NextResponse.json({
      success: true,
      logoUrl,
      title,
    });
  } catch (error: any) {
    console.error('[API /api/avatar] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch avatar' }, { status: 500 });
  }
}
