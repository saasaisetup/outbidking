'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import { TerritoryState } from '@/lib/types';
import { Plus, Minus, RotateCcw, Crosshair } from 'lucide-react';

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
  const dragStartRef = useRef({ x: 0, y: 0, initialPanX: 0, initialPanY: 0, hasMoved: false });
  const [hoveredCountry, setHoveredCountry] = useState<TerritoryState | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const width = 1000;
  const height = 540;

  // 1. Compute D3 Geo Projection & SVG Paths
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

  // 2. Map territories by code, numericId, and numeric strings
  const territoryMap = useMemo(() => {
    const map: Record<string, TerritoryState> = {};
    territories.forEach((t) => {
      map[t.countryCode] = t;
      if (t.numericId) {
        const padded = String(t.numericId).padStart(3, '0');
        map[padded] = t;
        map[String(t.numericId)] = t;
        const num = parseInt(t.numericId, 10);
        if (!isNaN(num)) map[String(num)] = t;
      }
    });
    return map;
  }, [territories]);

  // 3. Projected Centroid Pins for Claimed Territories
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

  const oceanFleets = useMemo(() => {
    return countryPins.filter((p) => p.isOceanFleet);
  }, [countryPins]);

  const claimedLandPins = useMemo(() => {
    return countryPins.filter((p) => !p.isOceanFleet && p.currentRuler);
  }, [countryPins]);

  // -------------------------------------------------------------
  // TRAP NATIVE MOUSE WHEEL & PINCH GESTURES (Strict Map Zoom ONLY)
  // -------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
      setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.8), 8));
    };

    const handleNativeTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const handleGesture = (e: Event) => {
      e.preventDefault();
    };

    container.addEventListener('wheel', handleNativeWheel, { passive: false });
    container.addEventListener('touchmove', handleNativeTouchMove, { passive: false });
    container.addEventListener('gesturestart', handleGesture, { passive: false });
    container.addEventListener('gesturechange', handleGesture, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleNativeWheel);
      container.removeEventListener('touchmove', handleNativeTouchMove);
      container.removeEventListener('gesturestart', handleGesture);
      container.removeEventListener('gesturechange', handleGesture);
    };
  }, []);

  // -------------------------------------------------------------
  // Mouse Drag & Pan Handlers
  // -------------------------------------------------------------
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: pan.x,
      initialPanY: pan.y,
      hasMoved: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      if (Math.hypot(dx, dy) > 4) {
        dragStartRef.current.hasMoved = true;
      }
      setPan({
        x: dragStartRef.current.initialPanX + dx,
        y: dragStartRef.current.initialPanY + dy,
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

  // Touch Handlers
  const touchState = useRef<{ dist: number; startPan: { x: number; y: number }; startTouch: { x: number; y: number } }>({
    dist: 0,
    startPan: { x: 0, y: 0 },
    startTouch: { x: 0, y: 0 },
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchState.current.startPan = { ...pan };
      touchState.current.startTouch = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      dragStartRef.current.hasMoved = false;
    } else if (e.touches.length === 2) {
      touchState.current.dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - touchState.current.startTouch.x;
      const dy = e.touches[0].clientY - touchState.current.startTouch.y;
      if (Math.hypot(dx, dy) > 4) {
        dragStartRef.current.hasMoved = true;
      }
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
        setZoom((prev) => Math.min(Math.max(prev * factor, 0.8), 8));
      }
      touchState.current.dist = dist;
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.25, 8));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev * 0.8, 0.8));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getTerritoryForFeature = (featureId: string): TerritoryState | undefined => {
    const idStr = String(featureId);
    const padded = idStr.padStart(3, '0');
    return territoryMap[padded] || territoryMap[idStr];
  };

  const handleCountryClick = (territory: TerritoryState) => {
    if (!dragStartRef.current.hasMoved) {
      onSelectTerritory(territory);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="relative w-full h-full min-h-[580px] bg-[#070709] overflow-hidden select-none cursor-grab active:cursor-grabbing border-b border-zinc-900"
    >
      {/* Background Radar Grid */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#27272a 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Hardware-Accelerated SVG Map Canvas */}
      <div
        className="w-full h-full flex items-center justify-center will-change-transform origin-center"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transition: isDragging ? 'none' : 'transform 0.05s ease-out',
        }}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full max-w-[1300px] overflow-visible"
        >
          <defs>
            {/* Highlight selection glow */}
            <filter id="glow-selection" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ffffff" floodOpacity="1" />
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#ea6c52" floodOpacity="0.8" />
            </filter>
            <filter id="glow-hover" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffffff" floodOpacity="0.9" />
            </filter>
          </defs>

          {/* Oceans / Dark Base */}
          <rect width={width} height={height} fill="#070709" />

          {/* Layer 1: All 194 Country Territory Polygons with Rich Geographic Colors */}
          <g className="countries-layer">
            {countriesGeo.map((feat: any, idx: number) => {
              const featId = feat.id;
              const territory = getTerritoryForFeature(featId);
              const isSelected = selectedTerritory?.countryCode === territory?.countryCode;
              const isHovered = hoveredCountry?.countryCode === territory?.countryCode;

              // Rich territory fill color (either ruler's empire color, or country default palette color)
              let fillColor = territory?.currentRuler?.color || territory?.defaultColor || '#06b6d4';

              const pathD = pathGenerator(feat);
              if (!pathD) return null;

              return (
                <path
                  key={featId || idx}
                  d={pathD}
                  fill={fillColor}
                  stroke={isSelected ? '#ffffff' : (isHovered ? '#ffffff' : '#0e0e12')}
                  strokeWidth={isSelected ? 3 / zoom : (isHovered ? 1.8 / zoom : 0.65 / zoom)}
                  className="transition-colors duration-75 cursor-pointer hover:brightness-120"
                  style={{
                    filter: isSelected ? 'url(#glow-selection)' : (isHovered ? 'url(#glow-hover)' : undefined),
                  }}
                  onMouseEnter={() => territory && setHoveredCountry(territory)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (territory) {
                      handleCountryClick(territory);
                    }
                  }}
                />
              );
            })}
          </g>

          {/* Layer 2: 6 Strategic Ocean Fleet Patrol Corridors */}
          <g className="ocean-fleets-layer">
            {oceanFleets.map((fleet) => {
              const isClaimed = !!fleet.currentRuler;
              const isSelected = selectedTerritory?.countryCode === fleet.countryCode;
              const isHovered = hoveredCountry?.countryCode === fleet.countryCode;
              const ringColor = isClaimed ? fleet.currentRuler?.color : '#10b981';
              const cleanDomain = fleet.currentRuler?.url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
              const scale = Math.max(0.65, Math.min(1.3, 1 / Math.sqrt(zoom)));

              return (
                <g
                  key={fleet.countryCode}
                  transform={`translate(${fleet.x}, ${fleet.y}) scale(${scale})`}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredCountry(fleet)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCountryClick(fleet);
                  }}
                >
                  {/* Outer Dashed Radar Ring */}
                  <circle
                    r="19"
                    fill="rgba(16, 185, 129, 0.08)"
                    stroke={isSelected ? '#ffffff' : (ringColor || '#10b981')}
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    strokeDasharray="4 3"
                    className="group-hover:scale-110 transition-transform"
                    style={{
                      filter: isSelected ? 'url(#glow-selection)' : undefined,
                    }}
                  />
                  {/* Center Naval Insignia */}
                  <circle
                    r="11"
                    fill="#0e0e12"
                    stroke={isSelected ? '#ffffff' : (ringColor || '#10b981')}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fontSize="10"
                  >
                    {fleet.flag}
                  </text>

                  {/* Label Pill */}
                  <g transform="translate(0, 23)">
                    <rect
                      x="-38"
                      y="-7"
                      width="76"
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
                      fill={isClaimed ? '#f4f4f5' : '#10b981'}
                      fontSize="7.5"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {isClaimed ? cleanDomain : `Unclaimed · $${fleet.currentBid}`}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Layer 3: Pinned Sovereign Logo Badges & Domain Labels */}
          <g className="pins-layer pointer-events-none">
            {claimedLandPins.map((pin) => {
              if (!pin.currentRuler) return null;
              const ruler = pin.currentRuler;
              const isSelected = selectedTerritory?.countryCode === pin.countryCode;
              const cleanDomain = ruler.url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
              const pinScale = Math.max(0.65, Math.min(1.35, 1 / Math.sqrt(zoom)));

              return (
                <g
                  key={pin.countryCode}
                  transform={`translate(${pin.x}, ${pin.y}) scale(${pinScale})`}
                  className="cursor-pointer pointer-events-auto group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCountryClick(pin);
                  }}
                >
                  {/* Floating Logo Badge Container */}
                  <g transform="translate(-16, -24)">
                    <rect
                      x="0"
                      y="0"
                      width="32"
                      height="32"
                      rx="8"
                      fill="#0e0e12"
                      stroke={isSelected ? '#ffffff' : (ruler.color || '#ea6c52')}
                      strokeWidth={isSelected ? '3' : '2'}
                      className="filter drop-shadow-md group-hover:scale-105 transition-transform"
                      style={{
                        filter: isSelected ? 'url(#glow-selection)' : undefined,
                      }}
                    />

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
                        fontSize="11"
                        fontWeight="900"
                        fontFamily="monospace"
                      >
                        {pin.countryCode}
                      </text>
                    )}
                  </g>

                  {/* Domain Label Underneath */}
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

      {/* Hover Country Tooltip */}
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

      {/* Bottom Tactical Status Bar */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none z-10 px-4">
        <div className="px-4 py-1.5 rounded-full bg-[#0a0a0d]/90 backdrop-blur-md border border-zinc-800/80 text-[10px] sm:text-xs font-mono font-bold tracking-wider text-emerald-400/90 flex items-center gap-2 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>DRAG TO PAN · SCROLL TO ZOOM · TAP A COUNTRY TO CONQUER</span>
        </div>
      </div>
    </div>
  );
}
