'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RotateCcw, Check, Sparkles, Trash2, PenTool } from 'lucide-react';

interface HandwritingCanvasProps {
  onSave: (dataUrl: string) => void;
  onCancel?: () => void;
}

export function HandwritingCanvas({ onSave, onCancel }: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  const [hasDrawn, setHasDrawn] = useState(false);

  const colors = [
    { name: 'White', hex: '#ffffff' },
    { name: 'Terracotta', hex: '#e05d44' },
    { name: 'Emerald', hex: '#4ade80' },
    { name: 'Gold', hex: '#facc15' },
    { name: 'Cyan', hex: '#38bdf8' },
    { name: 'Purple', hex: '#c084fc' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set background to transparent or dark slate
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
          <PenTool className="w-3.5 h-3.5 text-[#e05d44]" />
          <span>Handwriting & Signature Canvas</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">Draw with mouse / finger</span>
      </div>

      {/* Canvas Viewport */}
      <div className="relative w-full h-44 rounded-xl bg-[#110f0d] border border-zinc-800 overflow-hidden cursor-crosshair flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={180}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full touch-none"
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-zinc-600 text-xs font-medium">
            ✍️ Sign or draw your avatar here
          </div>
        )}
      </div>

      {/* Tools & Palette */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {colors.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setColor(c.hex)}
              style={{ backgroundColor: c.hex }}
              className={`w-5 h-5 rounded-full transition-transform cursor-pointer ${
                color === c.hex ? 'scale-125 ring-2 ring-white' : 'opacity-80 hover:opacity-100'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Stroke width */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <button
            type="button"
            onClick={() => setLineWidth(2)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${lineWidth === 2 ? 'bg-[#e05d44] text-white' : 'bg-zinc-800 text-zinc-400'}`}
          >
            Thin
          </button>
          <button
            type="button"
            onClick={() => setLineWidth(4)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${lineWidth === 4 ? 'bg-[#e05d44] text-white' : 'bg-zinc-800 text-zinc-400'}`}
          >
            Medium
          </button>
          <button
            type="button"
            onClick={() => setLineWidth(7)}
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${lineWidth === 7 ? 'bg-[#e05d44] text-white' : 'bg-zinc-800 text-zinc-400'}`}
          >
            Thick
          </button>
        </div>

        {/* Clear & Apply */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Clear canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!hasDrawn}
            onClick={handleApply}
            className="px-3 py-1 rounded-lg bg-[#e05d44] hover:bg-[#c94b33] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            <Check className="w-3 h-3" />
            <span>Use Drawing</span>
          </button>
        </div>
      </div>
    </div>
  );
}
