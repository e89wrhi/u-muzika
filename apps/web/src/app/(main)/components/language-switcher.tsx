'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Languages, Check, ChevronDown } from 'lucide-react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const currentLocale = Cookies.get('NEXT_LOCALE') || 'en';

  const toggleLanguage = (code: string) => {
    Cookies.set('NEXT_LOCALE', code, { expires: 365 });
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full px-3 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
      >
        <Languages className="h-4 w-4" />
        <span className="text-sm font-medium uppercase">{currentLocale}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 z-50 w-40 overflow-hidden rounded-2xl border border-neutral-200 bg-white/80 p-1 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 dark:border-neutral-800 dark:bg-neutral-950/80">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <div className="flex items-center gap-3">
                  <span>{lang.flag}</span>
                  <span
                    className={
                      currentLocale === lang.code
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }
                  >
                    {lang.name}
                  </span>
                </div>
                {currentLocale === lang.code && (
                  <Check className="h-4 w-4 text-red-600 dark:text-red-400" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
