'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Sun, Moon, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Show, SignInButton, useUser, useClerk } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

          {/* Right: Search, Language, Theme & Auth */}
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

            <div className="flex items-center gap-2 border-l border-neutral-200 dark:border-neutral-800 pl-2 sm:pl-4 h-8">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <Button className="rounded-full h-9 px-4 text-xs font-semibold">
                    Get Started
                  </Button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <div className="flex items-center gap-4">
                  <UserAccountNav />
                </div>
              </Show>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function UserAccountNav() {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user)
    return (
      <div className="h-8 w-8 rounded-full border border-neutral-200 dark:border-neutral-800" />
    );

  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : user.primaryEmailAddress?.emailAddress?.charAt(0).toUpperCase() || 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
            <AvatarFallback className="bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50 font-semibold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-none rounded-2xl p-5"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-neutral-900 dark:text-neutral-50">
              {user.fullName}
            </p>
            <p className="text-xs leading-none text-neutral-500 dark:text-neutral-400">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/me" className="flex items-center w-full">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/settings" className="flex items-center w-full">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-500 justify-between focus:bg-red-50 focus:dark:bg-red-950/50"
          onClick={() => signOut()}
        >
          <div className="flex items-center">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
