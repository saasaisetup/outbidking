'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { TerritoryState } from '@/lib/types';
import { WORLD_COUNTRIES } from '@/lib/worldData';
import { Plus, Minus, RotateCcw, Crosshair, Sparkles } from 'lucide-react';

interface WorldWarMapProps {
  territories: TerritoryState[];
  onSelectTerritory: (territory: TerritoryState) => void;
}

export function WorldWarMap({
  territories,
  onSelectTerritory,
}: WorldWarMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<TerritoryState | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Map dimensions
  const width = 1000;
  const height = 540;

  // Compute D3 Geo Projection & SVG Paths
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

  // Map territories by numeric ID and code
  const territoryMap = useMemo(() => {
    const map: Record<string, TerritoryState> = {};
    territories.forEach((t) => {
      map[t.countryCode] = t;
      if (t.numericId) {
        // Pad with leading zeroes to match 3-digit TopoJSON IDs (e.g. "076", "840")
        const padded = t.numericId.padStart(3, '0');
        map[padded] = t;
        map[t.numericId] = t;
      }
    });
    return map;
  }, [territories]);

  // Compute Centroid Coordinates for Pinned Logos
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

  // -------------------------------------------------------------
  // Pan and Zoom Event Handlers (Mouse Wheel, Drag, Touch Pinch)
  // -------------------------------------------------------------

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.75), 10));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Handlers for Mobile Pinch & Pan
  const touchState = useRef<{ dist: number; startPan: { x: number; y: number }; startTouch: { x: number; y: number } }>({
    dist: 0,
    startPan: { x: 0, y: 0 },
    startTouch: { x: 0, y: 0 },
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchState.current.startPan = { ...pan };
      touchState.current.startTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchState.current.dist = dist;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchState.current.startTouch.x;
      const dy = e.touches[0].clientY - touchState.current.startTouch.y;
      setPan({
        x: touchState.current.startPan.x + dx,
        y: touchState.current.startPan.y + dy,
      });
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchState.current.dist > 0) {
        const factor = dist / touchState.current.dist;
        setZoom((prev) => Math.min(Math.max(prev * factor, 0.75), 10));
      }
      touchState.current.dist = dist;
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.3, 10));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev * 0.7, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Helper to find territory from feature ID
  const getTerritoryForFeature = (featureId: string): TerritoryState | undefined => {
    const idStr = String(featureId);
    const padded = idStr.padStart(3, '0');
    return territoryMap[padded] || territoryMap[idStr];
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={`relative w-full h-[82vh] min-h-[500px] max-h-[920px] bg-[#070709] overflow-hidden select-none cursor-grab active:cursor-grabbing border-b border-zinc-900`}
    >
      {/* Background World Grid Overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#27272a 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Interactive Map Transform Layer */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75 origin-center will-change-transform"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-w-[1200px] overflow-visible"
        >
          <defs>
            {/* Glow filters for country selection */}
            <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" />
            </filter>
            <filter id="glow-orange" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ea6c52" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Oceans / Sphere Background */}
          <rect width={width} height={height} fill="#070709" />

          {/* Render All Country Polygons */}
          <g className="countries-layer">
            {countriesGeo.map((feat: any, idx: number) => {
              const featId = feat.id;
              const territory = getTerritoryForFeature(featId);
              const isClaimed = !!territory?.currentRuler;
              const isHovered = hoveredCountry?.countryCode === territory?.countryCode;

              // Color determination
              let fillColor = '#101613'; // Unclaimed radar dark green
              if (isClaimed && territory?.currentRuler?.color) {
                fillColor = territory.currentRuler.color;
              }

              const pathD = pathGenerator(feat);
              if (!pathD) return null;

              return (
                <path
                  key={featId || idx}
                  d={pathD}
                  fill={fillColor}
                  stroke={isHovered ? '#ffffff' : (isClaimed ? '#18181b' : '#1b2a21')}
                  strokeWidth={isHovered ? 1.8 / zoom : 0.6 / zoom}
                  className="transition-colors duration-150 cursor-pointer hover:brightness-125"
                  style={{
                    filter: isHovered ? 'url(#glow-orange)' : undefined,
                  }}
                  onMouseEnter={() => territory && setHoveredCountry(territory)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (territory) {
                      onSelectTerritory(territory);
                    }
                  }}
                />
              );
            })}
          </g>

          {/* Pinned Logo Badges & Domain Labels */}
          <g className="pins-layer pointer-events-none">
            {countryPins.map((pin) => {
              if (!pin.currentRuler) return null;

              const ruler = pin.currentRuler;
              const cleanDomain = ruler.url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
              const pinScale = Math.max(0.6, Math.min(1.4, 1 / Math.sqrt(zoom)));

              return (
                <g
                  key={pin.countryCode}
                  transform={`translate(${pin.x}, ${pin.y}) scale(${pinScale})`}
                  className="cursor-pointer pointer-events-auto group"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTerritory(pin);
                  }}
                >
                  {/* Floating Logo Badge Container */}
                  <g transform="translate(-16, -24)">
                    {/* Squircle Background */}
                    <rect
                      x="0"
                      y="0"
                      width="32"
                      height="32"
                      rx="8"
                      fill="#0e0e12"
                      stroke={ruler.color || '#ea6c52'}
                      strokeWidth="2"
                      className="shadow-lg filter drop-shadow-md"
                    />

                    {/* Logo Image */}
                    {ruler.logoUrl ? (
                      <image
                        href={ruler.logoUrl}
                        x="4"
                        y="4"
                        width="24"
                        height="24"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath="inset(0px round 6px)"
                      />
                    ) : (
                      <text
                        x="16"
                        y="20"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="900"
                        fontFamily="monospace"
                      >
                        {pin.countryCode}
                      </text>
                    )}
                  </g>

                  {/* Domain Pill Label Underneath */}
                  <g transform="translate(0, 15)">
                    <rect
                      x={-(cleanDomain.length * 3.5 + 8)}
                      y="-7"
                      width={cleanDomain.length * 7 + 16}
                      height="14"
                      rx="4"
                      fill="#000000"
                      fillOpacity="0.85"
                      stroke="#27272a"
                      strokeWidth="0.75"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill="#f4f4f5"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="monospace"
                      letterSpacing="0.02em"
                    >
                      {cleanDomain}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Floating Hover Country Tooltip */}
      {hoveredCountry && (
        <div
          className="absolute pointer-events-none z-30 px-3 py-2 rounded-xl bg-[#0f0f14]/95 backdrop-blur-md border border-zinc-700/80 shadow-2xl text-white font-mono text-xs animate-in fade-in zoom-in-95 duration-100"
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
              🌱 Unclaimed Land · Click to Conquer (${hoveredCountry.currentBid || 3})
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

      {/* Bottom Tactical Helper Bar */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10 px-4">
        <div className="px-4 py-1.5 rounded-full bg-[#0a0a0d]/90 backdrop-blur-md border border-zinc-800/80 text-[10px] sm:text-xs font-mono font-bold tracking-wider text-emerald-400/90 flex items-center gap-2 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>DRAG TO PAN · SCROLL TO ZOOM · TAP A COUNTRY TO CONQUER</span>
        </div>
      </div>
    </div>
  );
}
