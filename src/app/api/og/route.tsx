import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'Outbid.lol';
    const rank = searchParams.get('rank') || '1';
    const bid = searchParams.get('bid') || '$14,500';
    const url = searchParams.get('url') || 'outbidking.lol';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: 'sans-serif',
            color: '#ffffff',
            padding: '40px',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '28px',
                fontWeight: 900,
                letterSpacing: '-0.5px',
              }}
            >
              <span style={{ color: '#fbbf24' }}>⚡ OUTBID</span>
              <span style={{ color: '#a1a1aa' }}>.LOL</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 20px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                border: '2px solid rgba(251, 191, 36, 0.4)',
                color: '#fef08a',
                fontSize: '20px',
                fontWeight: 800,
              }}
            >
              PAY-TO-RANK LEADERBOARD
            </div>
          </div>

          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#18181b',
              borderRadius: '28px',
              border: '3px solid #fbbf24',
              padding: '50px 60px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(251, 191, 36, 0.25)',
            }}
          >
            <div
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#fbbf24',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              👑 RANK #{rank} ON OUTBID
            </div>

            <div
              style={{
                fontSize: '56px',
                fontWeight: 900,
                color: '#ffffff',
                textAlign: 'center',
                marginBottom: '16px',
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '30px',
                marginTop: '10px',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  color: '#a1a1aa',
                }}
              >
                Lifetime Bid: <strong style={{ color: '#fbbf24' }}>{bid}</strong>
              </div>
              <div
                style={{
                  fontSize: '28px',
                  color: '#71717a',
                }}
              >
                •
              </div>
              <div
                style={{
                  fontSize: '28px',
                  color: '#60a5fa',
                }}
              >
                {url}
              </div>
            </div>
          </div>

          {/* Footer Call to Action */}
          <div
            style={{
              marginTop: '40px',
              fontSize: '22px',
              color: '#71717a',
              fontWeight: 600,
            }}
          >
            Can you outbid this project? Visit outbidking.lol to claim your rank.
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error';
    return new Response(`Failed to generate image: ${msg}`, { status: 500 });
  }
}
