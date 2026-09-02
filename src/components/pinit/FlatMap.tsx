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
  isLightMode?: boolean;
}

export function FlatMap({
  selectedCountry,
  onSelectCountry,
  zoomLevel,
  onWheelZoom,
  isLightMode = false,
}: FlatMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Pan offsets [tx, ty]
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [worldData, setWorldData] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; info?: CountryInfo; x: number; y: number } | null>(null);

  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartDistRef = useRef<number | null>(null);
  const isTouchDraggingRef = useRef(false);

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

  // Compute Projection with bounded pan
  const getProjection = useCallback((width: number, height: number, customPan: [number, number]) => {
    const isMobile = width < 640;
    const clampedZoom = Math.min(3.0, Math.max(0.7, zoomLevel));
    const baseScale = isMobile ? width / 5.2 : width / 5.8;
    const scale = baseScale * clampedZoom;

    // Strict boundary clamping so map cannot be dragged offscreen
    const maxPanX = Math.max(20, (width * (clampedZoom - 0.7)) / 1.6);
    const maxPanY = Math.max(20, (height * (clampedZoom - 0.7)) / 1.8);

    const clampedPanX = Math.max(-maxPanX, Math.min(maxPanX, customPan[0]));
    const clampedPanY = Math.max(-maxPanY, Math.min(maxPanY, customPan[1]));

    const center: [number, number] = [
      width / 2 + clampedPanX,
      height / 2 + clampedPanY + (isMobile ? 0 : 25),
    ];

    return d3Geo
      .geoNaturalEarth1()
      .scale(scale)
      .translate(center);
  }, [zoomLevel]);

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

    // Warm cream background for light theme, dark space for dark theme
    ctx.fillStyle = isLightMode ? '#faf7f0' : '#06090e';
    ctx.fillRect(0, 0, width, height);

    const projection = getProjection(width, height, pan);
    const path = d3Geo.geoPath(projection, ctx);

    // 1. Graticules
    const graticule = d3Geo.geoGraticule10();
    ctx.beginPath();
    path(graticule);
    ctx.strokeStyle = isLightMode ? 'rgba(214, 204, 187, 0.45)' : 'rgba(30, 41, 59, 0.45)';
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
        } else if (matchedCountry?.currentLeader?.customColor) {
          ctx.fillStyle = matchedCountry.currentLeader.customColor;
        } else if (matchedCountry?.color) {
          ctx.fillStyle = matchedCountry.color;
        } else {
          ctx.fillStyle = DARK_MAP_COLORS[idx % DARK_MAP_COLORS.length];
        }

        ctx.fill();
        ctx.strokeStyle = isSelected
          ? '#ffffff'
          : isHovered
          ? '#ffd54f'
          : isLightMode
          ? 'rgba(255, 255, 255, 0.85)'
          : 'rgba(15, 23, 42, 0.85)';
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
            ctx.fillStyle = isLightMode ? '#1e293b' : 'rgba(255, 255, 255, 0.85)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(matchedCountry.name, px, py);
          }
        }
      });
    }

    // 4. Draw Maritime Ocean Trade Portals ($10 Each)
    Object.values(COUNTRIES_DATA).filter((c) => c.isOceanZone).forEach((zone) => {
      const point = projection(zone.coordinates);
      if (point) {
        const [px, py] = point;
        drawOceanSpot(ctx, px, py, zone.name, zone.flag, zone.minPrice || 10);
      }
    });

    // 5. Draw Sleek LOGO-ONLY Badges on Active Countries
    Object.values(COUNTRIES_DATA).forEach((c) => {
      if (c.currentLeader) {
        const point = projection(c.coordinates);
        if (point) {
          const [px, py] = point;
          drawLogoOnlyBadge(ctx, px, py - 18, c.currentLeader.logo, c.currentLeader.name);
        }
      }
    });

  }, [pan, zoomLevel, worldData, hoveredCountry, selectedCountry, isLightMode, getProjection]);

  function drawOceanSpot(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    name: string,
    icon: string,
    price: number
  ) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.85)';
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
    ctx.fillStyle = '#10b981';
    ctx.fillText(`${name} ($${price})`, x, y + 18);
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
    const size = 26;
    const radius = 7;

    ctx.beginPath();
    ctx.roundRect(x - size / 2, y - size / 2, size, size, radius);
    ctx.fillStyle = isLightMode ? '#ffffff' : '#0b0f19';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const imgSize = 20;
    const imgX = x - imgSize / 2;
    const imgY = y - imgSize / 2;

    const cachedImg = imageCacheRef.current[logoUrl];
    if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgSize, imgSize, 5);
      ctx.clip();
      ctx.drawImage(cachedImg, imgX, imgY, imgSize, imgSize);
      ctx.restore();
    } else {
      if (logoUrl && !imageCacheRef.current[logoUrl]) {
        loadLogoImage(logoUrl);
      }
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgSize, imgSize, 5);
      ctx.fillStyle = '#ff5722';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((authorName[0] || 'P').toUpperCase(), x, y);
    }
    ctx.restore();
  }

  // Find country or logo badge at point
  const findCountryAtPoint = (px: number, py: number): { country: CountryInfo; clickedLogo?: boolean } | null => {
    const container = containerRef.current;
    if (!container || !worldData) return null;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const projection = getProjection(width, height, pan);

    // 1. Check if direct click on any active Leader's Logo Badge (26x26 hitbox)
    for (const c of Object.values(COUNTRIES_DATA)) {
      if (c.currentLeader) {
        const point = projection(c.coordinates);
        if (point) {
          const [badgeX, badgeY] = [point[0], point[1] - 18];
          if (Math.hypot(badgeX - px, badgeY - py) <= 16) {
            return { country: c, clickedLogo: true };
          }
        }
      }
    }

    // 2. Check Ocean Zones
    const oceanHit = Object.values(COUNTRIES_DATA).find((zone) => {
      if (!zone.isOceanZone) return false;
      const point = projection(zone.coordinates);
      if (!point) return false;
      return Math.hypot(point[0] - px, point[1] - py) <= 24;
    });

    if (oceanHit) return { country: oceanHit };

    // 3. Check Geo Polygon
    const inverted = projection.invert?.([px, py]);
    if (!inverted) return null;

    const countries = topojson.feature(worldData, worldData.objects.countries) as any;
    const hit = countries.features.find((f: any) => d3Geo.geoContains(f, inverted));

    if (hit) {
      const countryId = String(hit.id);
      const matched = Object.values(COUNTRIES_DATA).find(
        (c) => c.id === countryId || (c.id && countryId.padStart(3, '0') === c.id.padStart(3, '0'))
      ) || {
        id: countryId,
        slug: (hit.properties?.name || 'territory').toLowerCase().replace(/\s+/g, '-'),
        name: hit.properties?.name || 'Territory',
        code: 'GL',
        flag: '🌍',
        coordinates: inverted as [number, number],
      };
      return { country: matched };
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container || !worldData) return;

    if (isDragging && lastMousePosRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      const clampedZoom = Math.min(3.0, Math.max(0.7, zoomLevel));
      const maxPanX = Math.max(20, (width * (clampedZoom - 0.7)) / 1.6);
      const maxPanY = Math.max(20, (height * (clampedZoom - 0.7)) / 1.8);

      setPan((prev) => [
        Math.max(-maxPanX, Math.min(maxPanX, prev[0] + dx)),
        Math.max(-maxPanY, Math.min(maxPanY, prev[1] + dy)),
      ]);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const hit = findCountryAtPoint(mouseX, mouseY);

      if (hit) {
        setHoveredCountry({
          name: hit.country.name,
          info: hit.country,
          x: mouseX,
          y: mouseY,
        });
      } else {
        setHoveredCountry(null);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    lastMousePosRef.current = null;
  };

  const handleClick = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const hit = findCountryAtPoint(mouseX, mouseY);

    if (hit) {
      if (hit.clickedLogo && hit.country.currentLeader?.url) {
        window.open(hit.country.currentLeader.url, '_blank');
      } else {
        onSelectCountry(hit.country);
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
      isTouchDraggingRef.current = false;
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!container) return;

    if (e.touches.length === 1 && lastMousePosRef.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - lastMousePosRef.current.x;
      const dy = touch.clientY - lastMousePosRef.current.y;

      if (Math.hypot(dx, dy) > 4) {
        isTouchDraggingRef.current = true;
      }

      const width = container.clientWidth;
      const height = container.clientHeight;
      const clampedZoom = Math.min(3.0, Math.max(0.7, zoomLevel));
      const maxPanX = Math.max(20, (width * (clampedZoom - 0.7)) / 1.6);
      const maxPanY = Math.max(20, (height * (clampedZoom - 0.7)) / 1.8);

      setPan((prev) => [
        Math.max(-maxPanX, Math.min(maxPanX, prev[0] + dx)),
        Math.max(-maxPanY, Math.min(maxPanY, prev[1] + dy)),
      ]);
      lastMousePosRef.current = { x: touch.clientX, y: touch.clientY };
    } else if (e.touches.length === 2 && touchStartDistRef.current && onWheelZoom) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = (newDist - touchStartDistRef.current) * 0.005;
      onWheelZoom(delta);
      touchStartDistRef.current = newDist;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!isTouchDraggingRef.current && touchStartPosRef.current && container) {
      const rect = container.getBoundingClientRect();
      const tapX = touchStartPosRef.current.x - rect.left;
      const tapY = touchStartPosRef.current.y - rect.top;
      const hit = findCountryAtPoint(tapX, tapY);

      if (hit) {
        if (hit.clickedLogo && hit.country.currentLeader?.url) {
          window.open(hit.country.currentLeader.url, '_blank');
        } else {
          onSelectCountry(hit.country);
        }
      }
    }

    isTouchDraggingRef.current = false;
    touchStartPosRef.current = null;
    lastMousePosRef.current = null;
    touchStartDistRef.current = null;
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
      className={`relative h-full w-full select-none cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center touch-none ${
        isLightMode ? 'bg-[#faf7f0]' : 'bg-[#06090e]'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Floating Tooltip with Direct URL Link Preview & Visit CTA */}
      {hoveredCountry && !isDragging && (
        <div
          className={`pointer-events-auto absolute z-30 -translate-x-1/2 -translate-y-full rounded-pin-md border px-3.5 py-2.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100 ${
            isLightMode
              ? 'border-[#e6dfd1] bg-white/95 text-slate-900'
              : 'border-[#1e293b] bg-[#0b0f19]/95 text-white'
          }`}
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
            <span className="font-extrabold text-xs">{hoveredCountry.name}</span>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-3 pt-1 border-t border-inherit">
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
                  <div>
                    <span className="text-[11px] text-[#fbbf24] font-bold truncate block">
                      {hoveredCountry.info.currentLeader.name} (${hoveredCountry.info.currentLeader.stake})
                    </span>
                    <span className="text-[9px] text-[#94a3b8] truncate block font-mono">
                      {hoveredCountry.info.currentLeader.url}
                    </span>
                  </div>
                </div>

                <a
                  href={hoveredCountry.info.currentLeader.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full bg-[#ff5722] hover:bg-[#ff7043] px-2.5 py-1 text-[10px] font-extrabold text-white transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  VISIT ↗
                </a>
              </>
            ) : (
              <span className="text-[11px] text-[#94a3b8]">
                Unclaimed portal (${hoveredCountry.info?.minPrice || 1}). Tap to claim
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
