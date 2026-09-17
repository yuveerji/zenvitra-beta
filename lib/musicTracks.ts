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
    title: 'Starboy (Cyber-Acoustic Edit)',
    artist: 'The Weeknd ft. Daft Punk',
    genre: 'Cyber Electropop',
    duration: '0:30',
    audioUrl: '/music/starboy_preview.wav',
  },
  {
    id: 'track-2',
    title: 'Geneva Plenary Reverberations',
    artist: 'Diplomatic Soundscapes',
    genre: 'Ambient Neo-Classical',
    duration: '0:25',
    audioUrl: '/music/ambient_preview.wav',
  },
  {
    id: 'track-3',
    title: 'Midnight Floor Debate',
    artist: 'Civic Lo-Fi Sessions',
    genre: 'Lo-Fi Chill',
    duration: '0:25',
    audioUrl: '/music/cyber_preview.wav',
  },
  {
    id: 'track-4',
    title: 'Constitutional Horizon',
    artist: 'Elena Rostova & Sovereign Trio',
    genre: 'Inspiring Piano',
    duration: '0:25',
    audioUrl: '/music/ambient_preview.wav',
  },
  {
    id: 'track-5',
    title: 'Future Citizens of Truth',
    artist: 'ZenPulse Acoustic Collective',
    genre: 'Indie Folk / Uplifting',
    duration: '0:30',
    audioUrl: '/music/starboy_preview.wav',
  },
  {
    id: 'track-6',
    title: 'Smart Labs Pulse Wave',
    artist: 'Decentralized Audio Lab',
    genre: 'Cyber Electronic',
    duration: '0:25',
    audioUrl: '/music/cyber_preview.wav',
  },
];
