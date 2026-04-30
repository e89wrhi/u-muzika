'use client';

import { useEffect } from 'react';
import DetailWidthWrapper from '@/components/layout/detail-width-wrapper';
import { Button } from '@/components/ui/button';
import { RefreshCcw, AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-black overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[120px] animate-pulse" />
      <div className="absolute -right-20 -bottom-20 h-[500px] w-[500px] rounded-full bg-indigo-500/5 blur-[120px] animate-pulse delay-700" />

      <DetailWidthWrapper className="shadow-none !bg-transparent text-center relative z-10">
        <div className="space-y-8">
          <div className="flex flex-col items-center gap-6">
            <div className="h-24 w-24 rounded-[2rem] bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 shadow-xl shadow-red-600/10 animate-bounce">
              <AlertTriangle className="h-12 w-12" />
            </div>

            <div className="space-y-4 max-w-lg mx-auto">
              <h1 className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white md:text-5xl">
                {t('errorTitle')}
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium text-lg italic">
                &quot;
                {error.message ||
                  'An unexpected error occurred while loading your music.'}
                &quot;
              </p>
              <p className="text-sm text-neutral-400 dark:text-neutral-500 max-w-sm mx-auto">
                {t('errorDesc')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              onClick={() => reset()}
              className="h-14 rounded-full bg-red-600 px-10 hover:bg-red-700 text-white font-black shadow-xl shadow-red-600/20 text-lg transition-transform hover:scale-105 active:scale-95"
            >
              <RefreshCcw className="mr-2 h-6 w-6" /> {t('tryAgain')}
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="h-14 rounded-full px-10 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
            >
              {t('backToHome')}
            </Button>
          </div>
        </div>
      </DetailWidthWrapper>
    </div>
  );
}
