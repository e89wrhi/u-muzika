import DetailWidthWrapper from '@/components/layout/detail-width-wrapper';
import { ARTISTS, ARTIST_IDS } from '@/content/artists';
import { ArtistCard } from './components/artist-card';
import { getChannelDetails } from '@muzika/lib';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'U Muzika | Discover Your Sound',
  description:
    'Experience the ultimate music platform powered by YouTube. Discover your favorite artists, playlists, and videos in a premium interface.',
};

export default async function HomePage() {
  let displayedArtists = ARTISTS;

  try {
    const youtubeArtists = await getChannelDetails(ARTIST_IDS);
    if (youtubeArtists.length > 0) {
      displayedArtists = youtubeArtists.map((channel) => ({
        id: channel.id,
        name: channel.title,
        image:
          channel.thumbnails.high?.url ||
          channel.thumbnails.medium?.url ||
          channel.thumbnails.default?.url,
        description: channel.description,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch YouTube artists:', error);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-black">
      <DetailWidthWrapper className="relative max-w-6xl z-10 !bg-transparent pt-20 pb-32 shadow-none">
        <div id="artists" className="scroll-mt-32">
          <div className="grid grid-cols-1 pt-15 gap-11 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {displayedArtists.map((artist, i) => (
              <div
                key={artist.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <ArtistCard artist={artist} />
              </div>
            ))}
          </div>
        </div>
      </DetailWidthWrapper>
    </div>
  );
}
