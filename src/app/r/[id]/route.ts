import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  const targetUrl = store.recordClick(id);

  if (!targetUrl) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.redirect(targetUrl, 307);
}
