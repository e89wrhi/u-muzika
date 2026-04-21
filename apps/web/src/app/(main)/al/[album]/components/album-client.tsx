'use client';

import DetailWidthWrapper from '@/components/layout/detail-width-wrapper';
import { Button } from '@/components/ui/button';
import {
  Play,
  Heart,
  Clock,
  ArrowLeft,
  Disc,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@muzika/lib';
import { useState } from 'react';

interface AlbumClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  album: any;
}

export function AlbumClient({ album }: AlbumClientProps) {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);

  const handlePlayOnYouTube = () => {
    window.open(`https://www.youtube.com/playlist?list=${album.id}`, '_blank');
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;

    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 pb-32 dark:bg-black relative overflow-hidden">
      <DetailWidthWrapper className="shadow-none !bg-transparent space-y-16 max-w-6xl mx-auto relative z-10">
        {/* Navigation & Header */}
        <div className="flex flex-col gap-10">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="group flex items-center gap-2 rounded-full px-6 py-6 bg-white/10 backdrop-blur-xl border border-white/10 shadow-xl font-black text-neutral-900 dark:text-white hover:bg-white/20 transition-all active:scale-95"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              <span>EXIT COLLECTION</span>
            </Button>
          </div>

          {/* Album Hero Section */}
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-end">
            <div className="relative h-80 w-80 shrink-0 overflow-hidden rounded-[3rem] bg-neutral-200 dark:bg-neutral-800 shadow-[0_48px_96px_-20px_rgba(0,0,0,0.6)] transition-all hover:scale-105 duration-700 group/art">
              {album.image ? (
                <Image
                  src={album.image}
                  alt={album.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover/art:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  <Disc className="h-20 w-20 opacity-20 animate-spin-slow" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-8 text-center md:text-left">
              <div className="space-y-3">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="h-0.5 w-6 bg-red-600 rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-600 dark:text-red-400">
                    Playlist
                  </span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-neutral-900 dark:text-white md:text-6xl leading-[0.9] drop-shadow-sm">
                  {album.title}
                </h1>
              </div>

              {/* Enhanced Stats Row */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-10 py-4">
                <Link
                  href={`/a/${album.artistId}`}
                  className="group flex flex-col items-center md:items-start"
                >
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-1">
                    Artist
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-neutral-900 dark:text-white group-hover:text-red-600 transition-colors tracking-tighter">
                      {album.artist}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-1">
                    Views
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter">
                      {album.totalViews}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-1">
                    Playtime
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter whitespace-nowrap">
                      {album.totalTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-1">
                    Total Tracks
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter">
                      {album.trackCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-4">
                <Button
                  onClick={handlePlayOnYouTube}
                  className="h-16 rounded-full bg-red-600 px-12 hover:bg-red-700 text-white font-black shadow-2xl shadow-red-600/40 text-xl transition-all hover:scale-105 active:scale-95 group"
                >
                  <ExternalLink className="mr-3 h-7 w-7 transition-all group-hover:scale-110" />{' '}
                  Play on YouTube
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCopyLink}
                  className={cn(
                    'h-16 px-10 rounded-full backdrop-blur-xl border-neutral-200 dark:border-neutral-800 font-bold transition-all shadow-xl group/share relative overflow-hidden',
                    isCopied
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-white/80 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  )}
                >
                  <div className="flex items-center gap-2">
                    {isCopied ? (
                      <>
                        <Check className="h-5 w-5 animate-in zoom-in" />
                        <span>COPIED!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5 transition-transform group-hover/share:scale-110" />
                        <span>COPY LINK</span>
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tracklist Table */}
        <div className="mt-12 overflow-hidden rounded-[3rem] bg-white/40 dark:bg-neutral-900/40 backdrop-blur-3xl border border-white/20 dark:border-neutral-800/50 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.15)]">
          {/* Header Row */}
          <div className="grid grid-cols-[80px_1fr_auto] items-center gap-6 border-b border-neutral-200/50 dark:border-neutral-800/50 px-10 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">
            <span className="text-center italic underline decoration-red-500 decoration-2 underline-offset-4">
              Rank
            </span>
            <span>Composition Title</span>
            <span className="pr-16 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Duration
            </span>
          </div>

          <div className="divide-y divide-neutral-200/20 dark:divide-neutral-800/20 px-4">
            {album.tracks.map((track: any, index: number) => (
              <Link
                key={track.id}
                href={`/v/${track.videoId}`}
                className="group grid grid-cols-[80px_1fr_auto] items-center gap-6 px-6 py-6 rounded-2xl hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-all active:scale-[0.98] group/item my-1"
              >
                <div className="flex items-center justify-center">
                  <span className="text-lg font-black text-neutral-400 group-hover/item:text-white transition-colors tracking-tight">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="flex items-center gap-6 min-w-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800 shadow-lg ring-1 ring-black/5 group-hover/item:ring-white/30 transition-all">
                    {track.thumbnail ? (
                      <Image
                        src={track.thumbnail}
                        alt={track.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-neutral-400">
                        <Disc className="h-6 w-6 opacity-20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/20 flex items-center justify-center transition-all">
                      <Play className="opacity-0 group-hover/item:opacity-100 h-6 w-6 text-white fill-current" />
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-lg font-black tracking-tight group-hover/item:text-white transition-colors">
                      {track.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover/item:text-white/70 transition-colors">
                        {album.artist}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600 group-hover/item:bg-white/30" />
                      <span className="text-[10px] font-bold text-neutral-400 group-hover/item:text-white/60 transition-colors uppercase">
                        High Quality
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center pr-12 gap-8">
                  <div className="opacity-0 group-hover/item:opacity-100 transition-all scale-75 group-hover/item:scale-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-12 w-12 rounded-full hover:bg-white/20 hover:text-white"
                    >
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                  <span className="w-16 text-right text-sm font-black italic tracking-tighter opacity-60 group-hover/item:opacity-100 tabular-nums">
                    {track.duration}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Description Section */}
        {album.description && (
          <div className="mt-28 space-y-8 max-w-4xl px-4">
            <div className="flex items-center gap-4">
              <div className="h-1.5 w-16 rounded-full bg-red-600" />
              <h2 className="text-xs font-black uppercase tracking-[0.5em] text-neutral-500">
                Collection Insights
              </h2>
            </div>
            <p className="text-2xl font-medium leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap selection:bg-red-200 dark:selection:bg-red-900/30 font-serif italic">
              {album.description}
            </p>
          </div>
        )}
      </DetailWidthWrapper>
    </div>
  );
}
