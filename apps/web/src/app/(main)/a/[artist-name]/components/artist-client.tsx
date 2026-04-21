'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import DetailWidthWrapper from '@/components/layout/detail-width-wrapper';
import {
  Play,
  Youtube,
  Library,
  ArrowLeft,
  ListMusic,
  Hash,
  AtSign,
  ExternalLink,
  Disc,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Artist } from '@/content/artists';
import { formatCount, cn } from '@muzika/lib';

interface ArtistClientProps {
  artist: Artist;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  playlists: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  videos: any[];
}

function formatBio(text: string) {
  if (!text) return null;
  // Split by hashtags, mentions, or URLs
  const parts = text.split(
    /((?:^|\s)(?:#|@)[\w\u0400-\u04FF]+|https?:\/\/[^\s]+)/g
  );

  return parts.map((part, i) => {
    if (!part) return null;
    const trimmed = part.trim();

    if (trimmed.startsWith('#') || trimmed.startsWith('@')) {
      const isHashtag = trimmed.startsWith('#');
      const query = trimmed.substring(1);
      const url = isHashtag
        ? `https://www.youtube.com/hashtag/${query}`
        : `https://www.youtube.com/${trimmed}`;

      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {isHashtag ? (
            <Hash className="h-3.5 w-3.5" />
          ) : (
            <AtSign className="h-3.5 w-3.5" />
          )}
          {trimmed}
        </a>
      );
    }

    if (trimmed.startsWith('http')) {
      return (
        <a
          key={i}
          href={trimmed}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold underline transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {trimmed.length > 30 ? trimmed.substring(0, 30) + '...' : trimmed}
        </a>
      );
    }

    return part;
  });
}

export function ArtistClient({ artist, playlists, videos }: ArtistClientProps) {
  const router = useRouter();
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const bioRef = useRef<HTMLDivElement>(null);

  const youtubeUrl = artist.customUrl
    ? `https://youtube.com/${artist.customUrl}`
    : `https://youtube.com/channel/${artist.id}`;

  useEffect(() => {
    const checkOverflow = () => {
      if (bioRef.current) {
        // Temporarily remove line-clamp to measure full height
        const isClamped =
          bioRef.current.scrollHeight > bioRef.current.clientHeight;
        setShouldShowReadMore(isClamped);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [artist.description]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-black pt-20 sm:pt-24">
      <DetailWidthWrapper className="shadow-none !bg-transparent py-0 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="group flex items-center gap-2 rounded-full px-4 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-bold">Back</span>
        </Button>
      </DetailWidthWrapper>

      {/* Hero Header */}
      <div className="relative w-full overflow-hidden pb-12">
        <DetailWidthWrapper className="shadow-none !bg-transparent">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:gap-12">
            <div className="h-56 w-56 shrink-0 overflow-hidden rounded-full border-8 border-white dark:border-neutral-900 shadow-2xl md:h-72 md:w-72 bg-neutral-200 dark:bg-neutral-800">
              {artist.image ? (
                <Image
                  src={artist.image}
                  alt={artist.name}
                  width={288}
                  height={288}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-400">
                  <Disc className="h-20 w-20 opacity-20" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-500">
                  <Play className="h-4 w-4 fill-current" />
                  <span>Verified Artist</span>
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-neutral-900 dark:text-white md:text-8xl">
                  {artist.name}
                </h1>
                {artist.subscribers && (
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-4xl font-black text-neutral-900 dark:text-white">
                      {formatCount(Number(artist.subscribers))}
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Subscribers
                    </span>
                  </div>
                )}
              </div>

              <div className="max-w-2xl space-y-2">
                <div
                  ref={bioRef}
                  className={cn(
                    'text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap transition-all duration-300',
                    !isBioExpanded && 'line-clamp-3'
                  )}
                >
                  {formatBio(artist.description)}
                </div>
                {(shouldShowReadMore || isBioExpanded) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsBioExpanded(!isBioExpanded);
                    }}
                    className="flex items-center mt-2 text-red-600 dark:text-red-400 font-bold hover:underline transition-all text-sm uppercase tracking-wider relative z-20 group"
                  >
                    <span>{isBioExpanded ? 'Read Less' : 'Read More'}</span>
                    <Play
                      className={cn(
                        'ml-1.5 h-3 w-3 transition-transform',
                        isBioExpanded ? '-rotate-90' : 'rotate-90'
                      )}
                    />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  asChild
                  className="h-14 rounded-full bg-red-600 px-10 hover:bg-red-700 text-white font-black shadow-xl shadow-red-600/20 border-none transition-all hover:scale-105 active:scale-95 text-lg"
                >
                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Youtube className="mr-2 h-6 w-6" /> Open on Youtube
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </DetailWidthWrapper>
      </div>

      <DetailWidthWrapper className="mt-12 space-y-24 pb-32 shadow-none !bg-transparent">
        {/* Playlists Section */}
        {playlists && playlists.length > 0 && (
          <section>
            <div className="mb-8 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20">
                  <Library className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
                  Playlists
                </h2>
              </div>
              <Link
                href="#"
                className="text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all dark:text-red-400 border border-red-200 dark:border-red-900/50 px-6 py-2.5 rounded-full"
              >
                Show all
              </Link>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-10 no-scrollbar">
              {playlists.map((playlist) => (
                <Link
                  key={playlist.id}
                  href={`/al/${playlist.id}`}
                  className="group relative w-56 flex-shrink-0 p-4 rounded-3xl bg-neutral-100/50 dark:bg-neutral-900/50 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-all duration-300"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl shadow-black/10 transition-all">
                    {playlist.image ? (
                      <Image
                        src={playlist.image}
                        alt={playlist.title}
                        width={224}
                        height={224}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-200 dark:bg-neutral-800 group-hover:scale-110 transition-transform duration-700">
                        <Disc className="h-12 w-12 opacity-20" />
                      </div>
                    )}

                    {/* Spotify-style Floating Play Button */}
                    <div className="absolute right-3 bottom-0 opacity-0 group-hover:bottom-3 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-black/40">
                        <Play className="h-6 w-6 fill-current" />
                      </div>
                    </div>

                    <div className="absolute right-3 top-3 rounded-xl bg-black/60 p-2 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <ListMusic className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-5 space-y-1.5">
                    <h3 className="text-lg font-black tracking-tight text-neutral-900 dark:text-white line-clamp-1">
                      {playlist.title}
                    </h3>
                    <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 opacity-80 uppercase tracking-wider text-[10px]">
                      Playlist • {playlist.itemCount} Items
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Videos Section */}
        {videos && videos.length > 0 && (
          <section>
            <div className="mb-10 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-900/20">
                  <Play className="h-8 w-8 text-red-600 fill-current" />
                </div>
                <h2 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white">
                  Popular Videos
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video) => {
                const isShort =
                  video.title.toLowerCase().includes('#short') ||
                  video.title.toLowerCase().includes('shorts');
                return (
                  <Link
                    key={video.id}
                    href={`/v/${video.id}`}
                    className="group relative flex flex-col p-3 rounded-2xl bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900/50 transition-all duration-300"
                  >
                    <div
                      className={cn(
                        'relative overflow-hidden rounded-xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]',
                        isShort ? 'aspect-[9/16]' : 'aspect-video'
                      )}
                    >
                      {video.thumbnail ? (
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-neutral-200 dark:bg-neutral-800">
                          <Disc className="h-10 w-10 opacity-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                      {isShort && (
                        <div className="absolute left-3 bottom-3 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-[10px] font-black text-white shadow-lg">
                          <Youtube className="h-3 w-3" />
                          SHORTS
                        </div>
                      )}
                    </div>
                    <div className="mt-4 px-1 space-y-2">
                      <h3 className="font-black leading-tight text-neutral-900 dark:text-white group-hover:text-red-600 transition-colors line-clamp-2">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                        <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-md text-[10px]">
                          {video.views}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                        <span>{video.date}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </DetailWidthWrapper>
    </div>
  );
}
