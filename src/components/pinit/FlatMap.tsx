'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { COUNTRIES_DATA, CountryInfo, DARK_MAP_COLORS } from '@/lib/pinitData';

interface FlatMapProps {
  selectedCountry: CountryInfo | null;
  onSelectCountry: (country: CountryInfo) => void;
  zoomLevel: number;
  onWheelZoom?: (delta: number) => void;
}

export function FlatMap({
  selectedCountry,
  onSelectCountry,
  zoomLevel,
  onWheelZoom,
}: FlatMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pan offsets [tx, ty]
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; info?: CountryInfo; x: number; y: number } | null>(null);

  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});

  const loadLogoImage = useCallback((url: string) => {
    if (!url || imageCacheRef.current[url]) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      imageCacheRef.current[url] = img;
      renderMap();
    };
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.src = url;
      fallbackImg.onload = () => {
        imageCacheRef.current[url] = fallbackImg;
        renderMap();
      };
    };
    imageCacheRef.current[url] = img;
  }, []);

  useEffect(() => {
    Object.values(COUNTRIES_DATA).forEach((c) => {
      if (c.currentLeader?.logo) {
        loadLogoImage(c.currentLeader.logo);
      }
    });
  }, [loadLogoImage]);

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

  const renderMap = useCallback(() => {
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

    const clampedZoom = Math.min(2.5, Math.max(0.75, zoomLevel));
    const scale = (width / 6.28) * clampedZoom;
    const center: [number, number] = [width / 2 + pan[0], height / 2 + pan[1] + 15];

    // Natural Earth projection for flat world view
    const projection = d3Geo
      .geoNaturalEarth1()
      .scale(scale)
      .translate(center);

    const path = d3Geo.geoPath(projection, ctx);

    // 1. Graticules
    const graticule = d3Geo.geoGraticule10();
    ctx.beginPath();
    path(graticule);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // 2. Land Countries
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
          ctx.fillStyle = '#ff5722';
        } else if (isHovered) {
          ctx.fillStyle = '#fbbf24';
        } else if (matchedCountry?.color) {
          ctx.fillStyle = matchedCountry.color;
        } else {
          ctx.fillStyle = DARK_MAP_COLORS[idx % DARK_MAP_COLORS.length];
        }

        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : isHovered ? '#ffd54f' : 'rgba(15, 23, 42, 0.85)';
        ctx.lineWidth = isSelected ? 2 : isHovered ? 1.5 : 0.7;
        ctx.stroke();
      });

      // 3. Country Names
      countries.features.forEach((feature: any) => {
        const countryId = String(feature.id);
        const matchedCountry = Object.values(COUNTRIES_DATA).find(
          (c) => c.id === countryId || (c.id && countryId.padStart(3, '0') === c.id.padStart(3, '0'))
        );

        if (!matchedCountry || matchedCountry.isOceanZone) return;

        const projectedPoint = projection(matchedCountry.coordinates);
        if (projectedPoint) {
          const [px, py] = projectedPoint;
          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(matchedCountry.name, px, py);
          }
        }
      });
    }

    // 4. Draw Maritime Ocean Trade Route Spots (South Atlantic, Pacific Fleet, etc.)
    Object.values(COUNTRIES_DATA).filter((c) => c.isOceanZone).forEach((zone) => {
      const point = projection(zone.coordinates);
      if (point) {
        const [px, py] = point;
        drawOceanSpot(ctx, px, py, zone.name, zone.flag);
      }
    });

    // 5. Draw Sleek LOGO-ONLY Badges on Active Countries
    Object.values(COUNTRIES_DATA).forEach((c) => {
      if (c.currentLeader) {
        const point = projection(c.coordinates);
        if (point) {
          const [px, py] = point;
          drawLogoOnlyBadge(ctx, px, py - 16, c.currentLeader.logo, c.currentLeader.name);
        }
      }
    });

  }, [pan, zoomLevel, worldData, hoveredCountry, selectedCountry]);

  // Draw Maritime Ocean Spot (dashed green ring with anchor)
  function drawOceanSpot(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    name: string,
    icon: string
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();

    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, x, y);

    ctx.font = 'bold 8px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#6ee7b7';
    ctx.fillText(name, x, y + 18);
    ctx.restore();
  }

  function drawLogoOnlyBadge(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    logoUrl: string,
    authorName: string
  ) {
    ctx.save();
    const size = 24;
    const radius = 6;

    ctx.beginPath();
    ctx.roundRect(x - size / 2, y - size / 2, size, size, radius);
    ctx.fillStyle = '#0b0f19';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const imgSize = 18;
    const imgX = x - imgSize / 2;
    const imgY = y - imgSize / 2;

    const cachedImg = imageCacheRef.current[logoUrl];
    if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgSize, imgSize, 4);
      ctx.clip();
      ctx.drawImage(cachedImg, imgX, imgY, imgSize, imgSize);
      ctx.restore();
    } else {
      if (logoUrl && !imageCacheRef.current[logoUrl]) {
        loadLogoImage(logoUrl);
      }
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgSize, imgSize, 4);
      ctx.fillStyle = '#ff5722';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((authorName[0] || 'P').toUpperCase(), x, y);
    }
    ctx.restore();
  }

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
      setPan((prev) => [prev[0] + dx, prev[1] + dy]);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const clampedZoom = Math.min(2.5, Math.max(0.75, zoomLevel));
      const scale = (width / 6.28) * clampedZoom;
      const center: [number, number] = [width / 2 + pan[0], height / 2 + pan[1] + 15];

      const projection = d3Geo
        .geoNaturalEarth1()
        .scale(scale)
        .translate(center);

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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (onWheelZoom) {
      onWheelZoom(e.deltaY > 0 ? -0.1 : 0.1);
    }
  };

  useEffect(() => {
    renderMap();
  }, [renderMap]);

  useEffect(() => {
    const handleResize = () => renderMap();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderMap]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full select-none cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center bg-[#06090e]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Floating Dark Tooltip with Clickable Visit Link */}
      {hoveredCountry && !isDragging && (
        <div
          className="pointer-events-auto absolute z-30 -translate-x-1/2 -translate-y-full rounded-pin-md border border-[#1e293b] bg-[#0b0f19]/95 px-3.5 py-2.5 text-white shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: `${hoveredCountry.x}px`,
            top: `${hoveredCountry.y - 14}px`,
          }}
        >
          <div className="flex items-center gap-2">
            {hoveredCountry.info?.flag && <span className="text-base">{hoveredCountry.info.flag}</span>}
            {hoveredCountry.info?.code && (
              <span className="font-mono text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider">
                {hoveredCountry.info.code}
              </span>
            )}
            <span className="font-extrabold text-xs text-white">{hoveredCountry.name}</span>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-3 pt-1 border-t border-[#1e293b]">
            {hoveredCountry.info?.currentLeader ? (
              <>
                <div className="flex items-center gap-1.5 min-w-0">
                  <img
                    src={hoveredCountry.info.currentLeader.logo}
                    alt=""
                    className="h-4 w-4 rounded-full object-cover bg-white shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />
                  <span className="text-[11px] text-[#fbbf24] font-bold truncate">
                    {hoveredCountry.info.currentLeader.name} (${hoveredCountry.info.currentLeader.stake})
                  </span>
                </div>

                <a
                  href={hoveredCountry.info.currentLeader.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full bg-[#ff5722] hover:bg-[#ff7043] px-2 py-0.5 text-[10px] font-extrabold text-white transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  VISIT ↗
                </a>
              </>
            ) : (
              <span className="text-[11px] text-[#94a3b8]">Unclaimed. Tap to stake</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
