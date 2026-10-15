import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Send
} from 'lucide-react';
import { LOGO_URL } from './TelegramModal';

interface HeroProps {
  onExploreBatches: () => void;
  onOpenTelegram: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreBatches, onOpenTelegram }) => {
  return (
    <section className="relative overflow-hidden pt-4 pb-8 sm:pt-12 sm:pb-16 border-b border-pink-950/40">
      {/* Background ambient glowing pink blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-pink-600/20 via-pink-500/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[11px] sm:text-xs font-black tracking-wide uppercase shadow-sm mb-4 sm:mb-6 animate-pulse-glow">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>100% Free Educational Portal</span>
          </div>

          {/* Logo Badge */}
          <div className="relative mb-3 sm:mb-5">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl p-0.5 sm:p-1 bg-gradient-to-tr from-pink-600 via-rose-500 to-pink-400 shadow-[0_0_40px_rgba(236,72,153,0.35)]">
              <img
                src={LOGO_URL}
                alt="GB STUDY"
                className="w-full h-full object-cover rounded-[14px] sm:rounded-[22px]"
              />
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] mb-2 sm:mb-4">
            Welcome to <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-pink-500 bg-clip-text text-transparent">GB STUDY</span>
          </h1>

          <p className="text-xs sm:text-base text-zinc-300 font-medium leading-relaxed max-w-xl mb-5 sm:mb-7 px-2">
            Free access to complete Class 10th &amp; 12th batches, recorded video classes, and handwritten PDF notes.
          </p>

          {/* Action CTAs in Pink Theme */}
          <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full sm:w-auto mb-6 sm:mb-10">
            <button
              onClick={onExploreBatches}
              className="flex-1 sm:flex-initial py-3 px-6 sm:py-3.5 sm:px-8 rounded-2xl bg-gradient-to-r from-pink-600 via-pink-500 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm tracking-wide uppercase shadow-xl shadow-pink-500/35 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Let&apos;s Study</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={onOpenTelegram}
              className="flex-1 sm:flex-initial py-3 px-4 sm:py-3.5 sm:px-7 rounded-2xl bg-[#120815] hover:bg-zinc-900 border border-pink-500/40 hover:border-pink-500 text-pink-300 hover:text-white font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-pink-400" />
              <span>Telegram</span>
            </button>
          </div>

          {/* 4 Feature Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full">
            <div className="bg-[#130a16] border border-pink-900/30 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-black text-pink-400">5+ Batches</div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold mt-0.5">Class 10 &amp; 12</p>
            </div>

            <div className="bg-[#130a16] border border-pink-900/30 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-black text-pink-400">156+ Videos</div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold mt-0.5">Real HD Lectures</p>
            </div>

            <div className="bg-[#130a16] border border-pink-900/30 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-black text-pink-400">108+ PDFs</div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold mt-0.5">Class Notes</p>
            </div>

            <div className="bg-[#130a16] border border-pink-900/30 rounded-2xl p-3 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-black text-pink-400">0 Logins</div>
              <p className="text-[10px] sm:text-xs text-zinc-400 font-semibold mt-0.5">Direct Access</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
