export interface Artist {
  id: string; // YouTube Channel ID
  name: string;
  image: string;
  description: string;
  subscribers?: string;
  customUrl?: string;
}

export const ARTIST_IDS = [
  'UC2s9j9EMXMFklxGqDPJp-qQ', // rophnan
  'UCydlocDyvRtFmMffKytKqgQ', // Teddy Afro
  'UCAlTDckOOQ2jREOvuCShGbw', // bob marley
  'UCEzDdNqNkT-7rSfSGSr1hWg', // Burna Boy
  'UCi7Cbr-F3zFQjwafFh5RWJA', // Wizkid
  'UCkBV3nBa0iRdxEGc4DUS3xA', // Davido
  'UCev-b-xy-p5fHK8x3zJyn1Q', // Diamond Platnumz
  'UCaE-H-z38_2-36L_h1o9G2g', // Tems
];

// Fallback data if API fails or for initial render
export const ARTISTS: Artist[] = [
  {
    id: 'UC2s9j9EMXMFklxGqDPJp-qQ',
    name: 'Rophnan',
    image: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
    description: 'Ethiopian musician, producer and songwriter known for EDM music.',
  },
  {
    id: 'UCydlocDyvRtFmMffKytKqgQ',
    name: 'Teddy Afro',
    image: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
    description: 'Iconic Ethiopian singer and songwriter.',
  },
  {
    id: 'UCAlTDckOOQ2jREOvuCShGbw',
    name: 'Bob Marley',
    image: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
    description: 'Jamaican singer, musician, and songwriter. A global icon of reggae.',
  },
  {
    id: 'UCEzDdNqNkT-7rSfSGSr1hWg',
    name: 'Burna Boy',
    image: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
    description: 'Grammy Award-winning Nigerian singer and songwriter.',
  },
  {
    id: 'UCi7Cbr-F3zFQjwafFh5RWJA',
    name: 'Wizkid',
    image: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
    description:
      'Nigerian singer and songwriter, a major figure in the Afrobeats scene.',
  },
  {
    id: 'UCkBV3nBa0iRdxEGc4DUS3xA',
    name: 'Davido',
    image: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
    description:
      'American-born Nigerian singer, songwriter and record producer.',
  },
  {
    id: 'UCev-b-xy-p5fHK8x3zJyn1Q',
    name: 'Diamond Platnumz',
    image: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
    description: 'Tanzanian bongo flava recording artist and dancer.',
  },
  {
    id: 'UCaE-H-z38_2-36L_h1o9G2g',
    name: 'Tems',
    image: 'https://i.ytimg.com/vi/placeholder/hqdefault.jpg',
    description: 'Nigerian singer, songwriter and record producer.',
  },
];
