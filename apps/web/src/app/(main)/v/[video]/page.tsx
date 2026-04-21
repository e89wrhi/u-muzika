import { notFound } from 'next/navigation';
import { VideoClient } from './components/video-client';
import { getVideoDetails } from '@muzika/lib';
import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ video: string }>;
}): Promise<Metadata> {
  const { video: videoId } = await params;
  const videoData = await getVideoDetails(videoId);

  if (!videoData) return { title: 'Video Not Found | U Muzika' };

  return {
    title: `${videoData.snippet.title} | U Muzika`,
    description: videoData.snippet.description.substring(0, 160),
    openGraph: {
      images: [videoData.snippet.thumbnails.high?.url || ''],
    },
  };
}

export default async function VideoPage({
  params,
}: {
  params: Promise<{ video: string }>;
}) {
  const { video: videoId } = await params;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let video: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let comments: any[] = [];

  try {
    const videoData = await getVideoDetails(videoId);
    if (videoData) {
      video = {
        id: videoId,
        title: videoData.snippet.title,
        views: parseInt(videoData.statistics.viewCount).toLocaleString(),
        rawViews: videoData.statistics.viewCount,
        likes: videoData.statistics.likeCount
          ? parseInt(videoData.statistics.likeCount).toLocaleString()
          : '0',
        date: new Date(videoData.snippet.publishedAt).toLocaleDateString(
          'en-US',
          { month: 'short', day: 'numeric', year: 'numeric' }
        ),
        description: videoData.snippet.description,
        channel: videoData.snippet.channelTitle,
        channelSubs: 'N/A',
      };

      // In a real app, we'd fetch actual comments here
      comments = [
        { id: 'c1', user: 'Fan', text: 'Amazing music!', date: '1 day ago' },
      ];
    }
  } catch (error) {
    console.error('Failed to fetch video details:', error);
  }

  if (!video) {
    notFound();
  }

  return <VideoClient video={video} comments={comments} />;
}
