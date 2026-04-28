const API_KEY =
  process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const BASE_URL = "https://www.googleapis.com/youtube/v3";

export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  thumbnails: {
    default: { url: string };
    medium: { url: string };
    high: { url: string };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

export async function getChannelDetails(
  channelIds: string[],
): Promise<YouTubeChannel[]> {
  if (!API_KEY) {
    console.warn("YOUTUBE_API_KEY is not defined");
    return [];
  }

  const response = await fetch(
    `${BASE_URL}/channels?part=snippet,statistics&id=${channelIds.join(",")}&key=${API_KEY}`,
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to fetch YouTube channels");
  }

  const data = await response.json();
  return data.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    description: item.snippet.description,
    customUrl: item.snippet.customUrl,
    thumbnails: item.snippet.thumbnails,
    statistics: item.statistics,
  }));
}

export async function getChannelVideos(channelId: string, maxResults = 10) {
  if (!API_KEY) return [];

  const response = await fetch(
    `${BASE_URL}/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&key=${API_KEY}`,
  );

  if (!response.ok) return [];

  const data = await response.json();
  return data.items;
}

export async function getVideoDetails(videoId: string) {
  if (!API_KEY) return null;

  const response = await fetch(
    `${BASE_URL}/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`,
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.items?.[0] || null;
}

export async function getChannelPlaylists(channelId: string, maxResults = 10) {
  if (!API_KEY) return [];

  const response = await fetch(
    `${BASE_URL}/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=${maxResults}&key=${API_KEY}`,
  );

  if (!response.ok) return [];

  const data = await response.json();
  return data.items;
}

export async function getPlaylistDetails(playlistId: string) {
  if (!API_KEY) return null;

  const response = await fetch(
    `${BASE_URL}/playlists?part=snippet,contentDetails&id=${playlistId}&key=${API_KEY}`,
  );

  if (!response.ok) return null;

  const data = await response.json();
  return data.items?.[0] || null;
}

export async function getPlaylistItems(playlistId: string, maxResults = 50) {
  if (!API_KEY) return [];

  const response = await fetch(
    `${BASE_URL}/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`,
  );

  if (!response.ok) return [];

  const data = await response.json();
  return data.items;
}

export async function getVideoDetailsBatch(videoIds: string[]) {
  if (!API_KEY || videoIds.length === 0) return [];

  const response = await fetch(
    `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(",")}&key=${API_KEY}`,
  );

  if (!response.ok) return [];

  const data = await response.json();
  return data.items;
}
