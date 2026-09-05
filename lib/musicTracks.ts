export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverArt?: string;
  audioUrl: string;
}

export const POPULAR_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'track-1',
    title: 'Genesis Sovereign Anthem',
    artist: 'Zenvitra Orchestra & Youth Choir',
    genre: 'Cinematic Orchestral',
    duration: '0:30',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2874/2874-preview.mp3',
  },
  {
    id: 'track-2',
    title: 'Geneva Plenary Reverberations',
    artist: 'Diplomatic Soundscapes',
    genre: 'Ambient Neo-Classical',
    duration: '0:25',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2871/2871-preview.mp3',
  },
  {
    id: 'track-3',
    title: 'Midnight Floor Debate',
    artist: 'Civic Lo-Fi Sessions',
    genre: 'Lo-Fi Chill',
    duration: '0:35',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  },
  {
    id: 'track-4',
    title: 'Constitutional Horizon',
    artist: 'Elena Rostova & Sovereign Trio',
    genre: 'Inspiring Piano',
    duration: '0:28',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3',
  },
  {
    id: 'track-5',
    title: 'Future Citizens of Truth',
    artist: 'ZenPulse Acoustic Collective',
    genre: 'Indie Folk / Uplifting',
    duration: '0:32',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2872/2872-preview.mp3',
  },
  {
    id: 'track-6',
    title: 'Smart Labs Pulse Wave',
    artist: 'Decentralized Audio Lab',
    genre: 'Cyber Electronic',
    duration: '0:24',
    audioUrl: 'https://assets.mixkit.co/active_storage/sfx/2873/2873-preview.mp3',
  },
];
