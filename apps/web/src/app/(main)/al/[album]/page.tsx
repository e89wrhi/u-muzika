import { notFound } from 'next/navigation';
import { AlbumClient } from './components/album-client';
import {
  getPlaylistDetails,
  getPlaylistItems,
  getVideoDetailsBatch,
  parseISODuration,
  formatDuration,
  formatCount,
} from '@muzika/lib';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ album: string }>;
}): Promise<Metadata> {
  const { album: albumId } = await params;
  const playlistData = await getPlaylistDetails(albumId);

  if (!playlistData) return { title: 'Album Not Found | U Muzika' };

  return {
    title: `${playlistData.snippet.title} | U Muzika`,
    description: playlistData.snippet.description.substring(0, 160),
    openGraph: {
      images: [playlistData.snippet.thumbnails.high?.url || ''],
    },
  };
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const { album: albumId } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let album: any = null;

  try {
    const playlistData = await getPlaylistDetails(albumId);

    if (playlistData) {
      const itemsData = await getPlaylistItems(albumId);
      const videoIds = itemsData.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any) => item.contentDetails.videoId
      );
      const videoDetails = await getVideoDetailsBatch(videoIds);

      let totalViews = 0;
      let totalSeconds = 0;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      videoDetails.forEach((video: any) => {
        totalViews += parseInt(video.statistics.viewCount || '0');
        totalSeconds += parseISODuration(video.contentDetails.duration);
      });

      album = {
        id: albumId,
        title: playlistData.snippet.title,
        artist: playlistData.snippet.channelTitle,
        artistId: playlistData.snippet.channelId,
        description: playlistData.snippet.description,
        image:
          playlistData.snippet.thumbnails.high?.url ||
          playlistData.snippet.thumbnails.medium?.url,
        trackCount: playlistData.contentDetails.itemCount,
        totalViews: formatCount(totalViews),
        totalTime: formatDuration(totalSeconds),
        publishedAt: new Date(playlistData.snippet.publishedAt).getFullYear(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tracks: itemsData.map((item: any) => {
          const detailed = videoDetails.find(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (v: any) => v.id === item.contentDetails.videoId
          );
          return {
            id: item.id,
            videoId: item.contentDetails.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default?.url,
            position: item.snippet.position,
            duration: detailed
              ? formatDuration(
                  parseISODuration(detailed.contentDetails.duration)
                )
              : '0:00',
          };
        }),
      };
    }
  } catch (error) {
    console.error('Failed to fetch playlist details:', error);
  }

  if (!album) {
    notFound();
  }

  return <AlbumClient album={album} />;
}
