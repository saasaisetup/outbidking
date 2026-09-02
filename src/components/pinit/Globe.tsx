'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { COUNTRIES_DATA, CountryInfo, DARK_MAP_COLORS } from '@/lib/pinitData';

interface GlobeProps {
  selectedCountry: CountryInfo | null;
  onSelectCountry: (country: CountryInfo) => void;
  zoomLevel: number;
  onWheelZoom?: (delta: number) => void;
  isLightMode?: boolean;
}

export function Globe({
  selectedCountry,
  onSelectCountry,
  zoomLevel,
  onWheelZoom,
  isLightMode = false,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [rotation, setRotation] = useState<[number, number, number]>([-30, -25, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [worldData, setWorldData] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; info?: CountryInfo; x: number; y: number } | null>(null);

  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);
  const touchStartDistRef = useRef<number | null>(null);
  const isTouchDraggingRef = useRef(false);

  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});
  const targetRotationRef = useRef<[number, number, number] | null>(null);

  const loadLogoImage = useCallback((url: string) => {
    if (!url || imageCacheRef.current[url]) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => {
      imageCacheRef.current[url] = img;
      renderGlobe();
    };
    img.onerror = () => {
      const fallbackImg = new Image();
      fallbackImg.src = url;
      fallbackImg.onload = () => {
        imageCacheRef.current[url] = fallbackImg;
        renderGlobe();
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

  useEffect(() => {
    if (selectedCountry) {
      const [lng, lat] = selectedCountry.coordinates;
      targetRotationRef.current = [-lng, -lat, 0];
    }
  }, [selectedCountry]);

  // Continuous Gentle Auto-Rotation (Smooth revolving)
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (targetRotationRef.current && !isDragging && !isTouchDraggingRef.current) {
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
      } else if (!isDragging && !isTouchDraggingRef.current && !selectedCountry) {
        setRotation((prev) => [prev[0] + 0.07, prev[1], 0]);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, selectedCountry]);

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

    // Warm cream background for light theme, dark space for dark theme
    ctx.fillStyle = isLightMode ? '#faf7f0' : '#06090e';
    ctx.fillRect(0, 0, width, height);

    const clampedZoom = Math.min(1.6, Math.max(0.75, zoomLevel));
    const radius = Math.min(width, height) * (width < 640 ? 0.46 : 0.44) * clampedZoom;
    const center: [number, number] = [width / 2, height / 2 + (width < 640 ? 0 : 10)];

    const projection = d3Geo
      .geoOrthographic()
      .scale(radius)
      .translate(center)
      .rotate(rotation)
      .clipAngle(90);

    const path = d3Geo.geoPath(projection, ctx);

    // 1. Ocean Sphere
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    ctx.fillStyle = isLightMode ? '#eef2f7' : '#090d16';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = isLightMode ? '#d5cbb9' : '#1e293b';
    ctx.stroke();

    // 2. Graticules
    const graticule = d3Geo.geoGraticule10();
    ctx.beginPath();
    path(graticule);
    ctx.strokeStyle = isLightMode ? 'rgba(214, 204, 187, 0.45)' : 'rgba(30, 41, 59, 0.45)';
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
          : 'rgba(15, 23, 42, 0.8)';
        ctx.lineWidth = isSelected ? 2 : isHovered ? 1.5 : 0.7;
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
          ctx.font = '700 9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = isLightMode ? '#1e293b' : 'rgba(255, 255, 255, 0.85)';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(matchedCountry.name, px, py);
        }
      });
    }

    // 5. Sleek LOGO-ONLY Badges
    Object.values(COUNTRIES_DATA).forEach((c) => {
      if (c.currentLeader) {
        const point = projection(c.coordinates);
        if (point && isPointVisible(c.coordinates, rotation)) {
          const [px, py] = point;
          drawLogoOnlyBadge(
            ctx,
            px,
            py - 18,
            c.currentLeader.logo,
            c.currentLeader.name
          );
        }
      }
    });

  }, [rotation, zoomLevel, worldData, hoveredCountry, selectedCountry, isLightMode]);

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

  const findCountryAtPoint = (px: number, py: number): { country: CountryInfo; clickedLogo?: boolean } | null => {
    const container = containerRef.current;
    if (!container || !worldData) return null;

    const width = container.clientWidth;
    const height = container.clientHeight;
    const clampedZoom = Math.min(1.6, Math.max(0.75, zoomLevel));
    const radius = Math.min(width, height) * (width < 640 ? 0.46 : 0.44) * clampedZoom;
    const center: [number, number] = [width / 2, height / 2 + (width < 640 ? 0 : 10)];

    const projection = d3Geo
      .geoOrthographic()
      .scale(radius)
      .translate(center)
      .rotate(rotation)
      .clipAngle(90);

    // Check direct click/hover on visible leader logo badges (26x26 hitbox)
    for (const c of Object.values(COUNTRIES_DATA)) {
      if (c.currentLeader && isPointVisible(c.coordinates, rotation)) {
        const point = projection(c.coordinates);
        if (point) {
          const [badgeX, badgeY] = [point[0], point[1] - 18];
          if (Math.hypot(badgeX - px, badgeY - py) <= 16) {
            return { country: c, clickedLogo: true };
          }
        }
      }
    }

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
    const canvas = canvasRef.current;
    if (!container || !worldData) return;

    if (isDragging && lastMousePosRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const clampedZoom = Math.min(1.6, Math.max(0.75, zoomLevel));
      const sensitivity = 0.35 / clampedZoom;

      setRotation((prev) => [
        prev[0] + dx * sensitivity,
        Math.max(-85, Math.min(85, prev[1] - dy * sensitivity)),
        0,
      ]);
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const hit = findCountryAtPoint(mouseX, mouseY);

      if (hit) {
        if (canvas) {
          canvas.style.cursor = hit.clickedLogo ? 'pointer' : 'pointer';
        }
        setHoveredCountry({
          name: hit.country.name,
          info: hit.country,
          x: mouseX,
          y: mouseY,
        });
      } else {
        if (canvas) {
          canvas.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
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
    if (e.touches.length === 1 && lastMousePosRef.current) {
      const touch = e.touches[0];
      const dx = touch.clientX - lastMousePosRef.current.x;
      const dy = touch.clientY - lastMousePosRef.current.y;

      if (Math.hypot(dx, dy) > 4) {
        isTouchDraggingRef.current = true;
      }

      const clampedZoom = Math.min(1.6, Math.max(0.75, zoomLevel));
      const sensitivity = 0.4 / clampedZoom;

      setRotation((prev) => [
        prev[0] + dx * sensitivity,
        Math.max(-85, Math.min(85, prev[1] - dy * sensitivity)),
        0,
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
      className={`relative h-full w-full select-none overflow-hidden flex items-center justify-center touch-none ${
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

      {/* Floating Tooltip with URL Preview & Direct Visit Link */}
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
                Unclaimed (${hoveredCountry.info?.minPrice || 1}). Tap to claim
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
