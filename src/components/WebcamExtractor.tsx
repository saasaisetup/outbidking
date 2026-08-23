'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, Sparkles } from 'lucide-react';

interface WebcamExtractorProps {
  onCapture: (dataUrl: string) => void;
  onCancel?: () => void;
}

export function WebcamExtractor({ onCapture, onCancel }: WebcamExtractorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      try {
        setIsLoading(true);
        setError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 400, height: 400, facingMode: 'user' },
          audio: false,
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.error('[Webcam] Access error:', err);
        setError('Camera access denied or unavailable. Please enable permissions.');
      } finally {
        setIsLoading(false);
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Center crop square
    const video = videoRef.current;
    const minDim = Math.min(video.videoWidth, video.videoHeight);
    const startX = (video.videoWidth - minDim) / 2;
    const startY = (video.videoHeight - minDim) / 2;

    ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const handleApply = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300">
          <Camera className="w-3.5 h-3.5 text-emerald-400" />
          <span>Webcam Live Selfie & Avatar Capture</span>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-zinc-500 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Viewport */}
      <div className="relative w-48 h-48 rounded-2xl bg-black border border-zinc-800 overflow-hidden flex items-center justify-center shadow-inner">
        {error ? (
          <div className="p-3 text-center text-xs text-red-400 font-medium">
            {error}
          </div>
        ) : capturedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage}
            alt="Captured avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover scale-x-[-1]"
          />
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs text-zinc-400">
            Starting camera...
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full flex items-center justify-center gap-2 pt-1">
        {capturedImage ? (
          <>
            <button
              type="button"
              onClick={retake}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-bold text-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Use Photo</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={isLoading || !!error}
            onClick={takeSnapshot}
            className="px-5 py-2 rounded-xl bg-[#e05d44] hover:bg-[#c94b33] disabled:opacity-40 text-xs font-bold text-white flex items-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Snap Photo</span>
          </button>
        )}
      </div>
    </div>
  );
}
