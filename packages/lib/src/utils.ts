import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// formatted time for list item
export function formatDate(input: Date): string {
  var date = new Date(input);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

// formatted time for detail page
export function formatDateDetail(input: Date): string {
  var date = new Date(input);
  return date.toLocaleDateString("en-US", {
    minute: "2-digit",
    hour: "2-digit",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// formatted count
export function formatCount(value: number): string {
  return Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

type Locale = "en" | "zh";

const unitMap: Record<Locale, Record<string, string>> = {
  en: {
    s: "s",
    m: "m",
    h: "h",
    d: "d",
    w: "w",
    mo: "mo",
    y: "y",
    sd: " seconds ago",
    md: " minutes ago",
    hd: " hours ago",
    dd: " days ago",
    wd: " weeks ago",
    mod: " months ago",
    yd: " years ago",
  },
  zh: {
    s: "秒前",
    m: "分钟前",
    h: "小时前",
    d: "天前",
    w: "周前",
    mo: "个月前",
    y: "年前",
    sd: "秒前",
    md: "分钟前",
    hd: "小时前",
    dd: "天前",
    wd: "周前",
    mod: "个月前",
    yd: "年前",
  },
};

// relative time for list 2mo
export function formatRelativeTime(date: Date, locale: Locale = "en"): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // If in the future, return formatted date
  if (date > now) {
    return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      year: "2-digit",
    });
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const map = unitMap[locale];

  if (seconds < 60) return `${seconds}${map.s}`;
  if (minutes < 60) return `${minutes}${map.m}`;
  if (hours < 24) return `${hours}${map.h}`;
  if (days < 7) return `${days}${map.d}`;
  if (weeks < 4) return `${weeks}${map.w}`;
  if (months < 12) return `${months}${map.mo}`;
  return `${years}${map.y}`;
}

// relative time for detail 2 months ago
export function formatRelativeTimeDetail(
  date: Date,
  locale: Locale = "en",
): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // If in the future, return formatted date
  if (date > now) {
    return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
      month: "short",
      year: "2-digit",
    });
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  const map = unitMap[locale];

  if (seconds < 60) return `${seconds}${map.sd}`;
  if (minutes < 60) return `${minutes}${map.md}`;
  if (hours < 24) return `${hours}${map.hd}`;
  if (days < 7) return `${days}${map.dd}`;
  if (weeks < 4) return `${weeks}${map.wd}`;
  if (months < 12) return `${months}${map.mod}`;
  return `${years}${map.yd}`;
}

export function parseISODuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  return hours * 3600 + minutes * 60 + seconds;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}
