'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { COUNTRIES_DATA, CountryInfo } from '@/lib/pinitData';

interface GlobeProps {
  selectedCountry: CountryInfo | null;
  onSelectCountry: (country: CountryInfo) => void;
  zoomLevel: number;
  onWheelZoom?: (delta: number) => void;
}

const PASTEL_COLORS = [
  '#c8e6c9', // light green
  '#f8bbd0', // soft pink
  '#fff9c4', // pastel yellow
  '#e1bee7', // soft purple
  '#bbdefb', // soft blue
  '#b2dfdb', // pastel teal/mint
  '#ffe0b2', // pastel peach
  '#d1c4e9', // light lavender
  '#ffcdd2', // light coral
];

export function Globe({ selectedCountry, onSelectCountry, zoomLevel, onWheelZoom }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Rotation angles [lambda (yaw/long), phi (pitch/lat), gamma (roll)]
  const [rotation, setRotation] = useState<[number, number, number]>([-40, -30, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; info?: CountryInfo; x: number; y: number } | null>(null);

  // Image Cache for pin pill icons
  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});

  // Target rotation for smooth animated transition when clicking a country
  const targetRotationRef = useRef<[number, number, number] | null>(null);

  // Preload logo images for active placements
  useEffect(() => {
    Object.values(COUNTRIES_DATA).forEach((c) => {
      if (c.currentLeader?.logo && !imageCacheRef.current[c.currentLeader.logo]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = c.currentLeader.logo;
        img.onload = () => {
          imageCacheRef.current[c.currentLeader!.logo] = img;
          renderGlobe();
        };
      }
    });
  }, []);

  // Load countries TopoJSON
  useEffect(() => {
    fetch('/geo/countries-110m.json')
      .then((res) => res.json())
      .then((data) => {
        setWorldData(data);
      })
      .catch((err) => {
        console.error('Failed to load countries-110m.json:', err);
      });
  }, []);

  // When selectedCountry changes from outside, animate globe rotation to center on it
  useEffect(() => {
    if (selectedCountry) {
      const [lng, lat] = selectedCountry.coordinates;
      targetRotationRef.current = [-lng, -lat, 0];
    }
  }, [selectedCountry]);

  // Smooth rotation animation loop
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (targetRotationRef.current && !isDragging) {
        setRotation((prev) => {
          const [tLng, tLat] = targetRotationRef.current!;
          const [cLng, cLat] = prev;
          const diffLng = (tLng - cLng) * 0.1;
          const diffLat = (tLat - cLat) * 0.1;

          if (Math.abs(diffLng) < 0.05 && Math.abs(diffLat) < 0.05) {
            targetRotationRef.current = null;
            return [tLng, tLat, 0];
          }
          return [cLng + diffLng, cLat + diffLat, 0];
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]);

  // Main Render Canvas
  const renderGlobe = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !worldData) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Strict zoom clamping between 0.8 and 1.45
    const clampedZoom = Math.min(1.45, Math.max(0.8, zoomLevel));
    const radius = Math.min(width, height) * 0.40 * clampedZoom;
    const center: [number, number] = [width / 2, height / 2];

    const projection = d3Geo
      .geoOrthographic()
      .scale(radius)
      .translate(center)
      .rotate(rotation)
      .clipAngle(90);

    const path = d3Geo.geoPath(projection, ctx);

    // 1. Ocean background with subtle shadow
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ebf7f5';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#d4ece8';
    ctx.stroke();

    // 2. Graticules
    const graticule = d3Geo.geoGraticule10();
    ctx.beginPath();
    path(graticule);
    ctx.strokeStyle = 'rgba(180, 220, 215, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 3. Land Countries
    const countries = topojson.feature(worldData, worldData.objects.countries) as any;

    if (countries && countries.features) {
      countries.features.forEach((feature: any, idx: number) => {
        const countryId = String(feature.id);
        const matchedCountry = Object.values(COUNTRIES_DATA).find(
          (c) => c.id === countryId || (c.id && countryId.padStart(3, '0') === c.id.padStart(3, '0'))
        );

        const isHovered = hoveredCountry?.name === feature.properties?.name || hoveredCountry?.info?.id === countryId;
        const isSelected = selectedCountry?.id === countryId;

        ctx.beginPath();
        path(feature);

        if (isSelected) {
          ctx.fillStyle = '#ff8a65';
        } else if (isHovered) {
          ctx.fillStyle = '#ffd54f';
        } else if (matchedCountry && matchedCountry.currentLeader) {
          ctx.fillStyle = '#ffe082'; // Gold-tinted land for active claimed countries
        } else {
          ctx.fillStyle = PASTEL_COLORS[idx % PASTEL_COLORS.length];
        }

        ctx.fill();
        ctx.strokeStyle = isSelected ? '#d84315' : isHovered ? '#f57c00' : 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = isSelected ? 2 : isHovered ? 1.5 : 0.8;
        ctx.stroke();
      });

      // 4. Country Labels on Visible Land
      countries.features.forEach((feature: any) => {
        const countryId = String(feature.id);
        const matchedCountry = Object.values(COUNTRIES_DATA).find(
          (c) => c.id === countryId || (c.id && countryId.padStart(3, '0') === c.id.padStart(3, '0'))
        );

        if (!matchedCountry) return;

        const projectedPoint = projection(matchedCountry.coordinates);
        if (projectedPoint && isPointVisible(matchedCountry.coordinates, rotation)) {
          const [px, py] = projectedPoint;
          ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#2c2523';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(matchedCountry.name, px, py);
        }
      });
    }

    // 5. Draw Floating Active Pinned Placements with REAL LOGOS (e.g. Russia / @shipxankit, Canada / outoutbid.lol)
    Object.values(COUNTRIES_DATA).forEach((c) => {
      if (c.currentLeader) {
        const point = projection(c.coordinates);
        if (point && isPointVisible(c.coordinates, rotation)) {
          const [px, py] = point;
          drawPinPillWithLogo(
            ctx,
            px,
            py - 20,
            c.currentLeader.logo,
            `${c.currentLeader.name} — ev...`,
            c.currentLeader.name
          );
        }
      }
    });

  }, [rotation, zoomLevel, worldData, hoveredCountry, selectedCountry]);

  function isPointVisible(coords: [number, number], rot: [number, number, number]): boolean {
    const centerLon = -rot[0];
    const centerLat = -rot[1];
    const [lon, lat] = coords;

    const rad = Math.PI / 180;
    const cosAngle =
      Math.sin(lat * rad) * Math.sin(centerLat * rad) +
      Math.cos(lat * rad) * Math.cos(centerLat * rad) * Math.cos((lon - centerLon) * rad);

    return cosAngle > 0;
  }

  // Draw floating pin pill with REAL AVATAR / LOGO
  function drawPinPillWithLogo(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    logoUrl: string,
    text: string,
    authorName: string
  ) {
    ctx.save();
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const textWidth = ctx.measureText(text).width;
    const pillWidth = textWidth + 38;
    const pillHeight = 24;
    const radius = 12;

    // Outer Shadow & Pill Container
    ctx.beginPath();
    ctx.roundRect(x - pillWidth / 2, y - pillHeight / 2, pillWidth, pillHeight, radius);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 3;
    ctx.fill();
    ctx.strokeStyle = '#e8e0d5';
    ctx.lineWidth = 1;
    ctx.stroke();

    const avatarX = x - pillWidth / 2 + 13;
    const avatarY = y;
    const avatarRadius = 8;

    const cachedImg = imageCacheRef.current[logoUrl];
    if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
      // Draw actual loaded image clipped in a circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, 2 * Math.PI);
      ctx.clip();
      ctx.drawImage(
        cachedImg,
        avatarX - avatarRadius,
        avatarY - avatarRadius,
        avatarRadius * 2,
        avatarRadius * 2
      );
      ctx.restore();
    } else {
      // Fallback stylish avatar circle with letter
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#FF5722';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((authorName[0] || 'P').toUpperCase(), avatarX, avatarY);
    }

    // Border around avatar
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Pin Text
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#1a1614';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x - pillWidth / 2 + 26, y);
    ctx.restore();
  }

  // Handle Drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container || !worldData) return;

    if (isDragging && lastMousePos) {
      const dx = e.clientX - lastMousePos.x;
      const dy = e.clientY - lastMousePos.y;
      const clampedZoom = Math.min(1.45, Math.max(0.8, zoomLevel));
      const sensitivity = 0.35 / clampedZoom;

      setRotation((prev) => [
        prev[0] + dx * sensitivity,
        Math.max(-85, Math.min(85, prev[1] - dy * sensitivity)),
        0,
      ]);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const clampedZoom = Math.min(1.45, Math.max(0.8, zoomLevel));
      const radius = Math.min(width, height) * 0.40 * clampedZoom;
      const center: [number, number] = [width / 2, height / 2];

      const projection = d3Geo
        .geoOrthographic()
        .scale(radius)
        .translate(center)
        .rotate(rotation)
        .clipAngle(90);

      const inverted = projection.invert?.([mouseX, mouseY]);

      if (inverted && worldData) {
        const countries = topojson.feature(worldData, worldData.objects.countries) as any;
        const hit = countries.features.find((f: any) => d3Geo.geoContains(f, inverted));

        if (hit) {
          const countryId = String(hit.id);
          const matched = Object.values(COUNTRIES_DATA).find(
            (c) => c.id === countryId || (c.id && countryId.padStart(3, '0') === c.id.padStart(3, '0'))
          );
          setHoveredCountry({
            name: matched ? matched.name : hit.properties?.name || 'Territory',
            info: matched,
            x: mouseX,
            y: mouseY,
          });
          return;
        }
      }
      setHoveredCountry(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setLastMousePos(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (hoveredCountry && hoveredCountry.info) {
      onSelectCountry(hoveredCountry.info);
    }
  };

  // Wheel Zoom with tight bounds & event prevention
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (onWheelZoom) {
      onWheelZoom(e.deltaY > 0 ? -0.08 : 0.08);
    }
  };

  useEffect(() => {
    renderGlobe();
  }, [renderGlobe]);

  useEffect(() => {
    const handleResize = () => renderGlobe();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderGlobe]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Floating Tooltip with Real Avatar */}
      {hoveredCountry && !isDragging && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-pin-md border border-[#272732] bg-[#1a1614] px-3.5 py-2.5 text-white shadow-xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: `${hoveredCountry.x}px`,
            top: `${hoveredCountry.y - 14}px`,
          }}
        >
          <div className="flex items-center gap-2">
            {hoveredCountry.info?.code && (
              <span className="font-mono text-[10px] font-bold text-[#a19994] uppercase tracking-wider">
                {hoveredCountry.info.code}
              </span>
            )}
            {hoveredCountry.info?.flag && <span className="text-sm">{hoveredCountry.info.flag}</span>}
            <span className="font-extrabold text-xs text-white">{hoveredCountry.name}</span>
          </div>

          <div className="mt-1 flex items-center gap-2">
            {hoveredCountry.info?.currentLeader ? (
              <>
                <img
                  src={hoveredCountry.info.currentLeader.logo}
                  alt=""
                  className="h-4 w-4 rounded-full object-cover bg-white"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/globe.svg';
                  }}
                />
                <span className="text-[11px] text-[#ffcc80] font-semibold">
                  👑 {hoveredCountry.info.currentLeader.name} (${hoveredCountry.info.currentLeader.stake})
                </span>
              </>
            ) : (
              <span className="text-[11px] text-[#a19994]">Unclaimed. Click to be first</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
