import React from 'react';
import Image from 'next/image';

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-black overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[120px] animate-pulse duration-[4000ms]" />
      <div className="absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse duration-[4000ms] delay-1000" />

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo Container */}
        <div className="relative h-32 w-32 md:h-40 md:w-40">
          {/* Subtle Glow Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500/20 to-indigo-500/20 blur-2xl animate-pulse" />

          {/* Logo Box */}
          <div className="relative h-full w-full overflow-hidden rounded-full border border-neutral-200/50 bg-white/80 p-6 shadow-2xl backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/80 transition-all group">
            <Image
              src="/logo.png"
              alt="U Muzika Logo"
              width={120}
              height={120}
              className="h-full w-full object-contain animate-in zoom-in-50 duration-700"
              priority
            />
          </div>

          {/* Orbiting Ring */}
          <div className="absolute -inset-4 rounded-[3rem] border-2 border-dashed border-neutral-200/30 dark:border-neutral-800/30 animate-[spin_10s_linear_infinite]" />
        </div>

        {/* Branding & Status */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white sm:text-4xl">
              U Muzika
            </h2>
          </div>

          {/* Modern Loader Dots */}
          <div className="mt-2 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-red-600 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Progress Bar (Purely Visual) */}
      <div className="absolute bottom-0 left-0 h-1 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-red-600 to-indigo-600 animate-[loading_2s_infinite_ease-in-out]" />
      </div>
    </div>
  );
}
