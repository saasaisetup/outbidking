'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { TerritoryState } from '@/lib/types';
import { Plus, Minus, Crosshair, RotateCcw } from 'lucide-react';

interface WorldWarMapProps {
  territories: TerritoryState[];
  selectedTerritory?: TerritoryState | null;
  onSelectTerritory: (territory: TerritoryState) => void;
}

export function WorldWarMap({
  territories,
  selectedTerritory,
  onSelectTerritory,
}: WorldWarMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<TerritoryState | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    initialPanX: 0,
    initialPanY: 0,
    hasMoved: false,
    isPointerDown: false,
  });

  const width = 1000;
  const height = 540;

  const { countriesGeo, projection, pathGenerator } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countriesFeature = feature(worldData as any, worldData.objects.countries as any) as any;
    const proj = geoEqualEarth().fitSize([width, height], countriesFeature);
    const pathGen = geoPath().projection(proj);

    return {
      countriesGeo: countriesFeature.features,
      projection: proj,
      pathGenerator: pathGen,
    };
  }, []);

  const territoryMap = useMemo(() => {
    const map: Record<string, TerritoryState> = {};
    territories.forEach((t) => {
      map[t.countryCode] = t;
      if (t.numericId) {
        const padded = String(t.numericId).padStart(3, '0');
        map[padded] = t;
        map[String(t.numericId)] = t;
      }
    });
    return map;
  }, [territories]);

  const countryPins = useMemo(() => {
    return territories.map((t) => {
      let xy: [number, number] | null = null;
      if (t.coordinates && projection) {
        xy = projection(t.coordinates);
      }
      return {
        ...t,
        x: xy ? xy[0] : 0,
        y: xy ? xy[1] : 0,
        hasXY: !!xy,
      };
    }).filter((p) => p.hasXY);
  }, [territories, projection]);

  const oceanFleets = useMemo(() => countryPins.filter((p) => p.isOceanFleet), [countryPins]);
  const claimedLandPins = useMemo(() => countryPins.filter((p) => !p.isOceanFleet && p.currentRuler), [countryPins]);

  const clampPan = useCallback((newX: number, newY: number, currentZoom: number) => {
    const maxBoundX = (width * currentZoom) / 1.6 + 250;
    const maxBoundY = (height * currentZoom) / 1.6 + 180;
    return {
      x: Math.max(-maxBoundX, Math.min(maxBoundX, newX)),
      y: Math.max(-maxBoundY, Math.min(maxBoundY, newY)),
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left - rect.width / 2;
      const cursorY = e.clientY - rect.top - rect.height / 2;

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      setZoom((prevZoom) => {
        const nextZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.8), 9);
        const scaleChange = nextZoom / prevZoom;

        setPan((prevPan) => {
          const nextPanX = cursorX - (cursorX - prevPan.x) * scaleChange;
          const nextPanY = cursorY - (cursorY - prevPan.y) * scaleChange;
          return clampPan(nextPanX, nextPanY, nextZoom);
        });

        return nextZoom;
      });
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [clampPan]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
      hasMoved: false,
      isPointerDown: true,
    };
    setIsDragging(true);
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!dragRef.current.isPointerDown) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.hypot(dx, dy) > 4) dragRef.current.hasMoved = true;
      setPan(clampPan(dragRef.current.initialPanX + dx, dragRef.current.initialPanY + dy, zoom));
    };

    const handleGlobalPointerUp = () => {
      if (dragRef.current.isPointerDown) {
        dragRef.current.isPointerDown = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [zoom, clampPan]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const handleZoomIn = () => setZoom((prev) => {
    const next = Math.min(prev * 1.3, 9);
    setPan((p) => clampPan(p.x, p.y, next));
    return next;
  });

  const handleZoomOut = () => setZoom((prev) => {
    const next = Math.max(prev * 0.77, 0.8);
    setPan((p) => clampPan(p.x, p.y, next));
    return next;
  });

  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const getTerritoryForFeature = (featureId: string): TerritoryState | undefined => {
    const idStr = String(featureId);
    return territoryMap[idStr.padStart(3, '0')] || territoryMap[idStr];
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full min-h-[600px] bg-[#07070b] overflow-hidden select-none cursor-grab active:cursor-grabbing touch-none"
    >
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#3f3f46 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="w-full h-full flex items-center justify-center will-change-transform origin-center"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.08s ease-out',
        }}
      >
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-w-[1500px] overflow-visible">
          <defs>
            <filter id="glow-country-hover" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.8" />
            </filter>
            <filter id="glow-country-select" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffffff" floodOpacity="1" />
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ea6c52" floodOpacity="0.9" />
            </filter>
          </defs>
          <rect x="-1000" y="-1000" width={width + 2000} height={height + 2000} fill="#07070b" />
          <g className="countries-layer">
            {countriesGeo.map((feat: any, idx: number) => {
              const featId = feat.id;
              const territory = getTerritoryForFeature(featId);
              const isSelected = selectedTerritory?.countryCode === territory?.countryCode;
              const isHovered = hoveredCountry?.countryCode === territory?.countryCode;
              const fillColor = territory?.currentRuler?.color || territory?.defaultColor || '#06b6d4';
              const pathD = pathGenerator(feat);
              if (!pathD) return null;
              return (
                <path
                  key={featId || idx}
                  d={pathD}
                  fill={fillColor}
                  stroke={isSelected ? '#ffffff' : (isHovered ? '#ffffff' : '#0c0d12')}
                  strokeWidth={isSelected ? 2.5 / zoom : (isHovered ? 1.6 / zoom : 0.6 / zoom)}
                  className="transition-colors duration-75 cursor-pointer hover:brightness-125"
                  style={{ filter: isSelected ? 'url(#glow-country-select)' : (isHovered ? 'url(#glow-country-hover)' : undefined) }}
                  onMouseEnter={() => territory && setHoveredCountry(territory)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={(e) => { e.stopPropagation(); if (territory && !dragRef.current.hasMoved) onSelectTerritory(territory); }}
                />
              );
            })}
          </g>
          <g className="ocean-fleets-layer">
            {oceanFleets.map((fleet) => {
              const isClaimed = !!fleet.currentRuler;
              const isSelected = selectedTerritory?.countryCode === fleet.countryCode;
              const ringColor = isClaimed ? fleet.currentRuler?.color : fleet.defaultColor || '#10b981';
              const scale = Math.max(0.65, Math.min(1.2, 1 / Math.sqrt(zoom)));
              return (
                <g key={fleet.countryCode} transform={`translate(${fleet.x}, ${fleet.y}) scale(${scale})`} className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); if (!dragRef.current.hasMoved) onSelectTerritory(fleet); }}>
                  <circle r="18" fill="rgba(16, 185, 129, 0.08)" stroke={isSelected ? '#ffffff' : ringColor} strokeWidth={isSelected ? '2.5' : '1.5'} strokeDasharray="4 3" className="group-hover:scale-110 transition-transform" style={{ filter: isSelected ? 'url(#glow-country-select)' : undefined }} />
                  <circle r="11" fill="#0a0a0f" stroke={isSelected ? '#ffffff' : ringColor} strokeWidth="1.5" />
                  <text textAnchor="middle" dominantBaseline="central" fontSize="11" className="select-none pointer-events-none">{fleet.flag || '⚓'}</text>
                  <g transform="translate(0, 24)">
                    <rect x="-38" y="-7" width="76" height="14" rx="7" fill="#0e0e13" stroke={isSelected ? '#ffffff' : ringColor} strokeWidth="1" />
                    <text textAnchor="middle" dominantBaseline="central" fontSize="8" fontFamily="monospace" fontWeight="bold" fill={isClaimed ? '#ffffff' : '#34d399'}>{isClaimed ? `$${fleet.currentBid}` : `$${fleet.currentBid || 25}`}</text>
                  </g>
                </g>
              );
            })}
          </g>
          <g className="claimed-pins-layer pointer-events-none">
            {claimedLandPins.map((pin) => {
              const ruler = pin.currentRuler;
              if (!ruler) return null;
              const scale = Math.max(0.6, Math.min(1.1, 1 / Math.sqrt(zoom)));

              return (
                <g
                  key={`pin-${pin.countryCode}`}
                  transform={`translate(${pin.x}, ${pin.y}) scale(${scale})`}
                  className="transition-transform duration-100"
                >
                  <g transform="translate(-16, -34)">
                    <rect
                      width="32"
                      height="32"
                      rx="9"
                      fill="#0d0d12"
                      stroke={ruler.color || '#ea6c52'}
                      strokeWidth="2"
                      style={{
                        filter: `drop-shadow(0 4px 8px ${ruler.color || '#ea6c52'}66)`,
                      }}
                    />
                    {ruler.logoUrl ? (
                      <image
                        href={ruler.logoUrl}
                        x="4"
                        y="4"
                        width="24"
                        height="24"
                        preserveAspectRatio="xMidYMid meet"
                      />
                    ) : (
                      <text
                        x="16"
                        y="17"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="13"
                      >
                        {pin.flag}
                      </text>
                    )}
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Hover Tooltip */}
      {hoveredCountry && (
        <div
          className="absolute pointer-events-none z-30 px-3 py-2 rounded-xl bg-[#0f0f14]/95 backdrop-blur-md border border-zinc-700/80 shadow-2xl text-white font-mono text-xs animate-in fade-in duration-75"
          style={{
            left: `${Math.min(mousePos.x + 15, (containerRef.current?.clientWidth || 800) - 220)}px`,
            top: `${Math.min(mousePos.y + 15, (containerRef.current?.clientHeight || 600) - 100)}px`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{hoveredCountry.flag}</span>
            <span className="font-black text-sm">{hoveredCountry.countryName}</span>
            <span className="text-[10px] text-zinc-400 font-bold px-1 rounded bg-zinc-800">
              {hoveredCountry.countryCode}
            </span>
          </div>

          {hoveredCountry.currentRuler ? (
            <div className="text-[11px] text-zinc-300 space-y-0.5">
              <p className="flex items-center gap-1.5 font-bold">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: hoveredCountry.currentRuler.color }}
                />
                <span className="text-white">{hoveredCountry.currentRuler.title}</span>
                <span className="text-amber-400 font-bold">(${hoveredCountry.currentBid})</span>
              </p>
              <p className="text-zinc-400 text-[10px]">
                Click to Outbid (${hoveredCountry.minOutbidPrice})
              </p>
            </div>
          ) : (
            <div className="text-[11px] text-emerald-400 font-bold">
              🌱 Unclaimed · Click to Conquer (${hoveredCountry.currentBid || (hoveredCountry.isOceanFleet ? 25 : 3)})
            </div>
          )}
        </div>
      )}

      {/* Floating Zoom & Pan Controls (Top Right) */}
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5 bg-[#0e0e12]/90 backdrop-blur-md border border-zinc-800 p-1.5 rounded-2xl shadow-xl">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          title="Zoom In (+)"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          title="Zoom Out (-)"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          title="Reset Position"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Status Bar */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10 px-4">
        <div className="px-4 py-1.5 rounded-full bg-[#0a0a0d]/90 backdrop-blur-md border border-zinc-800/80 text-[10px] sm:text-xs font-mono font-bold tracking-wider text-emerald-400/90 flex items-center gap-2 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>DRAG TO PAN · SCROLL TO ZOOM · TAP A COUNTRY TO CONQUER</span>
        </div>
      </div>
    </div>
  );
}
