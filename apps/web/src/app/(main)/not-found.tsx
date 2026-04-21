'use client';

import Link from 'next/link';
import DetailWidthWrapper from '@/components/layout/detail-width-wrapper';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-black overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[120px] animate-pulse" />
      <div className="absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse delay-700" />

      <DetailWidthWrapper className="shadow-none !bg-transparent text-center relative z-10">
        <div className="space-y-8">
          <div className="relative inline-block">
            <h1 className="text-[10rem] font-black leading-none tracking-tighter text-neutral-100 dark:text-neutral-900 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-black text-neutral-900 dark:text-white uppercase tracking-[0.2em]">
                Lost in <span className="text-red-600">Music</span>
              </span>
            </div>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Oops! This track doesn&apos;t exist.
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 font-medium">
              We couldn&apos;t find the page you were looking for. It might have
              been moved or the link is outdated.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              asChild
              className="h-14 rounded-full bg-red-600 px-8 hover:bg-red-700 text-white font-black shadow-xl shadow-red-600/20 text-lg transition-transform hover:scale-105"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" /> Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </DetailWidthWrapper>
    </div>
  );
}
