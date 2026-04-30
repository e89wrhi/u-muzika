'use client';

import { useState } from 'react';
import DetailWidthWrapper from '@/components/layout/detail-width-wrapper';
import { Button } from '@/components/ui/button';
import { Copy, Check, Hash, AtSign, ExternalLink, Bot } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface VideoClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  video: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  comments: any[];
}

function formatDescription(text: string) {
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
            <Hash className="h-3 w-3" />
          ) : (
            <AtSign className="h-3 w-3" />
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

export function VideoClient({ video }: VideoClientProps) {
  const t = useTranslations();
  const [copied, setCopied] = useState(false);
  const { isSignedIn } = useAuth();

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-32 dark:bg-black">
      <DetailWidthWrapper className="shadow-none !bg-transparent max-w-5xl mx-auto space-y-12">
        {/* Video Player Section */}
        <div className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_32px_64px_-15px_rgba(0,0,0,1)]">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
            className="h-full w-full border-none shadow-2xl"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Big Stats Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col items-center md:items-start space-y-1">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-500">
              {t('Views')}
            </span>
            <span className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-white md:text-5xl">
              {video.views}
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-1">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-500">
              {t('Likes')}
            </span>
            <span className="text-4xl font-black tracking-tighter text-red-600 md:text-5xl">
              {video.likes}
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-1">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-500">
              {t('Released')}
            </span>
            <span className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white md:text-3xl">
              {video.date}
            </span>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white md:text-5xl leading-tight">
                {video.title}
              </h1>

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 shrink-0 overflow-hidden shadow-lg">
                  {/* Channel Thumbnail could go here */}
                </div>
                <div>
                  <h3 className="text-xl font-black text-neutral-900 dark:text-white">
                    {video.channel}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                    <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
                      {t('verifiedChannel')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 shrink-0">
              <Button className="h-14 rounded-full bg-red-600 px-10 hover:bg-red-700 text-white font-black shadow-xl shadow-red-600/20 text-lg transition-transform hover:scale-105 active:scale-95">
                {t('Subscribe')}
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-14 rounded-full bg-white dark:bg-neutral-900 px-10 border-neutral-200 dark:border-neutral-800 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-red-500 dark:text-red-400 group/chat"
              >
                <Link
                  href={isSignedIn ? `/talk-video?id=${video.id}` : '/login'}
                >
                  <Bot className="mr-2 h-5 w-5 transition-transform group-hover/chat:scale-110" />
                  {t('talkWithAI')}
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-14 rounded-full bg-white dark:bg-neutral-900 px-8 border-neutral-200 dark:border-neutral-800 font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all min-w-[160px]"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="mr-2 h-5 w-5" />
                )}
                {copied ? t('linkCopied') : t('copyLink')}
              </Button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white dark:bg-neutral-900/50 p-10 shadow-2xl shadow-black/5 dark:shadow-none border border-neutral-100 dark:border-neutral-800/50">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-8 rounded-full bg-red-600" />
              <h4 className="text-sm font-black uppercase tracking-widest text-neutral-500">
                {t('videoDescription')}
              </h4>
            </div>
            <div className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap selection:bg-red-200 dark:selection:bg-red-900/30">
              {formatDescription(video.description)}
            </div>
          </div>
        </div>
      </DetailWidthWrapper>
    </div>
  );
}
