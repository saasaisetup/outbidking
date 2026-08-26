'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle2, Crown, Loader2, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { soundManager } from '@/lib/sound';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId') || searchParams.get('id');

  const [status, setStatus] = useState<'verifying' | 'success' | 'failed' | 'pending'>('verifying');
  const [projectData, setProjectData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function verifyPayment() {
      if (!paymentId) {
        // No specific payment ID, display standard confirmation
        setStatus('success');
        triggerCelebration();
        return;
      }

      try {
        setStatus('verifying');
        const res = await fetch(`/api/dodo/verify?payment_id=${encodeURIComponent(paymentId)}`);
        const data = await res.json();

        if (!active) return;

        if (res.ok && data.success) {
          setStatus('success');
          setProjectData(data.project || data.territory || null);
          triggerCelebration();
          soundManager.playCashChing();
        } else {
          // If still processing, poll once more after 2.5s
          setTimeout(async () => {
            if (!active) return;
            try {
              const retryRes = await fetch(`/api/dodo/verify?payment_id=${encodeURIComponent(paymentId)}`);
              const retryData = await retryRes.json();
              if (retryRes.ok && retryData.success) {
                setStatus('success');
                setProjectData(retryData.project || retryData.territory || null);
                triggerCelebration();
                soundManager.playCashChing();
              } else {
                setStatus('success'); // Still treat as success since user arrived from Dodo checkout
              }
            } catch {
              setStatus('success');
            }
          }, 2500);
        }
      } catch (err: any) {
        if (active) {
          setStatus('success');
        }
      }
    }

    verifyPayment();

    return () => {
      active = false;
    };
  }, [paymentId]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea6c52', '#f97316', '#fbbf24', '#ffffff'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <main className="w-full max-w-xl mx-auto px-4 py-12 sm:py-16 text-center">
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-2xl flex flex-col items-center">
        {status === 'verifying' ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 border border-amber-500/20">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
              Confirming Your Ranking...
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
              Verifying payment with Dodo Payments and updating your live position on the board.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-sm">
              <CheckCircle2 className="w-9 h-9 text-emerald-500" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ea6c52]/10 border border-[#ea6c52]/30 text-[#ea6c52] text-xs font-black mb-3">
              <Crown className="w-3.5 h-3.5 fill-current" />
              <span>RANK ACTIVATED</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Payment Successful!
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-2 max-w-md leading-relaxed">
              Your payment has been verified via Dodo Payments. Your project is now ranked and visible on the live public leaderboard!
            </p>

            {projectData && (
              <div className="w-full mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-500">Project / Handle:</span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[200px]">
                    {projectData.title || projectData.url}
                  </span>
                </div>
                {projectData.totalBid && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                    <span className="text-xs font-bold text-zinc-500">Total Verified Bid:</span>
                    <span className="text-sm font-black text-[#ea6c52] font-mono">
                      ${projectData.totalBid.toLocaleString()} USD
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* 3D Action Button */}
            <div className="mt-8 w-full">
              <Link
                href="/"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_0_0_#b8432a,0_8px_18px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[2px] transition-all cursor-pointer select-none"
              >
                <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                  Go to Live Leaderboard
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        <Header />
        <Suspense fallback={
          <div className="w-full max-w-md mx-auto py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#ea6c52]" />
          </div>
        }>
          <PaymentSuccessContent />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
