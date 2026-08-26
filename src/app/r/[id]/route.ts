import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

function formatRedirectUrl(rawUrl: string): string {
  let clean = rawUrl.trim();
  if (clean.startsWith('@')) {
    return `https://x.com/${clean.substring(1)}`;
  }
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    return `https://${clean}`;
  }
  return clean;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const decodedId = decodeURIComponent(id);

    // 1. Try atomic Supabase click tracking RPC
    if (supabase) {
      try {
        const { data: rpcUrl, error: rpcErr } = await supabase.rpc('increment_project_clicks', {
          project_id: decodedId,
        });

        if (!rpcErr && rpcUrl) {
          return NextResponse.redirect(formatRedirectUrl(rpcUrl), 307);
        }

        // 2. Direct Supabase query fallback
        const { data: proj } = await supabase
          .from('projects')
          .select('url, clicks')
          .or(`id.eq.${decodedId},normalized_url.eq.${decodedId},url.eq.${decodedId}`)
          .single();

        if (proj && proj.url) {
          // Increment in background
          supabase
            .from('projects')
            .update({ clicks: (proj.clicks || 0) + 1, updated_at: new Date().toISOString() })
            .or(`id.eq.${decodedId},normalized_url.eq.${decodedId}`)
            .then(() => {});

          return NextResponse.redirect(formatRedirectUrl(proj.url), 307);
        }
      } catch (err) {
        console.error('[Redirect RPC Error]', err);
      }
    }

    // 3. In-memory store fallback
    const memoryUrl = store.recordClick(decodedId);
    if (memoryUrl) {
      return NextResponse.redirect(formatRedirectUrl(memoryUrl), 307);
    }

    // If decodedId is itself a valid url or handle
    if (decodedId.includes('.') || decodedId.startsWith('@')) {
      return NextResponse.redirect(formatRedirectUrl(decodedId), 307);
    }

    return NextResponse.redirect(new URL('/', req.url));
  } catch (error) {
    console.error('[Redirect Route Error]', error);
    return NextResponse.redirect(new URL('/', req.url));
  }
}
