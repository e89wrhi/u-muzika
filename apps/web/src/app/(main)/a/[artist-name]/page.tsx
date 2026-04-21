import { ARTISTS } from '@/content/artists';
import { notFound } from 'next/navigation';
import { ArtistClient } from './components/artist-client';
import { Metadata } from 'next';
import {
  getChannelDetails,
  getChannelVideos,
  getChannelPlaylists,
} from '@muzika/lib';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'artist-name': string }>;
}): Promise<Metadata> {
  const { 'artist-name': channelId } = await params;
  const channelData = await getChannelDetails([channelId]);
  const channel = channelData[0];

  if (!channel) return { title: 'Artist Not Found | U Muzika' };

  return {
    title: `${channel.title} | U Muzika`,
    description: channel.description.substring(0, 160),
    openGraph: {
      images: [channel.thumbnails.high?.url || ''],
    },
  };
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ 'artist-name': string }>;
}) {
  const { 'artist-name': channelId } = await params;

  let artist = ARTISTS.find((a) => a.id === channelId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let playlists: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let videos: any[] = [];

  try {
    const channelData = await getChannelDetails([channelId]);
    const channel = channelData[0];
    if (channel) {
      artist = {
        id: channel.id,
        name: channel.title,
        image:
          channel.thumbnails.high?.url ||
          channel.thumbnails.medium?.url ||
          channel.thumbnails.default?.url,
        description: channel.description,
        subscribers: channel.statistics.subscriberCount,
        customUrl: channel.customUrl,
      };

      const [channelVideos, channelPlaylists] = await Promise.all([
        getChannelVideos(channelId),
        getChannelPlaylists(channelId),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      videos = channelVideos.map((v: any) => ({
        id: v.id.videoId,
        title: v.snippet.title,
        views: 'Loading...', // Search API doesn't return viewCount by default
        date: new Date(v.snippet.publishedAt).toLocaleDateString(),
        thumbnail:
          v.snippet.thumbnails.high?.url || v.snippet.thumbnails.medium?.url,
      }));

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playlists = channelPlaylists.map((p: any) => ({
        id: p.id,
        title: p.snippet.title,
        image:
          p.snippet.thumbnails.high?.url ||
          p.snippet.thumbnails.medium?.url ||
          p.snippet.thumbnails.default?.url,
        itemCount: p.contentDetails.itemCount,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch artist details from YouTube:', error);
  }

  if (!artist && !videos.length) {
    notFound();
  }

  // Use fallback if artist still not found but we have videos
  const finalArtist = artist || {
    id: channelId,
    name: 'Unknown Artist',
    image: '',
    description: '',
  };

  return (
    <ArtistClient artist={finalArtist} playlists={playlists} videos={videos} />
  );
}
