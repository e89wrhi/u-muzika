'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Sun,
  Moon,
  Settings,
  LogOut,
  User as UserIcon,
  Search,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Show, useUser, useClerk } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

import { LanguageSwitcher } from './language-switcher';

export function NavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/v?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 h-14 px-7 flex items-center justify-between transition-all">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-7 w-7 transition-transform group-hover:scale-110">
            <Image
              src="/logo.png"
              alt="Muzika Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-tighter text-neutral-900 dark:text-neutral-50 flex items-center">
            U Muzika
          </span>
        </Link>
      </div>

      {/* Middle: Functional Search Bar */}
      <form
        onSubmit={handleSearch}
        className="hidden sm:flex items-center flex-1 max-w-[600px] px-8"
      >
        <div className="flex flex-1 items-center h-9 bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-full px-4 focus-within:ring-2 focus-within:ring-red-600/20 focus-within:border-red-600/40 transition-all">
          <Search className="h-4 w-4 text-neutral-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search artists, tracks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-sm placeholder:text-neutral-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              ×
            </button>
          )}
        </div>
      </form>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        <div className="flex sm:hidden">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {mounted && (
          <div className="hidden md:flex items-center gap-1 border-r border-neutral-200 dark:border-neutral-800 pr-3 mr-1">
            <LanguageSwitcher />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Show when="signed-out">
            <Button
              asChild
              className="rounded-full h-9 px-5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-all hover:scale-105"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </Show>
          <Show when="signed-in">
            <UserAccountNav />
          </Show>
        </div>
      </div>
    </header>
  );
}

function UserAccountNav() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();

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
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full p-0 overflow-hidden outline-none hover:bg-transparent"
          >
            <Avatar className="h-8 w-8 ring-offset-2 ring-transparent hover:ring-red-600 transition-all">
              <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
              <AvatarFallback className="bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50 font-semibold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-72 border border-neutral-200 dark:border-neutral-800 rounded-xl p-0 shadow-2xl bg-white dark:bg-neutral-950 overflow-hidden"
          align="end"
          forceMount
        >
          <div className="p-4 flex items-center gap-3 bg-neutral-50/50 dark:bg-neutral-900/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
              <AvatarFallback className="bg-neutral-100 text-neutral-900 dark:bg-neutral-900 dark:text-neutral-50 font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
                {user.fullName}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-800 m-0" />

          <DropdownMenuGroup className="p-2">
            <DropdownMenuItem
              asChild
              className="rounded-lg py-2.5 px-4 cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800 group"
            >
              <Link href="/me" className="flex items-center w-full">
                <UserIcon className="mr-3 h-5 w-5 text-neutral-500 group-hover:text-red-600" />
                <span className="flex-1">Your Channel</span>
                <ChevronRight className="h-4 w-4 text-neutral-300" />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg py-2.5 px-4 cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800 group"
            >
              {theme === 'dark' ? (
                <Sun className="mr-3 h-5 w-5 text-neutral-500 group-hover:text-red-600" />
              ) : (
                <Moon className="mr-3 h-5 w-5 text-neutral-500 group-hover:text-red-600" />
              )}
              <div className="flex flex-col flex-1">
                <span className="text-sm font-medium">Appearance</span>
                <span className="text-[10px] text-neutral-400 capitalize">
                  {theme} mode
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-300" />
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="rounded-lg py-2.5 px-4 cursor-pointer focus:bg-neutral-100 dark:focus:bg-neutral-800 group"
            >
              <Link href="/settings" className="flex items-center w-full">
                <Settings className="mr-3 h-5 w-5 text-neutral-500 group-hover:text-red-600" />
                <span className="flex-1">Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="bg-neutral-200 dark:bg-neutral-800 m-0" />

          <div className="p-2">
            <DropdownMenuItem
              className="rounded-lg py-2.5 px-4 cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/20 group text-red-600 dark:text-red-400 font-medium"
              onClick={() => signOut()}
            >
              <LogOut className="mr-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
