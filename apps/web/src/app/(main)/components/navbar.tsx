'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

import { LanguageSwitcher } from './language-switcher';

export function NavBar() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-4 z-50 w-full px-4 flex justify-center pointer-events-none">
      <div className="w-full max-w-5xl pointer-events-auto">
        <div className="flex h-16 items-center justify-between rounded-full border border-neutral-200/60 bg-white/70 px-6 shadow-lg shadow-neutral-200/20 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/70 dark:shadow-black/40 transition-all hover:bg-white/80 dark:hover:bg-neutral-950/80">
          {/* Left: Logo & Name */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group flex items-center space-x-2 sm:space-x-3 transition-opacity"
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-xl p-1.5">
                <Image
                  src="/logo.png"
                  alt="Muzika Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="hidden text-xl font-black text-neutral-900 dark:text-neutral-50 sm:block">
                U Muzika
              </span>
            </Link>
          </div>

          {/* Right: Search, Language & Theme */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 border-l border-neutral-200 dark:border-neutral-800 pl-4 h-8">
              <LanguageSwitcher />

              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-9 w-9 rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  title="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 animate-in zoom-in duration-300" />
                  ) : (
                    <Moon className="h-4 w-4 animate-in zoom-in duration-300" />
                  )}
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="flex h-9 w-9 rounded-full text-neutral-500 hover:bg-neutral-100 sm:hidden dark:text-neutral-400 dark:hover:bg-neutral-800"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
