import Link from 'next/link';
import Image from 'next/image';
import { Artist } from '@/content/artists';
import { Disc } from 'lucide-react';

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/a/${artist.id}`}
      className="group flex flex-col items-center justify-center text-center overflow-hidden transition-all"
    >
      <div className="relative h-50 w-50 lg:h-60 lg:w-60 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        {artist.image ? (
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <Disc className="h-20 w-20 opacity-20" />
          </div>
        )}
      </div>
      <div className="p-4 px-5">
        <h3 className="text-xl lg:text-4xl font-black">{artist.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
          {artist.description}
        </p>
      </div>
    </Link>
  );
}
