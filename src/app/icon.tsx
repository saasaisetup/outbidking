import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0e0d0b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          borderRadius: '7px',
          padding: '6px 5px',
        }}
      >
        {/* Top Terracotta Bar */}
        <div
          style={{
            width: '12px',
            height: '4px',
            background: '#e05d44',
            borderRadius: '2px',
            marginBottom: '3px',
          }}
        />
        {/* Middle White Bar */}
        <div
          style={{
            width: '22px',
            height: '4px',
            background: '#ffffff',
            borderRadius: '2px',
            marginBottom: '3px',
          }}
        />
        {/* Bottom White Bar */}
        <div
          style={{
            width: '16px',
            height: '4px',
            background: '#ffffff',
            borderRadius: '2px',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
