'use client';

import React, { useState } from 'react';
import { Globe, PenTool, Camera, Upload, Sparkles, Check } from 'lucide-react';
import { HandwritingCanvas } from './HandwritingCanvas';
import { WebcamExtractor } from './WebcamExtractor';

interface AvatarCreationSuiteProps {
  currentAvatar: string | null;
  onAvatarChange: (avatarUrl: string) => void;
  domain?: string;
}

export function AvatarCreationSuite({
  currentAvatar,
  onAvatarChange,
  domain,
}: AvatarCreationSuiteProps) {
  const [activeTab, setActiveTab] = useState<'favicon' | 'handwriting' | 'webcam' | 'upload'>('favicon');
  const [isCapturingWebcam, setIsCapturingWebcam] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onAvatarChange(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUseFavicon = () => {
    if (domain) {
      const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
      onAvatarChange(faviconUrl);
    }
  };

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-[#13110e] border border-zinc-200 dark:border-[#2a2620]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#e05d44]" />
          <span>Listing Icon & Avatar Creator</span>
        </label>
        <span className="text-[10px] font-mono text-zinc-400">
          Favicon · Signature · Webcam · Upload
        </span>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-zinc-200/70 dark:bg-[#1f1b17] text-xs font-semibold text-zinc-600 dark:text-zinc-400">
        <button
          type="button"
          onClick={() => {
            setActiveTab('favicon');
            setIsDrawing(false);
            setIsCapturingWebcam(false);
            handleUseFavicon();
          }}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] transition-colors cursor-pointer ${
            activeTab === 'favicon' ? 'bg-white dark:bg-[#2e2822] text-zinc-900 dark:text-white shadow-2xs font-bold' : 'hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Globe className="w-3 h-3 text-blue-500" />
          <span className="hidden sm:inline">Favicon</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('handwriting');
            setIsDrawing(true);
            setIsCapturingWebcam(false);
          }}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] transition-colors cursor-pointer ${
            activeTab === 'handwriting' ? 'bg-white dark:bg-[#2e2822] text-zinc-900 dark:text-white shadow-2xs font-bold' : 'hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <PenTool className="w-3 h-3 text-[#e05d44]" />
          <span className="hidden sm:inline">Handwrite</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('webcam');
            setIsCapturingWebcam(true);
            setIsDrawing(false);
          }}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] transition-colors cursor-pointer ${
            activeTab === 'webcam' ? 'bg-white dark:bg-[#2e2822] text-zinc-900 dark:text-white shadow-2xs font-bold' : 'hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Camera className="w-3 h-3 text-emerald-500" />
          <span className="hidden sm:inline">Webcam</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('upload');
            setIsDrawing(false);
            setIsCapturingWebcam(false);
          }}
          className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[11px] transition-colors cursor-pointer ${
            activeTab === 'upload' ? 'bg-white dark:bg-[#2e2822] text-zinc-900 dark:text-white shadow-2xs font-bold' : 'hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Upload className="w-3 h-3 text-amber-500" />
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'handwriting' && (
        <HandwritingCanvas
          onSave={(dataUrl) => {
            onAvatarChange(dataUrl);
            setActiveTab('favicon');
          }}
        />
      )}

      {activeTab === 'webcam' && (
        <WebcamExtractor
          onCapture={(dataUrl) => {
            onAvatarChange(dataUrl);
            setActiveTab('favicon');
          }}
        />
      )}

      {activeTab === 'upload' && (
        <div className="w-full p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center gap-2 bg-white dark:bg-[#181512]">
          <Upload className="w-6 h-6 text-zinc-400" />
          <span className="text-xs text-zinc-500 font-medium">Upload custom logo or image (PNG, JPG, SVG)</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="text-xs text-zinc-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#e05d44] file:text-white cursor-pointer"
          />
        </div>
      )}

      {/* Current Avatar Preview Bar */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#181512] border border-zinc-200 dark:border-[#38332c]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 flex items-center justify-center overflow-hidden">
            {currentAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentAvatar}
                alt="Selected icon"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <Globe className="w-4 h-4 text-zinc-400" />
            )}
          </div>
          <div className="text-xs">
            <div className="font-bold text-zinc-900 dark:text-white">Active Avatar</div>
            <div className="text-[10px] text-zinc-400">Ready to display on leaderboard</div>
          </div>
        </div>
        <div className="text-xs text-emerald-500 font-bold flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>Active</span>
        </div>
      </div>
    </div>
  );
}
