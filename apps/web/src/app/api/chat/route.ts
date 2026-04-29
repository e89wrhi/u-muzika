import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getVideoDetails, getPlaylistDetails } from '@muzika/lib';
import { YoutubeTranscript } from 'youtube-transcript';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, contextType, id } = await req.json();

    let systemPrompt =
      'You are a helpful AI music assistant for the U Muzika platform. You help users understand more about the music they are listening to.';

    if (contextType === 'video') {
      try {
        const details = await getVideoDetails(id);
        if (details) {
          systemPrompt += `\n\nVideo Context:\nTitle: ${details.snippet.title}\nDescription: ${details.snippet.description}\nChannel: ${details.snippet.channelTitle}\nViews: ${details.statistics.viewCount}\nLikes: ${details.statistics.likeCount}`;
        }

        try {
          const transcript = await YoutubeTranscript.fetchTranscript(id);
          const transcriptText = transcript.map((t) => t.text).join(' ');
          systemPrompt += `\n\nVideo Transcript:\n${transcriptText.substring(0, 5000)}...`;
        } catch (tError) {
          console.error('Transcript not available', tError);
          systemPrompt += `\n\n[Note: No transcript is available for this video.]`;
        }
      } catch (e) {
        console.error('Error fetching video details', e);
      }
    } else if (contextType === 'album') {
      try {
        const details = await getPlaylistDetails(id);
        if (details) {
          systemPrompt += `\n\nAlbum/Playlist Context:\nTitle: ${details.snippet.title}\nDescription: ${details.snippet.description}\nChannel: ${details.snippet.channelTitle}`;
        }
      } catch (e) {
        console.error('Error fetching album details', e);
      }
    }

    const result = streamText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
