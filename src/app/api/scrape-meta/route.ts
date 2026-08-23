import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { store, normalizeUrl } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let urlStr = body?.url;

    if (!urlStr || typeof urlStr !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    urlStr = urlStr.trim();
    if (!urlStr.startsWith('http://') && !urlStr.startsWith('https://')) {
      urlStr = 'https://' + urlStr;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(urlStr);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Check if project already exists in our database
    const existingProject = store.getProjectByUrl(urlStr);

    let title = parsedUrl.hostname.replace(/^www\./, '');
    let description = '';
    let logoUrl = `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
    let ogImage = '';
    let twitterHandle = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(urlStr, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OutbidBot/1.0',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();
        const $ = cheerio.load(html);

        // Title
        const ogTitle = $('meta[property="og:title"]').attr('content');
        const twitterTitle = $('meta[name="twitter:title"]').attr('content');
        const docTitle = $('title').text();
        title = (ogTitle || twitterTitle || docTitle || title).trim();

        // Description
        const ogDesc = $('meta[property="og:description"]').attr('content');
        const metaDesc = $('meta[name="description"]').attr('content');
        const twitterDesc = $('meta[name="twitter:description"]').attr('content');
        description = (ogDesc || metaDesc || twitterDesc || '').trim();

        // OG Image
        const ogImg = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content');
        if (ogImg) {
          try {
            ogImage = new URL(ogImg, urlStr).href;
          } catch {
            ogImage = ogImg;
          }
        }

        // Favicon
        const iconHref = 
          $('link[rel="apple-touch-icon"]').attr('href') ||
          $('link[rel="icon"][sizes="32x32"]').attr('href') ||
          $('link[rel="icon"]').attr('href') ||
          $('link[rel="shortcut icon"]').attr('href');

        if (iconHref) {
          try {
            logoUrl = new URL(iconHref, urlStr).href;
          } catch {
            // Keep google favicon fallback
          }
        }

        // Twitter handle
        const twitterSite = $('meta[name="twitter:site"]').attr('content') || $('meta[name="twitter:creator"]').attr('content');
        if (twitterSite) {
          twitterHandle = twitterSite.replace(/^@/, '');
        }
      }
    } catch (fetchErr) {
      console.warn('[ScrapeMeta] External fetch failed or timed out:', fetchErr);
    }

    return NextResponse.json({
      url: urlStr,
      normalizedUrl: normalizeUrl(urlStr),
      title: existingProject?.title || title,
      description: existingProject?.description || description,
      logoUrl: existingProject?.logoUrl || logoUrl,
      ogImage: existingProject?.ogImage || ogImage,
      twitterHandle: existingProject?.twitterHandle || twitterHandle,
      existingProject: existingProject ? {
        id: existingProject.id,
        currentBid: existingProject.totalBid,
        currentRank: existingProject.rank,
        clicks: existingProject.clicks,
      } : null,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to scrape metadata';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
