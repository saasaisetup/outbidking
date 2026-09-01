'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as d3Geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { COUNTRIES_DATA, CountryInfo } from '@/lib/pinitData';

interface GlobeProps {
  selectedCountry: CountryInfo | null;
  onSelectCountry: (country: CountryInfo) => void;
  zoomLevel: number;
}

// Pastel palette for beautiful world rendering matching pinit.lol
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

export function Globe({ selectedCountry, onSelectCountry, zoomLevel }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Rotation angles [lambda (yaw/long), phi (pitch/lat), gamma (roll)]
  const [rotation, setRotation] = useState<[number, number, number]>([-20, -15, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number } | null>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; info?: CountryInfo; x: number; y: number } | null>(null);

  // Target rotation for smooth animated transition when clicking a country
  const targetRotationRef = useRef<[number, number, number] | null>(null);

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

    const radius = Math.min(width, height) * 0.42 * zoomLevel;
    const center: [number, number] = [width / 2, height / 2];

    const projection = d3Geo
      .geoOrthographic()
      .scale(radius)
      .translate(center)
      .rotate(rotation)
      .clipAngle(90);

    const path = d3Geo.geoPath(projection, ctx);

    // 1. Draw Ocean Background with soft gradient
    ctx.beginPath();
    ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ebf7f5'; // Light cyan-tinted ocean
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#d4ece8';
    ctx.stroke();

    // 2. Draw Subtle Latitude / Longitude Graticules
    const graticule = d3Geo.geoGraticule10();
    ctx.beginPath();
    path(graticule);
    ctx.strokeStyle = 'rgba(180, 220, 215, 0.45)';
    ctx.lineWidth = 0.6;
    ctx.stroke();

    // 3. Draw Land Countries
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
          ctx.fillStyle = '#ff8a65'; // Vibrant coral highlight on selection
        } else if (isHovered) {
          ctx.fillStyle = '#ffd54f'; // Warm yellow highlight on hover
        } else if (matchedCountry && matchedCountry.currentLeader) {
          ctx.fillStyle = '#ffcdd2'; // Pinned country pastel rose
        } else {
          // Stable pastel color by index
          ctx.fillStyle = PASTEL_COLORS[idx % PASTEL_COLORS.length];
        }

        ctx.fill();

        // Border
        ctx.strokeStyle = isSelected ? '#d84315' : isHovered ? '#f57c00' : 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = isSelected ? 2 : isHovered ? 1.5 : 0.8;
        ctx.stroke();
      });

      // 4. Draw Country Labels on Visible Land Centroids
      countries.features.forEach((feature: any) => {
        const countryId = String(feature.id);
        const matchedCountry = Object.values(COUNTRIES_DATA).find(
          (c) => c.id === countryId || (c.id && countryId.padStart(3, '0') === c.id.padStart(3, '0'))
        );

        if (!matchedCountry) return;

        const projectedPoint = projection(matchedCountry.coordinates);
        if (projectedPoint && isPointVisible(matchedCountry.coordinates, rotation)) {
          const [px, py] = projectedPoint;

          // Country Label
          ctx.font = '600 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
          ctx.fillStyle = '#2c2523';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(matchedCountry.name, px, py);
        }
      });
    }

    // 5. Draw Floating Active Pinned Placements (Canada / outoutbid.lol)
    Object.values(COUNTRIES_DATA).forEach((c) => {
      if (c.currentLeader) {
        const point = projection(c.coordinates);
        if (point && isPointVisible(c.coordinates, rotation)) {
          const [px, py] = point;
          drawPinPill(ctx, px, py - 20, c.currentLeader.logo, `${c.currentLeader.name} — ev...`);
        }
      }
    });

  }, [rotation, zoomLevel, worldData, hoveredCountry, selectedCountry]);

  // Helper to test if a coordinate is on the visible front hemisphere
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

  // Draw floating pin pill above claimed countries
  function drawPinPill(ctx: CanvasRenderingContext2D, x: number, y: number, logoUrl: string, text: string) {
    const textWidth = ctx.measureText(text).width;
    const pillWidth = textWidth + 36;
    const pillHeight = 24;
    const radius = 12;

    ctx.save();
    // Pill background
    ctx.beginPath();
    ctx.roundRect(x - pillWidth / 2, y - pillHeight / 2, pillWidth, pillHeight, radius);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    ctx.strokeStyle = '#e8e0d5';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Small icon circle
    ctx.beginPath();
    ctx.arc(x - pillWidth / 2 + 12, y, 7, 0, 2 * Math.PI);
    ctx.fillStyle = '#FF5722';
    ctx.fill();

    // Pin text
    ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillStyle = '#1a1614';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x - pillWidth / 2 + 24, y);
    ctx.restore();
  }

  // Handle Drag & Rotation
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
      const sensitivity = 0.35 / zoomLevel;

      setRotation((prev) => [
        prev[0] + dx * sensitivity,
        Math.max(-85, Math.min(85, prev[1] - dy * sensitivity)),
        0,
      ]);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else {
      // Raycast country under mouse
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const radius = Math.min(width, height) * 0.42 * zoomLevel;
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

  // Handle Country Click
  const handleClick = (e: React.MouseEvent) => {
    if (hoveredCountry && hoveredCountry.info) {
      onSelectCountry(hoveredCountry.info);
    }
  };

  // Redraw when state changes
  useEffect(() => {
    renderGlobe();
  }, [renderGlobe]);

  // Window Resize
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
    >
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Floating Country Hover Tooltip */}
      {hoveredCountry && !isDragging && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-pin-md border border-[#272732] bg-[#1a1614] px-3 py-2 text-white shadow-xl backdrop-blur-sm"
          style={{
            left: `${hoveredCountry.x}px`,
            top: `${hoveredCountry.y - 12}px`,
          }}
        >
          <div className="flex items-center gap-1.5">
            {hoveredCountry.info?.flag && <span className="text-sm">{hoveredCountry.info.flag}</span>}
            <span className="font-extrabold text-xs text-white">{hoveredCountry.name}</span>
          </div>
          <p className="mt-0.5 text-[11px] text-[#a19994]">
            {hoveredCountry.info?.currentLeader
              ? `👑 ${hoveredCountry.info.currentLeader.name} ($${hoveredCountry.info.currentLeader.stake})`
              : 'Unclaimed. Click to be first'}
          </p>
        </div>
      )}
    </div>
  );
}
